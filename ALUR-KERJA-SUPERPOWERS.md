# Alur Kerja — Web/WebApp dengan Superpowers + Vercel + GitHub + Portfolio

> Companion dari `ALUR-KERJA-PROJECT-BARU.md`. Bedanya: **ini jalur full Superpowers** (brainstorming → plans → build → verify → deploy → push → portfolio). Copy-paste aja — replikasi persis `ruang-resepsi` 24 Aug 2026 (A+backend: 1 foto prewed + `/u/:id` 7-hari, HTML + Vercel Functions & Blob).

## Ringkasan Tabel (Quick View) — gak bikin bingung

> Tabel ini **cuma ringkasan** biar cepat koreksi. Yang jadi **sumber kebenaran tetap detail per fase di bawahnya**. Detail override tabel kalau beda — jadi gak bingung.

| Fase | Nama | Skill | Apa terjadi | Gate `gas`? | Guard biar gak nimpa | Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | **Ide → Brainstorming** | `brainstorming` + `using-superpowers` | Klasifikasi **Spike / Bounded / Architectural** → **WAJIB TANYA DULU:** `Kamu sudah punya design atau mau aku yang buatkan? (A) Aku sudah ada — kirim Figma/link (B) Tolong bikinin — sebut warna/vibe` → tunggu jawabanmu | **YA — HARD GATE** | - | Desain pendek di chat |
| **1** | **Rencana** | `writing-plans` jika Architectural | Architectural → `docs/superpowers/specs/YYYY-MM-DD-topik-design.md`<br>Bounded → desain chat 3-6 paragraf | **YA** | - | Spec |
| **2** | **Eksekusi** | `subagent-driven-development` atau `executing-plans` + `test-driven-development` | FE: `index.html`<br>BE: `api/*` + `vercel.json /u/:id` + `package.json @vercel/blob` + compress foto `900px q0.6` | Tidak | - | Code `~/nama-project` |
| **3** | **Verifikasi** | `verification-before-completion` | `node --check`, `npm run build`, `curl` live cek `foto`, `+62`, `QR`, `musik` | **YA** | - | `JS OK` `API OK` |
| **4** | **Deploy Vercel — CREATE NEW (Jangan Timpa)** | - | **Vercel sudah terintegrasi** — **WAJIB bikin project baru, bukan timpa yang lama**<br>Guard: cek `.vercel/project.json` harus `== $PROJ` else `rm -rf .vercel` → `vercel --prod --yes` di folder baru = create new `nama-project` di `voiddarkfire` | Tidak | **Anti-timpa:** cek `.vercel/project.json` + `vercel ls` sebelum deploy | Live baru `READY` (bukan overwrite) |
| **5** | **Git → Push** | - | `git init -b main` → `add` (`.gitignore: .vercel,*.bak,node_modules,package-lock,.env*`) → `commit` → `POST /user/repos` jika `404` → `remote https://$GITHUB_TOKEN@...` → `push -u` → `remote set-url https://github...` | Tidak | Cek `curl /repos/khamimzarr/$PROJ` `404` baru create | `github.com/khamimzarr/$PROJ` |
| **6** | **Portfolio — Karya** | - | `tambah-karya.sh "$PROJ" "$DESC" "$LANG" "$LIVE"` → `npm run build ✓` → `add/commit/push portfolio` → `vercel --prod --yes` (deploy portfolio, bukan nimpa project baru) | Tidak | - | `Karya — 03→04` live |
| **7** | **Keamanan Token** | - | `unset GITHUB_TOKEN` → `env` bersih → `remote -v` tanpa `ghp_` → revoke di `github.com/settings/tokens` | **WAJIB** | - | `env bersih` |
| **8** | **Auto-update ALUR** | - | **Otomatis** setelah Fase 7: `scripts/update-alur.sh "$PROJ" "$DESC" "BE|FE"` → append entry baru ke `## Contoh Real` (tanggal, stack, live, projectId). **Append-only, tidak menimpa** project lama | Tidak | `grep -q $PROJ` skip jika sudah ada | File terupdate + siap `git push` |

> Trigger kamu (dua-duanya jalan): `baca ALUR-KERJA-SUPERPOWER.md saya mau buat project baru "nama-project — ide"` atau `SUPERPOWERS` (pakai S).

## Kapan Pakai Skill Apa

| Situasi | Skill |
|---|---|
| Baru bilang "buat web X" / "bisa gak X?" | `brainstorming` **WAJIB dulu** — klasifikasi Spike/Bounded/Architectural, hard gate: jelasin desain → nunggu `gas` |
| Butuh spec tertulis (web baru, BE baru) | `writing-plans` → tulis `docs/superpowers/specs/YYYY-MM-DD-topik-design.md` |
| Eksekusi rencana bertahap | `executing-plans` (jeda review) atau `subagent-driven-development` (paralel di sesi ini) |
| Nambah fitur kecil ke flow yang sudah ada | `test-driven-development` dulu baru code |
| Ada bug / test fail | `systematic-debugging` dulu baru fix |
| Mau claim selesai / push / PR | `verification-before-completion` dulu — run `npm run build`, `node --check`, `curl` live |
| Mau merge / close branch | `finishing-a-development-branch` |

> Aturan keras: **invoke skill SEBELUM nanya/buka file** (lihat `using-superpowers`). `using-git-worktrees` kalau mau isolasi kerja, tapi untuk alur ini cukup branch `main` aja.

---

## Prasyarat

- Node `v26`, **Vercel sudah terintegrasi penuh** — `vercel whoami` langsung `khamimzar-2499` di team `voiddarkfire` (skip `vercel login`, langsung `vercel --prod --yes` + `vercel blob create-store`)
- Token GitHub `ghp_...` — buat di https://github.com/settings/tokens/new:
  - Untuk **create/push biasa**: centang `repo`
  - Untuk **hapus repo**: tambah `delete_repo` (flux: `Tdrive`, `Clouds` kemarin butuh ini)
- Project ada di `~/nama-project` (contoh `~/ruang-resepsi`, `~/my-app`)

Cek cepat:
```bash
node -v; vercel whoami; vercel --version
ls ~/nama-project | head -n 20
cat ~/nama-project/vercel.json 2>/dev/null; cat ~/nama-project/package.json 2>/dev/null
```

---

## Fase 0 — Ide → Brainstorming (HARD GATE)

Jangan langsung `git init` / nulis code.

1. User: "buat web X" → kamu invoke `brainstorming`
2. Klasifikasi:
   - **Spike** = "bisa gak?" — cukup 2-3 kalimat probe → minta nod → investigasi murah
   - **Bounded** = ubah 1 flow yang sudah ada (contoh: tambah field foto di Setup) — tanya 1 per 1 → desain pendek di chat → **STOP, tunggu `gas`**
   - **Architectural** = web/webapp baru + BE (contoh: `ruang-resepsi` + `api/*` + `Blob`) — tanya bertahap → 2-3 pendekatan + rekomendasi → desain per section → tulis spec → tunggu `gas`
3. **Tanya sumber desain — WAJIB sebelum bikin desain apa pun:**
   > "Kamu sudah punya design atau mau aku yang buatkan? (A) Aku sudah ada — kirim Figma/link/gambar/referensi (B) Tolong bikinin — sebut warna/style/vibe yang kamu mau"
   - Tunggu jawaban user dulu. Jika (A): pakai design user sebagai acuan, jangan override. Jika (B): kamu propose 2-3 opsi style (sesuai konteks) lalu minta pilih.
   - Baru setelah ini susun/present desain → hard gate `gas`.
4. Hidden complexity naik kelas → upgrade path, ulangi gate.

Contoh chat (kayak `foto prewed A` 24 Aug):
```
Ini Bounded — 1 foto hero upload file, compress canvas 900px JPEG 0.6 ~40KB, param foto di URL.
Kamu sudah punya design untuk foto hero ini atau mau aku yang bikinin? (A) ada Figma/referensi (B) aku bikinin
Setuju desain ini aku eksekusi? Balas gas untuk lanjut.
```
Baru setelah `gas` → lanjut Fase 1.

---

## Fase 1 — Rencana

### Jika Architectural (web baru / subsystem baru)
```bash
# skill: writing-plans
# Output: docs/superpowers/specs/YYYY-MM-DD-topik-design.md + rencana eksekusi
# Review: kamu baca spec → "gas" lagi baru mulai coding
```

### Jika Bounded (fitur ke flow existing)
Cukup desain di chat (3-6 paragraf + file yang disentuh + testing) — tanpa file spec. Tetap tunggu `gas`.

---

## Fase 2 — Eksekusi (FE/BE)

Pilih **satu** (sesuai skill):

```bash
# Opsi paralel di sesi sekarang:
# → pakai subagent-driven-development

# Opsi bertahap dengan review:
# → pakai executing-plans
```

### Template FE-only (single-file HTML — kayak ruang-resepsi awal)
```
~/nama-project/
  index.html      # semua state + logic + style
  og-image.png
  vercel.json
  README.md
```

### Template WebApp BE (Vercel Functions + Blob) — kayak A+backend 24 Aug
```
~/nama-project/
  api/
    create.js     # POST /api/create → gen id, put Blob prewed/id.jpg + invites/id.json
    invite.js     # GET /api/invite?id= → cek expiresAt (7 hari)
    cleanup.js    # GET /api/cleanup → cron 0 3 * * *
  index.html      # Setup: file input foto + compress canvas; Sender: /u/:id short link; Invitation: /u/:id page
  vercel.json     # cleanUrls + rewrites /u/:id → / + crons
  package.json    # { dependencies: { "@vercel/blob": "^0.27.0" } }
```

#### `vercel.json` BE
```json
{
  "cleanUrls": true,
  "rewrites": [{ "source": "/u/:id", "destination": "/" }],
  "crons": [{ "path": "/api/cleanup", "schedule": "0 3 * * *" }]
}
```
> Catatan `ruang-resepsi`: `destination "/"` (bukan `/index.html`) biar gak `308` → `cleanUrls`.

#### `package.json` BE
```json
{
  "name": "nama-project",
  "private": true,
  "type": "module",
  "dependencies": { "@vercel/blob": "^0.27.0" }
}
```

#### `.gitignore` template
```
.vercel
*.bak
node_modules
package-lock.json
.env
.env.local
```

#### `api/create.js` inti (sketsa `ruang-resepsi`)
```js
import { put, list } from '@vercel/blob';
const id = genId(6); // 6 char base62
// fotoDataUrl: data:image/jpeg;base64,... (~40KB hasil compress canvas 900px q0.6)
// put(`prewed/${id}.jpg`, buf, { access:'public' }) → fotoUrl
// put(`invites/${id}.json`, bundle, { access:'public' })
// bundle: { id, pria, wanita, tanggal, jam, lokasi, maps, acara, fotoUrl, fotoPath, createdAt, expiresAt: +7 hari }
// expiresAt = new Date(Date.now()+7*86400000).toISOString()
```

#### Frontend foto (compress di browser — sebelum upload)
```js
// FileReader → Image → canvas scale maxSide 900 → toDataURL jpeg 0.6
// if >70KB → turun ke 700 q0.55; >140KB → tolak
// preview <img id="setup-foto-img">, state _fotoDataUrl (kirim ke /api/create)
```

---

## Fase 3 — Verifikasi (WAJIB sebelum claim "selesai")

Skill: `verification-before-completion` — jangan `vercel --prod` sebelum ini hijau.

```bash
cd ~/nama-project

# JS syntax (single-file)
python3 << 'PY'
import pathlib, re
h=pathlib.Path('index.html').read_text()
blocks=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',h,re.DOTALL)
last=max([b for b in blocks if len(b.strip())>200], key=len)
print("last script len",len(last))
PY
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const re=/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g;let m,last='';while(m=re.exec(h))if(m[1].trim().length>200)last=m[1]; new Function(last); console.log('JS syntax OK')"

# API syntax
node --check api/create.js && echo "create.js OK"
node --check api/invite.js && echo "invite.js OK"

# Build portfolio kalau ubah page.tsx; untuk single-file HTML skip npm build

# Live checks (setelah vercel --prod)
curl -s https://nama-project.vercel.app/ | grep -o "setup-foto\|cover-foto-wrap" | head
curl -s https://nama-project.vercel.app/api/invite?id=NOTEXIST | grep expired
curl -s -X POST https://nama-project.vercel.app/api/create -H "Content-Type: application/json" -d '{"pria":"A","wanita":"B","tanggal":"2026-09-20","jam":"10:00","lokasi":"L","maps":"https://maps.app.goo.gl/x"}' | python3 -m json.tool | head
# Cek 2 tombol maps searah 1 link, QR qrcodejs, musik soundhelix, WA +62
curl -s https://nama-project.vercel.app/ | grep -o 'qrcodejs[^"]*\|sender-wa[^"]*\|audio-bg[^"]*'
```

---

## Fase 4 — Deploy Vercel — CREATE NEW (Jangan Timpa)

> **Aturan anti-timpa:** setiap project baru = `vercel` **create new project**, bukan overwrite yang lama. Vercel sudah terintegrasi full — langsung pakai.

```bash
cd ~/nama-project

# 0) Guard biar gak nimpa project lama — WAJIB sebelum vercel --prod
if [ -f .vercel/project.json ]; then
  echo "⚠️ .vercel sudah ada:"
  cat .vercel/project.json | python3 -c "import json; print('linked project:', json.load(open('.vercel/project.json')).get('projectName'))"
  # Harus == nama-project. Kalau beda (mis. masih ruang-resepsi padahal mau buat catatan-harian) → abort!
  # Fix: rm -rf .vercel   # atau vercel link --project nama-baru --yes
  # Jangan pernah vercel --prod di folder ruang-resepsi untuk project baru!
fi
vercel ls 2>&1 | grep -q "nama-project" && echo "project nama-project sudah ada di Vercel — cek nama!" || echo "new project — akan create"
# Folder baru ~/nama-baru (belum ada .vercel) → vercel --prod --yes otomatis create new project di voiddarkfire

# 1) Jika pakai Blob (1 foto prewed — A)
vercel blob create-store nama-project-store --access public --yes
# → auto .env.local: BLOB_READ_WRITE_TOKEN + vercel env set Production/Preview/Development
cat .env.local | head -n 2
vercel blob list-stores 2>&1 | head -n 10
vercel env ls 2>&1 | head -n 20

# 2) Deploy — CREATE NEW
vercel --prod --yes
# harus create: https://nama-project-xxxx-voiddarkfire.vercel.app → alias https://nama-project.vercel.app
# BUKAN nimpa ruang-resepsi!
sleep 3; curl -s https://nama-project.vercel.app/ | head -n 20
curl -sI https://nama-project.vercel.app/u/TEST123 | head -n 15      # rewrite harus 200 (untuk /u/:id)
curl -s "https://nama-project.vercel.app/api/invite?id=TEST123" | head -c 300

# Cron (opsional cek)
curl -s https://nama-project.vercel.app/api/cleanup | python3 -m json.tool | head

# Verifikasi gak nimpa:
vercel ls 2>&1 | grep -E "ruang-resepsi|nama-project" | head -n 10
```

---

## Fase 5 — Git Init → Commit → Create Repo → Push

Ikuti `ALUR-KERJA-PROJECT-BARU.md` persis.

```bash
cd ~/nama-project
if [ ! -d .git ]; then git init -b main; fi
git config user.name "Khamim Zarkasyi"
git config user.email "khamimzarrr@gmail.com"

grep -r "ghp_\|sk-\|api_key\|BLOB_READ_WRITE_TOKEN" . --include="*.html" --include="*.js" --include="*.ts" | grep -v node_modules | head

git add .gitignore vercel.json index.html package.json api/ README.md PANDUAN-EDIT.md og-image.png  # sesuaikan
# atau: git add .   (pastikan .gitignore benar)
git commit -m "feat: nama-project — deskripsi singkat (FE + BE 7-hari jika ada)

Live: https://nama-project.vercel.app"
git log --oneline -2

export GITHUB_TOKEN="ghp_xxx"
curl -s https://api.github.com/repos/khamimzarr/nama-project | grep '"message"'  # 404 = belum ada
curl -s -X POST https://api.github.com/user/repos -H "Authorization: token $GITHUB_TOKEN" \
  -d '{"name":"nama-project","description":"Deskripsi 1 baris — 140char","private":false}' | grep '"html_url"'

if git -C ~/nama-project remote get-url origin >/dev/null 2>&1; then
  git -C ~/nama-project remote set-url origin "https://$GITHUB_TOKEN@github.com/khamimzarr/nama-project.git"
else
  git -C ~/nama-project remote add origin "https://$GITHUB_TOKEN@github.com/khamimzarr/nama-project.git"
fi
git -C ~/nama-project push -u origin main
git -C ~/nama-project remote set-url origin https://github.com/khamimzarr/nama-project.git
```

---

## Fase 6 — Tambah ke Portfolio — Karya

### Otomatis (pakai script)
```bash
~/khamim-portfolio/scripts/tambah-karya.sh "nama-project" "Deskripsi 1 baris — 140char" "TypeScript" "https://nama-project.vercel.app"
# contoh BE: "Undangan digital — /u/:id via WA, 1 foto prewed & auto-hapus 7 hari. HTML + Vercel Functions & Blob."
# contoh FE: "HTML" / "TypeScript" / "JavaScript"
grep -E "name:|Karya —|karya kecil" ~/khamim-portfolio/src/app/page.tsx | head -n 20
```

Jika upgrade repo existing (kayak `ruang-resepsi` HTML → TypeScript+BE):
```bash
# edit manual: name: "ruang-resepsi" → lang: "TypeScript", desc: "... HTML + Vercel Functions & Blob."
grep -n 'name: "ruang-resepsi"' ~/khamim-portfolio/src/app/page.tsx -A 4
```

### Build + Push Portfolio + Deploy
```bash
cd ~/khamim-portfolio
npm run build   # harus ✓ Compiled successfully
git add src/app/page.tsx
git commit -m "feat: Karya jadi 04 — tambah nama-project, update copy & footer"
git push "https://$GITHUB_TOKEN@github.com/khamimzarr/khamim-portfolio.git" main
vercel --prod --yes
sleep 3; curl -s https://khamim-portfolio.vercel.app | grep -o "nama-project\|Karya — 0" | head
```

Hapus dari Karya: hapus object `projects[]`, `karya kecil` `Empat→Tiga`, `Karya — 04→03`, lalu `npm run build` → commit → push → vercel.

---

## Fase 7 — Keamanan Token — WAJIB

```bash
unset GITHUB_TOKEN
env | grep GITHUB_TOKEN || echo "env bersih"
git -C ~/nama-project remote -v      # tanpa ghp_
git -C ~/khamim-portfolio remote -v  # tanpa ghp_
```

Revoke di https://github.com/settings/tokens → Delete → generate baru next time.

> Jangan commit token ke file, jangan push dengan `https://ghp_...@github.com` tanpa unset.

---

## Fase 8 — Auto-update ALUR-KERJA-SUPERPOWER.md (Otomatis)

> Setelah Fase 7, **otomatis** update dokumentasi — tidak manual, tidak menimpa entry lama (append-only). Vercel tidak tertimpa karena Fase 4 sudah guard create-new.

```bash
~/khamim-portfolio/scripts/update-alur.sh "nama-project" "Deskripsi 1 baris — 140char" "BE|FE" "https://nama-project.vercel.app"
# → cek grep -q nama-project skip jika sudah ada
# → insert line baru di ## Contoh Real — ruang-resepsi 24 Aug 2026 (append, bukan timpa)
# → cat ~/khamim-portfolio/ALUR-KERJA-SUPERPOWERS.md | grep -A2 "## Contoh Real"
# Dipanggil otomatis di akhir alur — kamu gak perlu edit manual
```

Script `scripts/update-alur.sh`:
- Input: `PROJ`, `DESC`, `STACK` (FE/BE), `LIVE`
- Cari blok `## Contoh Real` di `ALUR-KERJA-SUPERPOWERS.md`, append ````
PROJ — YYYY-MM-DD | STACK | LIVE | projectId
````
- Jika `PROJ` sudah ada → skip (idempotent)
- `cp` sync ke `ALUR-KERJA-SUPERPOWER.md` (alias singular)

---

## Cheat Sheet — One Liner Full (ganti 5 variabel di atas)

```bash
PROJ="nama-project"; DESC="Deskripsi 1 baris — 140char"; LANG="TypeScript"; LIVE="https://nama-project.vercel.app"; REPO_DESC="Deskripsi 1 baris"
# 1) brainstorming dulu, klasifikasi Bounded/Architectural, nunggu gas
# 2) blob (jika BE):
vercel blob create-store $PROJ-store --access public --yes 2>&1 | head
# 3) verify:
node -e "const h=require('fs').readFileSync('$HOME/$PROJ/index.html','utf8');let m,last='';const re=/<script[^>]*>([\s\S]*?)<\/script>/g;while(m=re.exec(h))if(m[1].trim().length>200)last=m[1]; new Function(last); console.log('JS OK')" && node --check $HOME/$PROJ/api/create.js && echo "API OK"
# 4) deploy:
vercel --cwd $HOME/$PROJ --prod --yes
# 5) git + github:
export GITHUB_TOKEN="ghp_xxx"
git -C ~/$PROJ remote add origin "https://$GITHUB_TOKEN@github.com/khamimzarr/$PROJ.git" 2>/dev/null || git -C ~/$PROJ remote set-url origin "https://$GITHUB_TOKEN@github.com/khamimzarr/$PROJ.git"
git -C ~/$PROJ push -u origin main && git -C ~/$PROJ remote set-url origin https://github.com/khamimzarr/$PROJ.git
curl -s -X POST https://api.github.com/user/repos -H "Authorization: token $GITHUB_TOKEN" -d "{\"name\":\"$PROJ\",\"description\":\"$REPO_DESC\",\"private\":false}" | grep html_url
# 6) portfolio:
~/khamim-portfolio/scripts/tambah-karya.sh "$PROJ" "$DESC" "$LANG" "$LIVE"
cd ~/khamim-portfolio && npm run build && git add src/app/page.tsx && git commit -m "feat: Karya jadi XX — tambah $PROJ" && git push "https://$GITHUB_TOKEN@github.com/khamimzarr/khamim-portfolio.git" main && vercel --prod --yes
# 7) bersihkan:
unset GITHUB_TOKEN; env | grep GITHUB_TOKEN || echo "env bersih"
```

---

## Contoh Real — ruang-resepsi 24 Aug 2026

```
Ide: "mempelai upload 1 foto prewed, link WA pendek, foto simpan 7 hari"
Brainstorming: Bounded (1 foto hero A) → Architectural setelah tambah /api + Blob + 7-hari → gas A2 (foto tetap bisa dibuka sebelum 7 hari, lewat 7 hari 410)
Eksekusi: api/create.js + api/invite.js + api/cleanup.js, vercel.json rewrites /u/:id→/, compress canvas 900px q0.6~40KB, foto(blob) + short /u/xxx
Verify: JS syntax OK 28665, create.js/invite.js OK, curl /api/create → 168.0 jam TTL, /u/V3Nybc?tamu= → cover-foto 220px
Deploy: vercel blob create-store ruang-resepsi-store --access public (store_zpZgtVgOvpE5px4A), vercel --prod 3× (CK7qYkDA → CrexVg8c → 463nPCJD)
GitHub: 26effcc (A+backend) → 06343da (hapus amplop) → push main 204 → https://github.com/khamimzarr/ruang-resepsi
Portfolio: HTML→TypeScript "HTML + Vercel Functions & Blob", build ✓ (11.5s), push 8c2a94a → vercel dpl_Akd8yaCBMsnUwR51KzNcxJUV1df2 → https://khamim-portfolio.vercel.app
Cleanup repos: Tdrive, 100-Days-Of-ML-Code, Clouds, dompetkua-pp → DELETE 204 → sisa 3 (hr-ai-review, khamim-portfolio, ruang-resepsi)
```

---

## Bantuan

```bash
cat ~/khamim-portfolio/ALUR-KERJA-PROJECT-BARU.md
cat ~/khamim-portfolio/ALUR-KERJA-SUPERPOWERS.md
```
