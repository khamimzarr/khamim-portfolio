# Alur Kerja — Project Baru ke GitHub + Masuk Portfolio

> Replikasi persis alur `ruang-resepsi` (23 Aug 2026). Copy-paste aja.

## Prasyarat
- Token GitHub `ghp_...` (buat di https://github.com/settings/tokens/new → centang `repo` → Generate)
- Folder project sudah ada di `~/nama-project` (misal `~/ruang-resepsi`, `~/my-app`)

---

## 1. Siapkan Folder Project Baru

```bash
ls ~/nama-project
cat ~/nama-project/.gitignore  # pastikan ada .vercel, *.bak, node_modules, .env
```

Template `.gitignore` minimal:
```
.vercel
*.bak
node_modules
.env
.env.local
```

## 2. Git Init & Commit Lokal (jika belum ada .git)

```bash
cd ~/nama-project
if [ ! -d .git ]; then git init -b main; fi
git config user.name "Khamim Zarkasyi"
git config user.email "khamimzarrr@gmail.com"

# pastikan tidak ada secret
grep -r "ghp_\|sk-\|api_key" . --include="*.html" --include="*.js" --include="*.ts" | head

git add .gitignore README.md index.html vercel.json og-image.png  # sesuaikan file
# atau: git add .   (pastikan .gitignore sudah benar)
git commit -m "feat: nama-project — deskripsi singkat

Live: https://nama-project.vercel.app"
git log --oneline -2
```

## 3. Buat Repo GitHub + Push

```bash
export GITHUB_TOKEN="ghp_xxx_kamu"

# Cek repo belum ada (404 = belum ada, 200 = sudah ada)
curl -s https://api.github.com/repos/khamimzarr/nama-project | grep '"message"'

# Buat repo baru (skip jika sudah ada)
curl -s -X POST https://api.github.com/user/repos \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d '{"name":"nama-project","description":"Deskripsi singkat","private":false}' | grep '"html_url"'

# Push project
if git -C ~/nama-project remote get-url origin >/dev/null 2>&1; then
  git -C ~/nama-project remote set-url origin "https://$GITHUB_TOKEN@github.com/khamimzarr/nama-project.git"
else
  git -C ~/nama-project remote add origin "https://$GITHUB_TOKEN@github.com/khamimzarr/nama-project.git"
fi
git -C ~/nama-project push -u origin main

# Bersihkan token dari remote
git -C ~/nama-project remote set-url origin https://github.com/khamimzarr/nama-project.git
```

## 4. Tambah ke Portfolio — Karya

### 4a. Otomatis (pakai script)
```bash
~/khamim-portfolio/scripts/tambah-karya.sh "nama-project" "Deskripsi 1 baris" "HTML" "https://nama-project.vercel.app"
# contoh:
# ~/khamim-portfolio/scripts/tambah-karya.sh "ruang-resepsi" "Undangan digital pernikahan — satu tautan personal per tamu via WA. Frontend-only." "HTML" "https://ruang-resepsi.vercel.app"
```

### 4b. Manual (edit 3 tempat di `src/app/page.tsx`)
```tsx
// 1. Array projects — tambah object baru (featured:true untuk highlight)
{
  name: "nama-project",
  desc: "Deskripsi 1 baris — maksimal 140 char",
  lang: "HTML", // atau TypeScript/JavaScript
  href: "https://github.com/khamimzarr/nama-project",
  vercel: "https://nama-project.vercel.app",
  featured: true,
},

// 2. Paragraf Karya — update angka + kata
"Tiga karya kecil..." → "Empat karya kecil..." // 3→4, Tiga→Empat
// Kata: 1 Satu, 2 Dua, 3 Tiga, 4 Empat, 5 Lima, 6 Enam

// 3. Footer Exhibition — update nomor
Karya — 03 → Karya — 04
```

Cek:
```bash
grep -E "name:|Karya —|karya kecil" ~/khamim-portfolio/src/app/page.tsx
```

## 5. Build + Commit + Push Portfolio + Deploy

```bash
cd ~/khamim-portfolio
npm run build   # harus ✓ Compiled successfully

git add src/app/page.tsx
git commit -m "feat: Karya jadi 04 — tambah nama-project, update copy & footer"
git push "https://$GITHUB_TOKEN@github.com/khamimzarr/khamim-portfolio.git" main

vercel --prod --yes  # deploy ke https://khamim-portfolio.vercel.app
sleep 3; curl -s https://khamim-portfolio.vercel.app | grep -o "nama-project\|Karya — 0" | head
```

## 6. Keamanan Token — WAJIB

```bash
unset GITHUB_TOKEN
env | grep GITHUB_TOKEN || echo "env bersih"
git -C ~/nama-project remote -v      # pastikan tanpa ghp_
git -C ~/khamim-portfolio remote -v  # pastikan tanpa ghp_
```

Lalu **revoke** di https://github.com/settings/tokens → Delete token lama → generate baru next time.
> Jangan pernah `git push https://ghp_...@github.com/...` tanpa unset, jangan commit token ke file.

---

## Cheat Sheet — One Liner (ganti 4 variabel)

```bash
PROJ="nama-project"; DESC="Deskripsi 1 baris"; LANG="HTML"; LIVE="https://nama-project.vercel.app"
export GITHUB_TOKEN="ghp_xxx"
curl -s -X POST https://api.github.com/user/repos -H "Authorization: token $GITHUB_TOKEN" -d "{\"name\":\"$PROJ\",\"private\":false}" | grep html_url
git -C ~/$PROJ remote add origin "https://$GITHUB_TOKEN@github.com/khamimzarr/$PROJ.git" 2>/dev/null || git -C ~/$PROJ remote set-url origin "https://$GITHUB_TOKEN@github.com/khamimzarr/$PROJ.git"
git -C ~/$PROJ push -u origin main && git -C ~/$PROJ remote set-url origin https://github.com/khamimzarr/$PROJ.git
~/khamim-portfolio/scripts/tambah-karya.sh "$PROJ" "$DESC" "$LANG" "$LIVE"
cd ~/khamim-portfolio && npm run build && git add src/app/page.tsx && git commit -m "feat: Karya jadi XX — tambah $PROJ" && git push "https://$GITHUB_TOKEN@github.com/khamimzarr/khamim-portfolio.git" main && vercel --prod --yes
unset GITHUB_TOKEN
```

## Contoh Real — ruang-resepsi (23 Aug 2026)

```
~/ruang-resepsi → https://github.com/khamimzarr/ruang-resepsi (3ec3519, 6 files)
~/khamim-portfolio → Karya 04→03 (hapus Clouds, dompetkua-pp), tambah ruang-resepsi featured
Push: 9f3bf7a..a4a6c1a → vercel deploy dpl_8C3fp1RM6RruGBEzeGkLdGF3hduM → live ✅
```

## Hapus Project dari Karya

Hapus object dari `projects[]` di `page.tsx`, update `karya kecil` & `Karya — 0X` (kurangi 1), lalu `npm run build` → commit → push → vercel.

## Bantuan

```bash
cat ~/khamim-portfolio/ALUR-KERJA-PROJECT-BARU.md
~/khamim-portfolio/scripts/tambah-karya.sh --help
```
