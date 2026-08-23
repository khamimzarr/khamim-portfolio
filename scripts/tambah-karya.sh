#!/bin/bash
set -e

# tambah-karya.sh — tambah project ke section Karya portfolio
# Usage: tambah-karya.sh "nama-project" "Deskripsi 1 baris" "HTML" "https://live.vercel.app" [--featured]
# Contoh: tambah-karya.sh "ruang-resepsi" "Undangan digital pernikahan — satu tautan/tamu via WA." "HTML" "https://ruang-resepsi.vercel.app"

PAGE="$HOME/khamim-portfolio/src/app/page.tsx"

if [[ "$1" == "--help" || "$1" == "-h" || $# -lt 4 ]]; then
  cat <<'HELP'
Usage:
  tambah-karya.sh "nama-project" "Deskripsi" "Lang" "https://live.vercel.app" [--featured|--no-featured]

Contoh:
  tambah-karya.sh "my-app" "Aplikasi catatan harian — simpel & cepat." "TypeScript" "https://my-app.vercel.app"
  tambah-karya.sh "my-app" "Deskripsi" "HTML" "https://my-app.vercel.app" --featured

Opsi:
  --featured     Tandai Featured (default)
  --no-featured  Tidak featured

Yang diubah di src/app/page.tsx:
  1. Tambah object ke projects[]
  2. Update "Tiga karya kecil" -> "Empat karya kecil" (angka kata)
  3. Update "Karya — 03" -> "Karya — 04" (footer)

Setelah ini:
  cd ~/khamim-portfolio && npm run build && git add src/app/page.tsx && git commit -m "feat: Karya jadi XX — tambah my-app"
HELP
  exit 0
fi

PROJ="$1"
DESC="$2"
LANG="$3"
LIVE="$4"
FEATURED="true"
if [[ "$5" == "--no-featured" ]]; then FEATURED="false"; fi

if [[ -z "$PROJ" || -z "$DESC" || -z "$LANG" || -z "$LIVE" ]]; then
  echo "❌ Argumen kurang. Lihat --help"
  exit 1
fi

if [[ ! -f "$PAGE" ]]; then
  echo "❌ Tidak ketemu $PAGE"
  exit 1
fi

# cek duplikat
if grep -q "name: \"$PROJ\"" "$PAGE"; then
  echo "⚠️  Project \"$PROJ\" sudah ada di Karya — skip tambah."
  grep -n "name:" "$PAGE" | head -20
  exit 0
fi

# hitung jumlah sekarang & sesudah
CURRENT=$(grep -c 'name: "' "$PAGE" || true)
NEXT=$((CURRENT + 1))

# mapping angka -> kata Indonesia (kapital awal sesuai copy portfolio)
kata() {
  case $1 in
    1) echo "Satu";; 2) echo "Dua";; 3) echo "Tiga";; 4) echo "Empat";;
    5) echo "Lima";; 6) echo "Enam";; 7) echo "Tujuh";; 8) echo "Delapan";;
    9) echo "Sembilan";; 10) echo "Sepuluh";; 11) echo "Sebelas";; 12) echo "Dua belas";;
    *) echo "$1";;
  esac
}
KATA_NEXT=$(kata $NEXT)
KATA_CURR=$(kata $CURRENT)
NEXT_PAD=$(printf "%02d" $NEXT)

echo "→ Tambah: $PROJ ($LANG) — $DESC"
echo "→ Live: $LIVE — featured: $FEATURED"
echo "→ Karya: $CURRENT → $NEXT ($KATA_CURR → $KATA_NEXT, Karya — $NEXT_PAD)"

python3 - "$PAGE" "$PROJ" "$DESC" "$LANG" "$LIVE" "$FEATURED" "$KATA_CURR" "$KATA_NEXT" "$NEXT_PAD" << 'PY'
import re, sys
page, proj, desc, lang, live, featured, kata_curr, kata_next, next_pad = sys.argv[1:10]

with open(page, 'r') as f:
    content = f.read()

# 1. Tambah ke projects[] — cari block const projects = [ ... ];
m = re.search(r'(const projects = \[)(.*?)(\n  \];)', content, re.DOTALL)
if not m:
    print("❌ Gagal cari const projects = [...] di page.tsx")
    sys.exit(1)

block = m.group(2)
entry = f'''
    {{
      name: "{proj}",
      desc: "{desc}",
      lang: "{lang}",
      href: "https://github.com/khamimzarr/{proj}",
      vercel: "{live}",
      featured: {featured},
    }},'''

# sisip sebelum penutup ];
new_block = block.rstrip() + entry + "\n"
new_content = content[:m.start(2)] + new_block + content[m.start(3):]

# 2. Update "X karya kecil" — ganti kata_curr -> kata_next (hanya 1x di section Karya)
# copy portfolio: "Tiga karya kecil yang tumbuh..."
if kata_curr in new_content:
    new_content = re.sub(re.escape(kata_curr) + r' karya kecil', kata_next + ' karya kecil', new_content, count=1)
else:
    # fallback: cari pola generik angka kata
    new_content = re.sub(r'\b(Satu|Dua|Tiga|Empat|Lima|Enam|Tujuh|Delapan|Sembilan|Sepuluh|Sebelas|Dua belas) karya kecil\b', kata_next + ' karya kecil', new_content, count=1)

# 3. Update "Karya — 0X" di footer — ganti semua kemunculan bernomor
new_content = re.sub(r'Karya — 0\d', f'Karya — {next_pad}', new_content)
# juga handle tanpa nol: Karya — 3 -> Karya — 04 (jaga konsisten 2 digit)
new_content = re.sub(r'Karya — (\d)(?!\d)', lambda x: f'Karya — {int(x.group(1)):02d}' if int(x.group(1)) != int(next_pad) else f'Karya — {next_pad}', new_content)

with open(page, 'w') as f:
    f.write(new_content)

print(f"✓ page.tsx terupdate — Karya sekarang {next_pad} ({kata_next})")
PY

echo ""
echo "✓ Selesai. Cek:"
grep -E 'name:|Karya —|karya kecil' "$PAGE" | head -20
echo ""
echo "Lanjut:"
echo "  cd ~/khamim-portfolio && npm run build"
echo "  git add src/app/page.tsx && git commit -m \"feat: Karya jadi $NEXT_PAD — tambah $PROJ\""
