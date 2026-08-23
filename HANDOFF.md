# 📜 HANDOFF — Khamim Portfolio (Renaissance Gallery)

> **Status:** Tier 1 DONE + foto asli LIVE. Sisa Tier 2 polish.

**Terakhir update:** 23 Aug 2026 — 23:42 WIB

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

## ✅ Yang Sudah Selesai

### Hobi — Foto Asli (23 Aug 2026 23:42) — DEPLOYED ✅
- [x] **7 foto asli dari Download** di-kompres ke `public/hobi/` (800x800, 65-201KB):
  - `foto-random.jpg` (132K) — random foto.jpg
  - `bersepeda.jpg` (201K) — bersepeda.jpg (42M → 201K)
  - `tanaman.jpg` (141K) — tanaman di halaman.jpg
  - `ikan.jpg` (84K) — ikan aquarium.jpg
  - `coding.jpg` (96K) — coding.jpg
  - `ngopi.jpg` (115K) — ngopi.jpg (26M → 115K)
  - `foto-bunga.jpg` (65K) — foto bunga.jpg → still life about section
- [x] `page.tsx` vignettes ganti dari Unsplash ke `/hobi/*.jpg` + still life, captions "Foto asli — ..."
- [x] `next/image` dengan `width=400 height=400 sizes=200px`, circular crop dipertahankan
- [x] Vercel deploy `BEz5oSXF` — `https://khamim-portfolio.vercel.app` HTTP 200, semua `/hobi/*.jpg` 200

### Tier 1 (23 Aug 2026) — DEPLOYED
- [x] **Wordmark brutal crop** — `KHAMIMZAR` single word `374px` (`fontSize: 374px, letterSpacing: -3.37px, lineHeight: 0.84`) + `130vw / -15vw` crop, mobile `17vw`
- [x] **Images → next/image** — `next.config.ts` `remotePatterns: [images.unsplash.com, upload.wikimedia.org]` + `width=400 height=400 sizes=200px`
- [x] **Notched Card** — `clip-path: polygon(0 0, calc(100%-18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100%-18px))`
- [x] **Grain texture** — SVG `fractalNoise` overlay di hero `texture-putty` opacity 0.06
- [x] **Scroll reveal** — `reveal` + `reveal-d2` keyframes
- [x] **Karya (Bone #e7e5e4)** — 4 repo: `hr-ai-review` (featured), `khamim-portfolio` (featured), `Clouds`, `dompetkua-pp`
- [x] **Build fix** — `npm run build` pakai `--webpack` lokal (Android), `vercel-build` pakai turbopack di Vercel
- [x] **Vercel** — framework `nextjs`, SSO `disabled`, alias `khamim-portfolio.vercel.app`
- [x] **GitHub push** — `khamim-portfolio` clean push, `hr-ai-review` orphan clean history (tanpa secrets)

### Fase 1-3 Original
- [x] Fase 1 asset sourcing + 3 quotes museum
- [x] Fase 2 dev exact `DESIGN.md` tokens
- [x] Fase 3 vercel **new project** `khamim-portfolio` (tidak ganggu `hr-ai-review`)

---

## 📋 TODO — Tier 2 (Sisa Polish)

> Foto asli sudah DONE — sisa polish kecil.

### Prioritas Tier 2
- [x] **Ganti 6 foto Unsplash dengan foto asli** — DONE (lihat di atas)
- [ ] **OG Image + Favicon `K`**
  - Buat `src/app/opengraph-image.tsx` (Next.js dynamic OG)
  - Ganti `src/app/favicon.ico` jadi circled `K` (1.5px stroke, sama kayak header)

- [ ] **Mobile Header Hamburger**
  - Saat `< 768px`, sembunyikan `GitHub | Instagram | Karya | Exhibition` jadi drawer
  - Email `khamimzarrr@gmail.com` sudah `hidden md:inline` — pertahankan

- [ ] **Analytics**
  - `npm i @vercel/analytics @vercel/speed-insights` + pasang di `layout.tsx`

- [ ] **SEO Polish**
  - `sitemap.ts` + `robots.ts` + JSON-LD `Person` + edit `description` biar < 160 char

- [ ] **Vignette Aksesibilitas**
  - `alt` lebih deskriptif per hobi, `aria-label`, hexagon jadi indikator scroll aktif (IntersectionObserver)

---

## 🛠️ Cara Lanjut

```bash
cd ~/khamim-portfolio
npm install
npm run build   # lokal pakai --webpack (Android)
npm run dev     # http://localhost:3000

# Deploy (sudah link ke khamim-portfolio)
vercel --prod --yes

# Git push (butuh token baru — yang lama sudah di-revoke)
# Buat di https://github.com/settings/tokens/new → centang `repo`
git remote -v   # sekarang tanpa token
# Untuk push: git remote set-url origin https://<TOKEN>@github.com/khamimzarr/khamim-portfolio.git
# lalu git push, lalu kembalikan ke https://github.com/khamimzarr/khamim-portfolio.git
```

### Catatan Git `hr-ai-review`
- History sudah di-squash jadi 1 commit clean (`26f669e`) — file `gas/install-properties.gs` & `AUDIT-REPORT.md` (berisi key real) **tidak** ter-push karena `.gitignore`
- Secret scanning `push protection` tetap `enabled` di GitHub — push clean akan lolos, push dengan key real akan diblok

### Catatan Vercel
- Project `khamim-portfolio` sudah `framework: nextjs`, `ssoProtection: null` (publik)
- `build` lokal = `next build --webpack`, `vercel-build` = `next build` (turbopack di Linux Vercel)
- Alias utama: `khamim-portfolio.vercel.app` (otomatis dari `vercel --prod`)

---

## 🎨 DESIGN.md Tokens (jangan diubah)

- **Putty** `#c4c3b6` canvas, **Ink** `#000000`, **Bone** `#e7e5e4`, **Chalk** `#ebebeb`, **Vellum** `#dfdcd5`, **Graphite** `#595855`
- **Davinci** = Playfair Display 400/500 (display 374px, 94px, 52px), **Helvetica Now** = Inter 400/500 (9-26px utility)
- **Radius:** cards 9px, buttons 28.8px, links 2px — **no shadow, no gradient, flat only**
- **Wordmark:** `374px / 0.84 / -3.37px` — must be cropped `overflow-hidden`
- **Imagery:** circular 200px + full-bleed classical panel

---

## 👤 Owner

- **Nama:** Khamim Zarkasyi
- **Email:** khamimzarrr@gmail.com
- **GitHub:** https://github.com/khamimzarr
- **Instagram:** https://instagram.com/bukann_bapakmu
- **Vercel:** `khamimzar-2499` / `voiddarkfire`

---

## 📝 Next Session Prompt

> Lanjut project `khamim-portfolio` dari `HANDOFF.md` ini. Tier 1 + foto asli done, live di https://khamim-portfolio.vercel.app, repo https://github.com/khamimzarr/khamim-portfolio. Sisa Tier 2 polish: OG Image, favicon K, hamburger mobile, analytics, SEO.
