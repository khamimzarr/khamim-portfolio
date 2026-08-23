# 📜 HANDOFF — Khamim Portfolio (Renaissance Gallery)

> **Status:** FITUR KOMPLIT & LIVE. Tier 1 ✔ + Foto asli ✔ + Tier 2 ✔ + Animasi ✔ + Copy ✔.
> Tinggal opsional polish lanjutan (SEO bemper, blog, testimon, upgrade Speed Insights).

> **Tanggal update:** 24 Aug 2026 — semua commit ter-push ke GitHub (remote HEAD `9f3bf7a`).

---

## 🔗 Link Penting

| Apa | URL |
|-----|-----|
| **Portfolio Live** | https://khamim-portfolio.vercel.app |
| **Alt URL** | https://khamim-portfolio-voiddarkfire.vercel.app |
| **GitHub — portfolio** | https://github.com/khamimzarr/khamim-portfolio |
| **GitHub — hr-ai-review** | https://github.com/khamimzarr/hr-ai-review |
| **HR AI Review Live** | https://hr-ai-review-nine.vercel.app |
| **Instagram** | https://instagram.com/bukann_bapakmu |
| **Vercel Project** | `khamim-portfolio` → team `voiddarkfire` (prj_p4q2IudMyYWnjHcHGKvOVT615Q5W) |
| **DESIGN.md** | `/data/data/com.termux/files/home/DESIGN.md` |

---

## ✅ Yang Sudah Selesai (KONDISI TERKINI — semua LIVE & PUSHED)

> Semua commit di bawah sudah diterapkan ke `khamim-portfolio.vercel.app` DAN di-push ke `khamimzarr/khamim-portfolio`.

### 1. Fondasi (Fase 1-3 original)
- [x] Fase 1: 4 lukisan public domain + 3 quotes museum
- [x] Fase 2: dev exact `DESIGN.md` tokens (Next 16 + Tailwind 4)
- [x] Fase 3: Vercel **new project** `khamim-portfolio` (TIDAK mengganggu `hr-ai-review`)

### 2. Tier 1 — struktur & performa
- [x] **Images → `next/image`** — `remotePatterns` (unsplash, wikimedia) di `next.config.ts`
- [x] **Notched Card** — `clip-path: polygon(0 0, calc(100%-18px) 0, 100% 18px, ...)` (hex clip)
- [x] **Grain texture** — `.texture-putty` SVG `fractalNoise` opacity 0.06 di hero
- [x] **Karya (Bone #e7e5e4)** — 4 repo: `hr-ai-review` (featured), `khamim-portfolio` (featured), `Clouds`, `dompetkua-pp`
- [x] **Build fix** — lokal `next build --webpack` (Android), Vercel `vercel-build = next build` (turbopack)

### 3. Wordmark — versi final
- [x] **Satu baris `KHAMIMZAR`** (bukan dua baris)
- [x] Size responsif: `fontSize: clamp(48px, 16.5vw, 374px)`, `lineHeight: 0.84`, `letterSpacing: -0.035em`
- [x] **Tidak pakai `130vw / -15vw` lagi** (dulu bikin crop miring / mobile kebawah)
- [x] Animasi carve: `.wordmark-carve` (letter-spacing lebar → rapat, geser naik)

### 4. Foto Hobi — Asli (crop galeri)
- [x] 6 vignette + 1 still life dari `/storage/emulated/0/Download/* (1).jpg`
- [x] Dikompres jadi 780-800x780-800, **center-square crop tegas** (biar lingkaran penuh isi foto, tanpa bg/padding putih)
- [x] File: `public/hobi/{foto-random, bersepeda, tanaman, ikan, coding, ngopi, foto-bunga}.jpg`
- [x] Foto `(1)` versi crop manual Khamim: `foto-random`, `bersepeda`, `ikan`, `coding`, `ngopi` — commpani crop galeri
- [x] `tanaman` & `foto-bunga` pakai versi lama (crop 780, sudah bersih)

### 5. Tier 2 polish — LIVE
- [x] **OG Image** — `public/og/og-cover.png` (1200x630 putty + KHAMIMZAR) + `metadata.openGraph.images`
- [x] **Favicon K** — `src/app/icon.svg` (lingkar 1.5px + K) → primary; `favicon.ico` default DIHAPUS
- [x] **Apple icon** — `src/app/apple-icon.png` 180x180
- [x] **Hamburger menu** — `src/components/Header.tsx` (`'use client'`), menu dropdown di `<768px`; desktop tetap horizontal
- [x] **Analytics** — `@vercel/analytics` + `@vercel/speed-insights` (di `layout.tsx`)
  - ⚠️ **Vercel Web Analytics: ENABLED** lewat CLI
  - ⚠️ **Speed Insights: kena limit hobby** (1 project/team). `khamim-portfolio` bukan pemegang-nya. Library ter-install tapi no-op. Kalau mau aktif → atau upgrade Pro, atau hapus Speed Insights dari project lain.
- [x] **SEO** — `metadata` lengkap: `title.template`, `keywords`, `authors`, `openGraph`, `twitter`, `robots` di `layout.tsx`

### 6. Paket Animasi — LIVE (24 Aug)
- [x] **Wordmark carve** (`src/app/globals.css` → `.wordmark-carve` + `@keyframes carve`)
- [x] **Staggered vignettes** — via `src/components/Reveal.tsx` (`'use client'`, IntersectionObserver) + delay bertingkat `i*90ms` per elemen
- [x] **Scroll-reveal konsisten** — `.reveal` di `globals.css` butuh `.in-view` (dipasang komponen `<Reveal>`). JANGAN pakai class `reveal` polos di server component tanpa `<Reveal>` (bisa stuck opacity:0!)
- [x] **Vignette hover polish** — `.vignette .v-image` zoom/brightness + `.v-caption` naik
- [x] **Ticker** — `src/components/Ticker.tsx` (`'use client'`), berjalan pelan di **3 pemisah** section (setelah Classical Panel, setelah Exhibition, sebelum Footer). Teks: KHAMIMZAR · PUTTY · INK · RENAISSANCE · FOTO · SEPEDA · TANAMAN · AQUARIUM · VIBES CODING · NGOPI

### 7. Copy / Narasi — rapi (24 Aug)
- [x] **Hero penutup**: "...karena hidup yang paling sederhana biasanya yang paling layak dipajang."
- [x] **About**: struktur naratif, tetap `...ngopi sambil ngerjain project — wkwk, tapi jadi.`
- [x] **Karya**: "...Empat karya kecil yang tumbuh dari ngopi & vibes coding...Dari catatan harian jadi halaman yang beneran dikunjungi."
- [x] **PERTAHANKAN** (khas Khamim, JANGAN diubah): CTA "ngopi sambil ngobrol project →", footer "Made with ngopi & vibes coding wkwk", caption vignette "wkwk tapi serius".

---

## 📌 Struktur Komponen (PENTING biar AI gak bingung)

```
src/app/
├── layout.tsx        # metadata SEO lengkap + <Analytics/> + <SpeedInsights/>
├── page.tsx          # halaman utama (SERVER component — jangan taruh onClick di sini)
├── globals.css       # token warna/radius, animasi (carve, reveal, ticker, vignette, word-fade)
├── icon.svg          # favicon K (primary)
└── apple-icon.png    # iOS icon
src/components/
├── Header.tsx        # 'use client' — nav + hamburger mobile
├── Reveal.tsx        # 'use client' — IntersectionObserver wrapper utk scroll-reveal (tambah class .in-view)
└── Ticker.tsx        # 'use client' — strip berjalan
```

**Pengaturan penting `globals.css`:**
- `.reveal { opacity:0; ... }` butuh `.reveal.in-view` dari `<Reveal>` client. **Jangan** taruh class `reveal` polos di markup server tanpa bungkus komponen — element akan tetap `opacity:0`.
- `.vignette` hover pakai `.v-image` & `.v-caption` — jangan di-remame sembarangan.

---

## 📋 TODO lanjutan (OPSIONAL — bukan kebutuhan)

> Semua yang di bawah TIDAK wajib. Sesuai arah Khamim, web jadinya "kisah singkat" — bukan template jualan. Jangan tambahkan hal yang memaksa CTA/skill/jualan kecuali diminta Khamim.

- [ ] **Speed Insights aktif** (butuh upgrade Pro atau hapus dari project lain di team hobby)
- [ ] **`sitemap.xml` + `robots.txt` + JSON-LD `Person`** (SEO lebih lengkap)
- [ ] **Vignette scroll-active hexagon** (IntersectionObserver indicator) — opsional
- [ ] **Blog/Notes section** — hanya kalau Khamim minta
- [ ] **Testimoni/kutipan** — hanya kalau ada
- [ ] **Foto asli tambahan** — Khamim kirim lagi ke `/storage/emulated/0/Download/`

---

## 🛠️ Cara Lanjut (STANDAR — AI wajib pakai ini)

```bash
cd ~/khamim-portfolio
npm install
npm run build      # lokal: next build --webpack (Android ARM)
npm run dev        # http://localhost:3000

# Build error Turbopack di Android? Pakai: npm run build (sudah di-scrip --webpack)
# Build error "Event handlers cannot be passed to Client Component props"?
#   → jangan taruh onClick/handler di server component (page.tsx). Bikin komponen 'use client'.

# Deploy (sudah link ke project khamim-portfolio)
vercel --prod --yes

# Git push (BUTUH TOKEN BARU — yang lama sudah di-revoke oleh owner)
# Owner akan kasih token `ghp_...` saat diminta. SETELAH dipakai, UNGSONG token & minta owner revoke.
export GITHUB_TOKEN="ghp_..."   # minta ke Khamim
git -C ~/khamim-portfolio push "https://$GITHUB_TOKEN@github.com/khamimzarr/khamim-portfolio.git" main
unset GITHUB_TOKEN
```

### 🔐 Keamanan token (PENTING)
- Jangan pernah komit token ke git / remote URL permanen.
- Setelah push, `unset GITHUB_TOKEN` dan **minta owner revoke** token di https://github.com/settings/tokens.
- `hr-ai-review/gas/install-properties.gs` & `AUDIT-REPORT.md` berisi key real (bynara `sk-nry-...`) — DIIGNORE & JANGAN di-push. Secret scanning Push Protection aktif.

### Catatan Vercel
- Project `khamim-portfolio`: framework `nextjs`, `ssoProtection: null` (publik).
- Web Analytics ENABLED. Speed Insights: limit hobby (lihat catatan).
- Alias utama `khamim-portfolio.vercel.app` (otomatis dari `vercel --prod`).

---

## 🎨 DESIGN.md Tokens (jangan diubah)

- **Putty** `#c4c3b6` canvas · **Ink** `#000000` · **Bone** `#e7e5e4` · **Chalk** `#ebebeb` · **Vellum** `#dfdcd5` · **Graphite** `#595855` · **Ash** `#808080` · **Paper** `#ffffff`
- **Davinci** = Playfair Display 400/500 (display 374/94/52px) · **Helvetica Now** = Inter 400/500 (9-26px utility)
- **Radius:** cards 9px, buttons 28.8px, links 2px · **No shadow, no gradient, flat only**
- **Wordmark:** cap `374px / 0.84 / -3.37px` — tapi sekarang pakai `clamp(48px,16.5vw,374px)` biar responsif
- **Imagery:** circular 200px + full-bleed classical panel

---

## 👤 Owner

- **Nama:** Khamim Zarkasyi
- **Email:** khamimzarrr@gmail.com
- **GitHub:** https://github.com/khamimzarr
- **Instagram:** https://instagram.com/bukann_bapakmu
- **Vercel:** `khamimzar-2499` / `voiddarkfire`

---

## 📝 Next Session Prompt (COPY-INI BILANG KE AI BARU)

> Lanjutkan project `khamim-portfolio` (Next.js 16 + Tailwind 4) di `~/khamim-portfolio`. Sudah LIVE di https://khamim-portfolio.vercel.app dan pushed ke `github.com/khamimzarr/khamim-portfolio` (HEAD `9f3bf7a`). Baca `HANDOFF.md` sini dulu — semua fitur sudah komplit: wordmark KHAMIMZAR responsif + carve, 6 foto hobi asli, 4 karya, hamburger, OG image, favicon K, animasi (Reveal/Ticker). Jangan tolak: ikuti `DESIGN.md` (putty/ink, flat, no shadow). Untuk butuh token push/data: minta ke owner Khamim (khamimzarrr@gmail.com). Jangan komit secret, jangan ganggu project `hr-ai-review`. Mulai tanpa merombak ulang yang sudah jalan.