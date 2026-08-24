#!/bin/bash
set -e
# update-alur.sh — auto-update ALUR-KERJA-SUPERPOWER.md setelah project selesai
# Append-only: tidak menimpa entry lama, cek duplikat dulu
# Usage: update-alur.sh "nama-project" "Deskripsi 1 baris" "BE|FE" "https://nama-project.vercel.app" [projectId]
# Contoh: update-alur.sh "catatan-harian" "Web catatan harian minimalis" "FE" "https://catatan-harian.vercel.app" "prj_xxx"

PROJ="${1:-}"
DESC="${2:-}"
STACK="${3:-}"
LIVE="${4:-}"
PROJID="${5:-}"

if [[ -z "$PROJ" ]]; then
  echo "Usage: $0 \"nama-project\" \"Deskripsi\" \"BE|FE\" \"https://live.vercel.app\" [projectId]"
  echo "  --help untuk bantuan"
  exit 1
fi
if [[ "$PROJ" == "--help" || "$PROJ" == "-h" ]]; then
  echo "Usage: $0 \"nama-project\" \"Deskripsi\" \"BE|FE\" \"https://live.vercel.app\" [projectId]"
  echo "Append-only — tidak menimpa entry lama. Cek duplikat: grep -q \$PROJ"
  exit 0
fi

# Resolve file (symlink-aware)
PORTFolio_DIR="$HOME/khamim-portfolio"
FILE="$PORTFolio_DIR/ALUR-KERJA-SUPERPOWERS.md"
ALIAS="$PORTFolio_DIR/ALUR-KERJA-SUPERPOWER.md"

if [[ ! -f "$FILE" ]]; then
  echo "❌ Tidak ketemu $FILE"
  exit 1
fi

# Duplikat guard
if grep -q "^\s*${PROJ}\s*—\|\"${PROJ}\"" "$FILE"; then
  echo "⚠️  $PROJ sudah ada di Contoh Real — skip append"
  grep -n "$PROJ" "$FILE" | head -n 5
  exit 0
fi

# Detect STACK if not given
if [[ -z "$STACK" ]]; then
  if [[ -d "$HOME/$PROJ/api" ]]; then STACK="BE (Vercel Functions & Blob)"; else STACK="FE"; fi
fi
if [[ -z "$LIVE" ]]; then LIVE="https://$PROJ.vercel.app"; fi
if [[ -z "$DESC" ]]; then DESC="$PROJ"; fi

# Try get projectId if not given and .vercel exists
if [[ -z "$PROJID" && -f "$HOME/$PROJ/.vercel/project.json" ]]; then
  PROJID=$(python3 -c "import json; print(json.load(open('$HOME/$PROJ/.vercel/project.json')).get('projectId',''))" 2>/dev/null || true)
fi

DATE=$(date +%Y-%m-%d)
ENTRY="${PROJ} — ${DATE} | ${STACK} | ${DESC} | ${LIVE} ${PROJID:+| $PROJID}"

echo "→ Append: $ENTRY"

python3 - "$FILE" "$ENTRY" << 'PY'
import re, sys
fpath, entry = sys.argv[1:3]
with open(fpath, 'r') as f:
    t = f.read()

# Cari blok ## Contoh Real sampai ## Bantuan / end
# Insert sebelum ## Bantuan, append ke dalam code block ```
if "## Contoh Real" not in t:
    print("❌ Gagal cari ## Contoh Real")
    sys.exit(1)

# Masukkan entry sebagai line baru di dalam blok Contoh Real (sebelum penutup ```)
# Blok: ``` ... ``` setelah ## Contoh Real
m = re.search(r'(## Contoh Real[^\n]*\n\n```)(.*?)(\n```)', t, re.DOTALL)
if m:
    inner = m.group(2).rstrip()
    # append
    new_inner = inner + "\n" + entry
    t = t[:m.start(2)] + new_inner + t[m.start(3):]
else:
    # fallback: append before ## Bantuan
    t = t.replace("## Bantuan", entry + "\n\n## Bantuan", 1)

with open(fpath, 'w') as f:
    f.write(t)
print(f"✓ {fpath} terupdate")
PY

# Sync alias singular
cp "$FILE" "$ALIAS" 2>/dev/null && echo "✓ Alias sync: $ALIAS"

# Also sync global symlinks if they exist
for g in "$HOME/ALUR-KERJA-SUPERPOWER.md" "$HOME/ALUR-KERJA-SUPERPOWERS.md" "$HOME/ALUR-KERJA-WEBAPP.md"; do
  if [[ -L "$g" ]]; then echo "✓ Global symlink OK: $g"; fi
done

echo ""
echo "Cek:"
grep -n "## Contoh Real" -A 30 "$FILE" | head -n 40
