#!/bin/bash
set -e
# hapus-karya.sh — hapus project dari Karya portfolio
# Usage: hapus-karya.sh "nama-project"
# Contoh: hapus-karya.sh "Clouds"

PAGE="$HOME/khamim-portfolio/src/app/page.tsx"

if [[ "$1" == "--help" || -z "$1" ]]; then
  cat <<'HELP'
Usage: hapus-karya.sh "nama-project"
Contoh: hapus-karya.sh "Clouds"
        hapus-karya.sh "dompetkua-pp"

Yang diubah:
  1. Hapus object dari projects[]
  2. Update "Empat karya kecil" -> "Tiga karya kecil"
  3. Update "Karya — 04" -> "Karya — 03"
HELP
  exit 0
fi

PROJ="$1"

if ! grep -q "name: \"$PROJ\"" "$PAGE"; then
  echo "⚠️  \"$PROJ\" tidak ada di Karya."
  grep -n 'name: "' "$PAGE"
  exit 0
fi

CURRENT=$(grep -c 'name: "' "$PAGE")
NEXT=$((CURRENT - 1))
kata() {
  case $1 in
    1) echo "Satu";; 2) echo "Dua";; 3) echo "Tiga";; 4) echo "Empat";;
    5) echo "Lima";; 6) echo "Enam";; 7) echo "Tujuh";; 8) echo "Delapan";;
    9) echo "Sembilan";; 10) echo "Sepuluh";; *) echo "$1";;
  esac
}
KATA_NEXT=$(kata $NEXT)
KATA_CURR=$(kata $CURRENT)
NEXT_PAD=$(printf "%02d" $NEXT)

echo "→ Hapus: $PROJ — Karya $CURRENT → $NEXT ($KATA_CURR → $KATA_NEXT)"

python3 - "$PAGE" "$PROJ" "$KATA_CURR" "$KATA_NEXT" "$NEXT_PAD" << 'PY'
import re, sys
page, proj, kata_curr, kata_next, next_pad = sys.argv[1:6]
with open(page) as f:
    c = f.read()

# hapus entry projects — regex:  { name: "PROJ", ... featured: x, },
# cari block project dengan name tersebut
pattern = re.compile(
    r'\s*\{\s*name:\s*"' + re.escape(proj) + r'".*?featured:\s*(true|false),\s*\},?',
    re.DOTALL
)
c2, n = pattern.subn('', c, count=1)
if n == 0:
    print(f"❌ Gagal hapus {proj}")
    sys.exit(1)

# update copy karya kecil
c2 = re.sub(re.escape(kata_curr) + r' karya kecil', kata_next + ' karya kecil', c2, count=1)
# update footer Karya — 0X
c2 = re.sub(r'Karya — 0\d', f'Karya — {next_pad}', c2)

with open(page, 'w') as f:
    f.write(c2)
print(f"✓ Terhapus — Karya sekarang {next_pad} ({kata_next})")
PY

grep -E 'name:|Karya —|karya kecil' "$PAGE" | head -20
echo "Lanjut: cd ~/khamim-portfolio && npm run build && git commit -am \"feat: Karya jadi $NEXT_PAD — hapus $PROJ\""
