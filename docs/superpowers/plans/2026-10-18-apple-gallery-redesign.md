# Apple Gallery Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ganti seluruh tampilan portfolio dari Renaissance Putty ke panggung produk near-black dengan satu accent Apple Blue, tanpa mengubah URL, data nyata, atau foto asli.

**Architecture:** Satu halaman server component (`src/app/page.tsx`) yang dirender dari token di `src/app/globals.css`. Interaksi kecil dipisah ke komponen `'use client'` (Header, Reveal). Semua keputusan visual dipin di token CSS, dan diuji otomatis lewat `node --test` tanpa dependensi baru.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4, TypeScript, `node:test` (built-in) untuk pengujian.

**Spec:** `docs/superpowers/specs/2026-10-18-apple-gallery-redesign-design.md`

## Global Constraints

- Next.js 16, React 19, Tailwind 4, TypeScript. Tanpa dependensi baru.
- Build lokal: `npm run build` (sudah `next build --webpack`).
- `src/app/page.tsx` adalah server component. Handler hanya di komponen `'use client'`.
- Class `reveal` wajib dibungkus `<Reveal>`, kalau tidak elemen stuck `opacity: 0`.
- Palet: Gallery Black `#000000`, Charcoal Stage `#111111`, Ink `#1d1d1f`, Porcelain `#f5f5f7`, Paper `#ffffff`, Steel `#86868b`, Graphite `#6e6e73`, Control Charcoal `#333336`, Cloud Gray `#e8e8ed`, Apple Blue `#0071e3`, Link Blue `#0066cc`.
- Steel hanya untuk teks di atas permukaan gelap. Teks sekunder di permukaan terang memakai Graphite.
- Radius: kartu/media 28px, link 10px, badge 5px, input 980px, tombol/utility pill 9999px, utility control 36px.
- Tanpa drop shadow. Tanpa warna health (Pulse Red, Vital Green) dan tanpa orange status.
- Font: hanya Inter (400, 600). Playfair Display dilepas.
- Dial: ENERGY 2 / RHYTHM 3 / MOTION 2. Satu reveal kalem per section, tanpa stagger.
- Copy: em dash hanya di dua kalimat personal ini dan tidak di tempat lain: "ngopi sambil ngerjain project — wkwk, tapi jadi." dan "Pahit yang menyalakan ide — ngopi sambil ngulik project, wkwk tapi serius."
- Tanpa angka, testimoni, klaim, atau aset karangan (R-17, R-18, R-36, R-38).
- Setiap elemen interaktif punya tujuan nyata. Navbar hanya menunjuk section yang ada (R-24, R-26).
- Foto di `public/hobi/` dipertahankan apa adanya, rasio 1:1.
- Push GitHub butuh token dari owner. Jangan komit secret.

## Review Focus

Setiap baris di bawah ini punya pemiliknya. Tiga yang pertama dipin oleh test otomatis, sisanya oleh click-through Task 12 (karena butuh browser, bukan node).

- Layar 375px: wordmark hero yang di-clamp dan grid section tidak boleh menghasilkan overflow horizontal. (guard: Task 6 assert `clamp()`; verifikasi nyata di Task 12)
- Keyboard: menu mobile harus bisa dibuka, ditutup dengan Escape, dan semua elemen punya focus terlihat. (guard: Task 5 assert `aria-expanded` dan penanganan Escape; verifikasi Tab di Task 12)
- Kontras: teks sekunder di permukaan gelap (Steel) dan terang (Graphite) harus lolos AA, termasuk teks di atas foto. (guard: Task 2)
- Tautan: setiap `href` di nav dan kartu harus menunjuk section yang ada atau URL eksternal yang nyata, tanpa kontrol mati. (guard: Task 5 dan Task 7)
- Teks panjang: nama dan deskripsi project/hobi tidak boleh mendorong kartu-kartu bertabrakan atau keluar container di layar sempit. (verifikasi Task 12)

---

### Task 1: Test harness dan token design

**Files:**
- Create: `tests/tokens.test.mjs`
- Modify: `src/app/globals.css`
- Modify: `package.json`

**Interfaces:**
- Produces: token CSS `--color-gallery-black`, `--color-charcoal-stage`, `--color-ink`, `--color-porcelain`, `--color-paper`, `--color-steel`, `--color-graphite`, `--color-control-charcoal`, `--color-cloud-gray`, `--color-apple-blue`, `--color-link-blue`, `--radius-cards`, `--radius-links`, `--radius-badges`, `--radius-inputs`, `--radius-buttons`, `--radius-utilitycontrols`. Script npm `test`.

- [ ] **Step 1: Tulis test yang gagal**

`tests/tokens.test.mjs` membaca `src/app/globals.css` sebagai teks dan:
- assert setiap token warna ada dengan nilai persis (contoh `--color-gallery-black: #000000`),
- assert setiap token radius ada dengan nilai persis,
- assert token legacy tidak ada: `#c4c3b6`, `#e7e5e4`, `#dfdcd5`, `#595855`, `--font-davinci`, `playfair`, `texture-putty`, `notched-card`, `wordmark-carve`, `#ff3037`, `#00d959`.

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8").toLowerCase();

const COLORS = {
  "gallery-black": "#000000",
  "charcoal-stage": "#111111",
  ink: "#1d1d1f",
  porcelain: "#f5f5f7",
  paper: "#ffffff",
  steel: "#86868b",
  graphite: "#6e6e73",
  "control-charcoal": "#333336",
  "cloud-gray": "#e8e8ed",
  "apple-blue": "#0071e3",
  "link-blue": "#0066cc",
};

test("token warna baru ada dengan nilai persis", () => {
  for (const [name, value] of Object.entries(COLORS)) {
    assert.ok(css.includes(`--color-${name}: ${value}`), `missing --color-${name}`);
  }
});

test("token legacy sudah hilang", () => {
  for (const legacy of ["#c4c3b6", "#e7e5e4", "#dfdcd5", "#595855", "--font-davinci", "playfair", "texture-putty", "notched-card", "wordmark-carve", "#ff3037", "#00d959"]) {
    assert.ok(!css.includes(legacy), `legacy token still present: ${legacy}`);
  }
});
```

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/tokens.test.mjs`
Expected: FAIL, `--color-gallery-black` belum ada.

- [ ] **Step 3: Tambah script test di `package.json`**

Tambah `"test": "node --test tests/"` ke `scripts`.

- [ ] **Step 4: Implement token di `globals.css`**

Ganti blok `:root` dan `@theme` dengan palet, radius, dan spacing dari Global Constraints. Sisakan `@import "tailwindcss";`, variabel `--font-helvetica-now` (nanti diganti di Task 3), dan `body` dasar. Hapus grain, notched, carve, ticker.

- [ ] **Step 5: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css tests/tokens.test.mjs package.json
git commit -m "feat(theme): gallery-black token system with guard test"
```

---

### Task 2: Guard kontras WCAG

**Files:**
- Create: `tests/contrast.test.mjs`

**Interfaces:**
- Consumes: token warna dari Task 1.
- Produces: ambang kontras yang dipakai Task 6 sampai 9.

- [ ] **Step 1: Tulis test yang gagal**

`tests/contrast.test.mjs` membaca `globals.css`, ambil nilai hex per token, hitung rasio kontras WCAG (formula luminansi relatif), lalu assert:
- Porcelain di Gallery Black >= 4.5
- Steel di Gallery Black >= 4.5
- Ink di Paper >= 4.5
- Graphite di Paper >= 4.5
- Paper di Apple Blue >= 4.5
- Link Blue di Paper >= 4.5
- Steel di Paper < 4.5 (mendokumentasikan kenapa Steel dilarang di permukaan terang)

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/contrast.test.mjs`
Expected: FAIL pada pembacaan token (kalau Task 1 belum dikerjakan) atau pada ambang.

- [ ] **Step 3: Perbaiki token atau pasangan sampai lulus**

Run: `npm test`
Expected: PASS. Kalau ada pasangan gagal, ganti token, jangan turunkan ambang.

- [ ] **Step 4: Commit**

```bash
git add tests/contrast.test.mjs
git commit -m "test(a11y): WCAG contrast guard for the token palette"
```

---

### Task 3: Font dan permukaan body

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `tests/fonts.test.mjs`

**Interfaces:**
- Consumes: token Task 1.
- Produces: variabel `--font-sans` yang dipakai kelas di seluruh halaman.

- [ ] **Step 1: Tulis test yang gagal**

`tests/fonts.test.mjs` membaca `src/app/layout.tsx` dan assert: hanya `Inter` dari `next/font/google`, tidak ada `Playfair_Display`, tidak ada `--font-davinci`, dan body memakai warna permukaan gelap.

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/fonts.test.mjs`
Expected: FAIL, `Playfair_Display` masih ada.

- [ ] **Step 3: Ubah `layout.tsx`**

Ganti dua font jadi satu `Inter` dengan variabel `--font-sans` (weight `["400","600"]`). Body class memakai `--color-gallery-black`. Metadata: perbarui `title`, `description`, `keywords`, `openGraph`, `twitter` agar tidak menyebut "Renaissance" atau "putty". Canonical, `metadataBase`, dan `verification` tidak diubah.

- [ ] **Step 4: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx tests/fonts.test.mjs
git commit -m "feat(theme): Inter-only type system and dark body surface"
```

---

### Task 4: Pass copy dan aturan em dash

**Files:**
- Modify: `src/app/page.tsx`
- Create: `tests/copy.test.mjs`

**Interfaces:**
- Consumes: tidak ada.
- Produces: teks section yang dipakai Task 6 sampai 9, dan draf baris hero untuk approval owner.

- [ ] **Step 1: Tulis test yang gagal**

`tests/copy.test.mjs` membaca `src/app/page.tsx` dan assert:
- tidak ada string `putty`, `Renaissance`, `kertas museum`, `Playfair`, `Davinci`, `In restraint we find grandeur`, `Time does not preserve great work`,
- setiap baris yang memuat `—` juga memuat salah satu dari dua kalimat personal yang diizinkan,
- tidak ada buzzword `Seamless`, `Revolutionary`, `Next Generation`, `AI Powered`.

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/copy.test.mjs`
Expected: FAIL pada `putty`.

- [ ] **Step 3: Tulis ulang naskah di `page.tsx`**

- Deskripsi Karya, hapus acuan putty dan Renaissance, ganti deskripsi faktual: `hr-ai-review` "Unggah PDF CV, terima analisis dan skor.", `ruang-resepsi` "Undangan digital pernikahan, satu tautan per tamu, aktif 7 hari.", `structur-md` "Ubah URL jadi Markdown dan ekstrak struktur halaman.", `dropdeploy` "Deploy dari browser: jatuhkan .zip, langsung live di Vercel dan GitHub."
- About paragraf kedua, ganti dengan deskripsi arah baru tanpa mengklaim angka: halaman dibangun sebagai panggung gelap, satu accent biru, tanpa bayangan, tipografi Inter, foto asli.
- Footer, ganti "Renaissance gallery on putty paper..." dengan "Khamim Zarkasyi. Karya, foto, dan catatan kecil. Dibangun dengan Next.js dan Tailwind."
- Draf baris hero (konstan `HERO_LINE`): "Khamim Zarkasyi. Yang dipajang di sini: empat project yang sudah live, dan enam kebiasaan harian yang menopangnya." Tandai sebagai draf untuk approval owner.
- Ganti em dash lain dengan koma atau titik. Pertahankan hanya dua kalimat personal.

- [ ] **Step 4: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Minta owner menyetujui draf baris hero sebelum Task 6 dipakai**

Tunjukkan `HERO_LINE` ke owner. Kalau owner mengganti teksnya, update test copy bila perlu dan ulangi.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx tests/copy.test.mjs
git commit -m "copy: rewrite old-design prose, add hero line draft"
```

---

### Task 5: Header dan menu mobile

**Files:**
- Modify: `src/components/Header.tsx`
- Create: `tests/nav.test.mjs`

**Interfaces:**
- Consumes: token Task 1, `--font-sans` Task 3.
- Produces: id section yang harus ada di `page.tsx`: `karya`, `exhibition`.

- [ ] **Step 1: Tulis test yang gagal**

`tests/nav.test.mjs` membaca `Header.tsx` dan `page.tsx` dan assert: tidak ada `href="#"`, setiap `href="#..."` di Header punya `id` pasangannya di `page.tsx`, tombol menu punya `aria-expanded`, dan ada penanganan `Escape`.

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/nav.test.mjs`
Expected: FAIL, `href="#"` masih ada.

- [ ] **Step 3: Ubah `Header.tsx`**

Bar `#111111` tinggi 44px, label Inter 12px warna Porcelain. Tambah `useEffect` untuk menutup menu saat `Escape`. Tap target tombol menu minimal 44x44 (`w-11 h-11`). Link "Top" diganti tombol yang memanggil scroll ke atas atau dihapus. Pertahankan `NAV` yang sama.

- [ ] **Step 4: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx tests/nav.test.mjs
git commit -m "feat(nav): dark product bar with escapable mobile menu"
```

---

### Task 6: Hero

**Files:**
- Modify: `src/app/page.tsx`
- Create: `tests/hero.test.mjs`

**Interfaces:**
- Consumes: `HERO_LINE` Task 4, token Task 1.
- Produces: id `karya` di section berikutnya.

- [ ] **Step 1: Tulis test yang gagal**

`tests/hero.test.mjs` assert `page.tsx` memuat `id="karya"`, string `KHAMIMZAR`, satu `mailto:khamimzarrr@gmail.com` dengan gaya accent, satu tautan GitHub outline, dan tidak memuat `Buy`, `From $`, `Trade in`.

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/hero.test.mjs`
Expected: FAIL, `id="karya"` belum ada.

- [ ] **Step 3: Bangun section hero**

Gallery Black, wordmark `KHAMIMZAR` dengan `fontSize: "clamp(48px, 16vw, 240px)"`, bobot 600, tracking negatif, satu reveal `<Reveal>`. `HERO_LINE` sebagai paragraf. Dark utility capsule `#333336` radius 36px berisi meta nyata (Based: Indonesia, Est. 2026, tema). Satu tombol Apple Blue ke mailto, satu outline pill ke GitHub. Tanpa foto, tanpa render. Hapus section Classical Panel (The School of Athens) dan `heroPainting`. Tambah section Motto setelah hero: quote Tawakal milik Khamim apa adanya, tetap di atas Gallery Black, dibungkus satu `<Reveal>`, tanpa kutipan Inggris tambahan.

- [ ] **Step 4: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/hero.test.mjs
git commit -m "feat(hero): gallery-black stage with KHAMIMZAR wordmark"
```

---

### Task 7: Karya

**Files:**
- Modify: `src/app/page.tsx`
- Create: `tests/karya.test.mjs`

**Interfaces:**
- Consumes: id `karya` Task 6.
- Produces: id `exhibition`.

- [ ] **Step 1: Tulis test yang gagal**

`tests/karya.test.mjs` assert empat nama project ada, tiap project punya `https://github.com/...` dan URL live, tidak ada tag `<img` di dalam array project, dan ada `id="exhibition"`.

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/karya.test.mjs`
Expected: FAIL, `id="exhibition"` belum ada.

- [ ] **Step 3: Bangun section Karya**

Empat kartu media 28px, permukaan Gallery Black atau Charcoal, tanpa shadow. Satu kartu di-link ke halaman live (whole-card link), tombol GitHub eksplisit. Tanpa screenshot. Label bahasa memakai warna Steel. Tombol "lihat semua di GitHub" sebagai outline pill.

- [ ] **Step 4: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/karya.test.mjs
git commit -m "feat(karya): project media cards on the dark stage"
```

---

### Task 8: Exhibition

**Files:**
- Modify: `src/app/page.tsx`
- Create: `tests/exhibition.test.mjs`

**Interfaces:**
- Consumes: id `exhibition` Task 7.
- Produces: enam path foto `public/hobi/*.jpg`.

- [ ] **Step 1: Tulis test yang gagal**

`tests/exhibition.test.mjs` assert enam path `/hobi/` muncul, setiap gambar memakai `aspect-square` atau `width` sama dengan `height`, tidak ada judul Latin (`Fragmenta`, `Iter Matutinum`, `Cultura`, `Cathedralis`, `Calligraphia`, `Amarum`), dan setiap item punya caption.

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/exhibition.test.mjs`
Expected: FAIL, judul Latin masih ada.

- [ ] **Step 3: Bangun section Exhibition**

Enam kartu media 28px, foto asli 1:1 via `next/image`, caption nyata. Hover halus (zoom kecil atau brightness), tanpa stagger. Hapus judul Latin, ganti label Indonesia.

- [ ] **Step 4: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/exhibition.test.mjs
git commit -m "feat(exhibition): six real-photo media cards"
```

---

### Task 9: About dan Footer

**Files:**
- Modify: `src/app/page.tsx`
- Create: `tests/about.test.mjs`

**Interfaces:**
- Consumes: naskah Task 4.
- Produces: halaman lengkap sampai footer.

- [ ] **Step 1: Tulis test yang gagal**

`tests/about.test.mjs` assert permukaan terang (`--color-paper` atau `--color-cloud-gray`) dipakai di section About, semua kontak nyata ada (`mailto:`, github, instagram), teks sekunder permukaan terang memakai Graphite bukan Steel, dan footer memuat "Made with ngopi & vibes coding wkwk".

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/about.test.mjs`
Expected: FAIL, About masih permukaan lama.

- [ ] **Step 3: Bangun About dan Footer**

Section About di atas Paper, teks Ink, teks sekunder Graphite. Wall label berisi data nyata. Foto still life dipertahankan. Footer di Cloud Gray atau Paper, teks Ink, tanpa kolom template Product/Company/Resources/Legal. Pertahankan "Made with ngopi & vibes coding wkwk".

- [ ] **Step 4: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/about.test.mjs
git commit -m "feat(about): light merchandising section and footer"
```

---

### Task 10: Hapus Ticker

**Files:**
- Delete: `src/components/Ticker.tsx`
- Modify: `src/app/page.tsx`
- Create: `tests/ticker-removed.test.mjs`

**Interfaces:**
- Consumes: tidak ada.

- [ ] **Step 1: Tulis test yang gagal**

Assert file `src/components/Ticker.tsx` sudah tidak ada dan `page.tsx` tidak mengimpor `Ticker`.

- [ ] **Step 2: Run test, pastikan gagal**

Run: `node --test tests/ticker-removed.test.mjs`
Expected: FAIL, file masih ada.

- [ ] **Step 3: Hapus file dan semua pemakaian**

Hapus `src/components/Ticker.tsx`, hapus import dan ketiga pemasangan `<Ticker />`.

- [ ] **Step 4: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/Ticker.tsx src/app/page.tsx tests/ticker-removed.test.mjs
git commit -m "chore: remove the running ticker"
```

---

### Task 11: Ikon dan OG image gelap

**Files:**
- Modify: `src/app/icon.svg`
- Modify: `src/app/icon.png`, `src/app/apple-icon.png`
- Modify: `public/og/og-cover.png`
- Modify: `src/app/layout.tsx` (hanya kalau wiring ikon perlu berubah)

**Interfaces:**
- Consumes: palet Task 1.
- Produces: aset gelap yang dipakai metadata.

- [ ] **Step 1: Buat versi gelap ikon dan OG**

Ikon `K` di atas Gallery Black dengan stroke Porcelain, ukuran tetap. OG image 1200x630 Gallery Black dengan wordmark Porcelain dan satu garis Apple Blue. Aset lama putty diganti.

- [ ] **Step 2: Verifikasi visual**

Run: `npm run build`, buka browser, cek favicon di tab dan buka `/og/og-cover.png`. Expected: ikon terlihat di chrome gelap, OG terbaca.

- [ ] **Step 3: Commit**

```bash
git add src/app/icon.svg src/app/icon.png src/app/apple-icon.png public/og/og-cover.png
git commit -m "feat(brand): dark icon and OG cover"
```

---

### Task 12: Verifikasi dan Delivery Gate

**Files:**
- Create: `docs/superpowers/plans/2026-10-18-verification-report.md`

**Interfaces:**
- Consumes: seluruh hasil Task 1 sampai 11.

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: sukses, nol error.

- [ ] **Step 2: Kontras**

Run: `node --test tests/contrast.test.mjs` dan `python3 ~/.tmp-anti-slop/skills/antislop-human/contrast-check.py` untuk tiap pasangan yang dipakai.
Expected: semua PASS, catat hasil per pasangan.

- [ ] **Step 3: Click-through elemen per elemen**

Run: `npm run dev`. Klik dan catat: nav desktop, hamburger mobile (buka, tutup, Escape), tombol email hero, outline GitHub, tiap kartu Karya ke live, tiap tombol GitHub karya, keenam kartu Exhibition (hover), tautan About dan footer, "Kembali ke atas". Expected: setiap aksi benar-benar terjadi, nol error console.

- [ ] **Step 4: Mobile dan keyboard**

Cek 375px, 768px, 1024px, 1440px: nol overflow horizontal, grid reflow, tap target >= 44px. Tab melalui halaman: urutan mengikuti visual, focus terlihat, Escape menutup menu. Zoom 200% tidak memotong teks.

- [ ] **Step 5: Tulis laporan Delivery Gate**

Tulis `docs/superpowers/plans/2026-10-18-verification-report.md` berisi empat blok (Hard Gate, Purpose-Gate, Liveliness, Craftsmanship) dengan bukti konkret per baris. Kalau ada FAIL, jangan serahkan, perbaiki dulu.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/plans/2026-10-18-verification-report.md
git commit -m "docs: verification report for the apple gallery redesign"
```
