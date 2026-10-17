# Apple Gallery Redesign - Design Spec

**Tanggal:** 18 Okt 2026
**Status:** disetujui owner 18 Okt 2026, lanjut ke plan bertahap
**Branch kerja (usulan):** `apple-gallery` (dibuat dari `rollback-design`)
**Arah design:** `DESIGN.md` di root project

## Intent dan alasan

Portfolio Khamim sekarang adalah galeri Renaissance di atas kertas putty. Arah baru mengganti medianya: galeri gelap, dengan karya dan kebiasaan Khamim dipajang seperti produk yang baru diluncurkan. Konsep galerinya tidak hilang, hanya panggungnya berubah dari kertas terang ke ruang hampir hitam.

Alasannya: halaman ini dilihat orang yang datang dari GitHub dan Instagram, dan yang ingin mereka saksikan adalah karya serta cara Khamim hidup, bukan daftar skill. Bahasa peluncuran produk membuat karya jadi objek utama dan identitasnya tetap punya Khamim, bukan template.

## Design Read

Reading this as: folio pribadi (karya dan hobi) untuk orang yang datang dari GitHub dan Instagram, dalam bahasa panggung produk yang near-black, dial ENERGY 2 / RHYTHM 3 / MOTION 2.

## Yang dipakai dari arah Apple, dan yang dibuang

Dipakai: palet monokrom (Gallery Black, Charcoal, Paper, Porcelain, Steel, Graphite), Inter sebagai pengganti SF Pro bobot 400/600, tracking negatif, radius 28px untuk kartu dan pill untuk tombol, satu accent Apple Blue, tanpa drop shadow.

Dibuang: warna health (Pulse Red, Vital Green), orange status, modul perbandingan harga, metric tiles dengan angka, availability badge, pill select, dan seluruh kosakata commerce ("Buy", "From $399", "Trade in"). Semuanya tidak punya isi nyata di portfolio (R-17, R-38), dan memakainya akan melanggar arahan aslinya sendiri.

## Goals

1. Halaman terasa seperti panggung produk yang memajang Khamim, bukan seperti template portfolio.
2. Identitas tetap milik Khamim: wordmark, foto asli, dan suara tulisannya.
3. Lolos Delivery Gate antislop: kontras AA, keyboard, mobile sungguhan, tanpa angka atau testimoni palsu.

## Non-goals

- Tidak membuat mode terang atau toggle tema.
- Tidak menambah section baru yang tidak punya isi (blog, testimoni, FAQ, pricing).
- Tidak membuat aset gambar baru (logo, avatar, render).
- Tidak mengubah URL, metadata canonical, atau setup deploy.
- Tidak menyentuh project `hr-ai-review`.

## Anti-goals (kalau ini terjadi, berarti gagal walaupun secara teknis jalan)

- Halaman terasa seperti clone halaman Apple: kalau logo ditukar, desainnya masih berasa Apple, bukan Khamim.
- Muncul angka, metrik, atau klaim yang tidak nyata supaya halaman terlihat penuh.
- Foto atau render palsu dipakai untuk mengisi panggung hero.
- Em dash dihapus dari kalimat personal Khamim sampai suaranya hilang.
- Kontras teks gagal AA demi terlihat "elegan".

## Constraints

- Next.js 16 App Router, Tailwind 4, React 19, TypeScript. Tanpa dependensi baru kalau bisa.
- Build lokal Android pakai `next build --webpack`. Vercel pakai `next build`.
- `page.tsx` adalah server component, jadi handler hanya di komponen `'use client'`.
- Class `reveal` wajib dibungkus `<Reveal>`.
- Push GitHub butuh token dari owner. Jangan komit secret.
- Foto asli ada di `public/hobi/`. Foto tidak diganti atau dibuat ulang.

## Keputusan owner (18 Okt 2026)

| Keputusan | Pilihan owner |
|---|---|
| Objek hero | Wordmark KHAMIMZAR |
| Font | Semua Inter, Playfair Display dilepas |
| Theme | Gelap tetap, tanpa toggle |
| Em dash | Dipertahankan hanya di kalimat personal owner, sisanya diganti |
| Konsep | Khamim sebagai produk yang diluncurkan |

## Builder calls (diputuskan, boleh dibantah owner)

| Keputusan | Alasan |
|---|---|
| Warna health dan orange dibuang | Tidak ada isinya di portfolio, dan arahnya sendiri melarang pemakaian di luar konteks |
| Ticker berjalan dilepas | Bertentangan dengan dial MOTION 2 dan tidak ada di bahasa panggung produk (R-19) |
| Grain putty dilepas | Itu tekstur kertas Renaissance, bukan panggung gelap |
| Panel The School of Athens dilepas | Lukisan itu milik identitas Renaissance, bukan panggung produk, dan bukan karya Khamim |
| Vignette bulat jadi kartu media 28px | Bahasa arah ini memakai kartu, bukan lingkaran |
| Wordmark carve diperhalus jadi reveal sekali | Reveal kalem per section, tanpa stagger delay (MOTION 2) |
| Foto hobi tetap rasio kotak (1:1) | Foto itu crop center-square buatan Khamim, jadi kartu mengikuti rasio aslinya supaya komposisinya tidak terpotong ulang |
| Kartu Karya tanpa screenshot palsu | Belum ada screenshot project, dan bikin render palsu dilarang (R-23). Kartu berisi nama, deskripsi, bahasa, dan tautan nyata, bukan gambar karangan |
| Teks metadata SEO diperbarui, canonical tetap | Teks lama menyebut "Renaissance" dan "putty" yang sudah tidak benar, tapi URL dan canonical dibekukan sesuai non-goals |
| Steel hanya di permukaan gelap, Graphite di permukaan terang | Steel di atas Paper hanya sekitar 3.6:1 dan gagal AA |
| Hexagon indicator dan Latin subtitle dilepas | Keduanya perangkat identitas Renaissance dan tidak punya arti di panggung produk (R-31) |

## Rencana section

1. **Header.** Bar gelap `#111111` 44px, label nav Inter 12px, brand mark "K" plus "Khamim Zarkasyi". Navigasi: email, GitHub, Instagram, Karya, Exhibition. Hamburger di bawah 768px, tap target minimal 44px, menu bisa ditutup dengan Escape.
2. **Hero.** Panggung Gallery Black. Wordmark KHAMIMZAR sebagai objek utama (clamp, tracking negatif, bobot 600). Baris peluncuran pendek dari profil Khamim. Dark utility capsule `#333336` berisi meta nyata (Based, Est, tema). Satu tombol Apple Blue "ngopi sambil ngobrol project" ke mailto, satu outline pill sekunder ke GitHub. Tidak ada render palsu.
3. **Motto.** Quote Tawakal dengan kalimat personal Khamim, tetap gelap. Em dash di kalimat ini dipertahankan.
4. **Karya.** Empat project nyata sebagai kartu media 28px di atas Gallery Black atau Charcoal. Nama, deskripsi, bahasa, tautan live dan GitHub. Semua tautan nyata.
5. **Exhibition.** Enam hobi dengan foto asli, kartu media 28px, caption nyata. Hover tetap ada tapi halus, sesuai MOTION 2 (satu reveal kalem per section, tanpa stagger).
6. **About dan Visitor Info.** Section permukaan Paper / Porcelain, teks Ink. Narasi About dipertahankan, termasuk "ngopi sambil ngerjain project — wkwk, tapi jadi." Wall label berisi kontak nyata.
7. **Footer.** Permukaan terang (Cloud Gray atau Paper), teks Ink. Nama, social nyata, "Made with ngopi & vibes coding wkwk". Tanpa kolom product/company/resources/legal (R-05).

Section yang dihapus: tiga strip Ticker, panel The School of Athens, notched card, texture putty.

## Aturan copy

- Tanpa em dash, kecuali di kalimat personal owner. Daftar yang dipertahankan: "ngopi sambil ngerjain project — wkwk, tapi jadi." (About) dan "Pahit yang menyalakan ide — ngopi sambil ngulik project, wkwk tapi serius." (Exhibition, baris signature). Kalimat personal lain yang owner tulis sendiri dan minta dipertahankan juga masuk daftar ini.
- Semua em dash lain diganti koma, titik, atau tanda kurung. Ini termasuk caption foto ("Foto asli, jepretan random Khamim"), label section ("Exhibition, 06 Rituals"), dan meta hero.
- Deskripsi vignette lain diganti pemisah koma, kecuali owner minta dipertahankan.
- Tanpa buzzword, tanpa emoji, tanpa angka atau testimoni yang tidak nyata.
- CTA spesifik, bukan "Learn More" atau "Get Started".

## File yang berubah

- `src/app/globals.css`: token warna, tipografi, spacing, radius, permukaan versi baru. Menghapus animasi ticker, carve lama, grain. Menyisakan `.reveal` dan memperhalus hover.
- `src/app/layout.tsx`: set font hanya Inter, ganti variabel font, sesuaikan warna body. Metadata tetap, canonical tetap.
- `src/app/page.tsx`: rewrite section sesuai rencana di atas.
- `src/components/Header.tsx`: gaya baru, tetap client component, tambahan menu mobile yang bisa ditutup dengan Escape.
- `src/components/Reveal.tsx`: dipertahankan.
- `src/components/Ticker.tsx`: dihapus.
- `src/components/hex/` atau helper baru: hanya kalau perlu, minimal.
- `DESIGN.md`: ditulis (sudah ada).

## Verifikasi (R-35)

1. `npm run build` sukses, nol error console.
2. `npm run dev`, buka halaman, klik setiap elemen satu per satu dan catat hasilnya: nav desktop, hamburger mobile, tiap tombol, tiap tautan karya, tiap tautan sosial, mailto. Hasilnya dilaporkan elemen per elemen.
3. Kontras: jalankan `contrast-check.py` untuk setiap pasangan teks dan latar (Porcelain di Gallery Black, Steel di Gallery Black, Ink di Paper, Graphite di Paper, teks putih di Apple Blue, Link Blue di Paper). Steel `#86868b` hanya untuk permukaan gelap; di permukaan terang pakai Graphite `#6e6e73`. Simpan hasilnya di laporan.
4. Mobile: cek 375px, 768px, 1024px, 1440px. Nol overflow horizontal, tidak ada grid yang tetap berkolom di layar sempit, tap target minimal 44px.
5. Keyboard: Tab menyusul urutan visual, focus terlihat di semua elemen, Escape menutup menu mobile.
6. Zoom 200% tidak memotong teks.
7. Laporan Delivery Gate empat blok ditulis sebelum menyerahkan hasil.

## Yang diserahkan ke builder

- Ukuran pasti jarak antar section asal tetap sesuai RHYTHM 3.
- Cara teknis wordmark hero (SVG, teks, atau komponen).
- Struktur file komponen kecil, selama tidak menambah kompleksitas tanpa alasan.
- Pemilihan warna permukaan tiap section (Gallery Black vs Charcoal vs Paper) selama hierarkinya tetap masuk akal.

## Keputusan owner putaran kedua (18 Okt 2026)

1. **Naskah yang menyebut design lama:** aku tulis ulang, dan baris hero aku usulkan sebagai draf untuk disetujui owner sebelum dipakai.
2. **Permukaan:** Gallery Black penuh, dengan section Paper sebagai jeda (hero hitam, Karya hitam, About putih, footer putih).
3. **Ikon dan OG image:** dibuat ulang versi gelap.
4. **Dial MOTION:** naik ke MOTION 2, satu reveal kalem per section tanpa stagger.
5. **Latin subtitle Exhibition:** dilepas, diganti label Indonesia yang nyata.

## Rencana copy

Ditulis ulang: deskripsi Karya yang menyebut putty atau Renaissance, paragraf kedua About, footer "Renaissance gallery on putty paper", dan dua kutipan Inggris. Naskah baru menyebut karya dan kebiasaan yang nyata, tanpa fakta atau angka karangan.

Dipertahankan: nama, tautan, deskripsi fitur yang faktual, dan dua kalimat personal ber-em dash.

Baris hero: draf diusulkan di plan, owner menyetujui sebelum dipakai. Tanpa kalimat orang pertama yang dipakai sebelum owner membacanya.
