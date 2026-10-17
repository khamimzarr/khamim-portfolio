# Verification Report - Apple Gallery Redesign

**Tanggal:** 18 Okt 2026
**Branch:** `apple-gallery`
**Revisi yang diverifikasi:** `85672e3` (semua bukti di bawah dijalankan pada revisi ini)
**Spec:** `docs/superpowers/specs/2026-10-18-apple-gallery-redesign-design.md`
**Plan:** `docs/superpowers/plans/2026-10-18-apple-gallery-redesign.md`

## Bukti otomatis

- `npm test`: 36/36 lulus.
- `npm run build`: sukses, 9/9 static pages, nol error atau warning.
- Tautan eksternal (10 URL): semuanya balas 200.
- HTML render diambil ulang dari `npm run start` pada revisi ini (bukan cache server lama). Tidak ada `href="#"`, dan `id="karya"` serta `id="exhibition"` ada.

## Kontras (contrast-check.py) untuk setiap pasangan yang dirender

| Teks | Latar | Dipakai di | Rasio | Normal (4.5) |
|---|---|---|---|---|
| Porcelain #f5f5f7 | Gallery Black #000000 | hero, motto, heading section | 19.29:1 | PASS |
| Porcelain #f5f5f7 | Charcoal #111111 | judul dan label kartu | 17.34:1 | PASS |
| Steel #86868b | Gallery Black #000000 | deskripsi di panggung | 5.80:1 | PASS |
| Steel #86868b | Charcoal #111111 | deskripsi kartu | 5.21:1 | PASS |
| Ink #1d1d1f | Paper #ffffff | wall label | 16.83:1 | PASS |
| Ink #1d1d1f | Cloud Gray #e8e8ed | caption still life (diperbaiki) | 13.78:1 | PASS |
| Graphite #6e6e73 | Paper #ffffff | teks sekunder terang | 5.07:1 | PASS |
| Graphite #6e6e73 | Porcelain #f5f5f7 | teks sekunder About | 4.66:1 | PASS |
| Paper #ffffff | Apple Blue #0071e3 | tombol utama | 4.70:1 | PASS |
| Link Blue #0066cc | Paper #ffffff | tautan footer | 5.57:1 | PASS |
| Link Blue #0066cc | Porcelain #f5f5f7 | tautan About | 5.11:1 | PASS |
| Nav 80% putih (≈#c7c7ca) | Charcoal #111111 | label nav | 11.20:1 | PASS |

Pasangan yang sengaja dilarang, dan dijaga test:

| Teks | Latar | Rasio | Alasan dilarang |
|---|---|---|---|
| Steel #86868b | Paper #ffffff | 3.63:1 | gagal AA |
| Link Blue #0066cc | Charcoal #111111 | 3.39:1 | gagal AA |

## Temuan review dan perbaikannya

Review menemukan tiga masalah yang sudah diperbaiki di revisi ini, semuanya lewat test yang dilihat gagal dulu (`tests/fix-pass.test.mjs`, `tests/contrast.test.mjs`):

1. Focus ring pada tautan kartu Karya terpotong `overflow: hidden`, jadi tidak terlihat. Perbaikan: ring inset `focus-visible:outline-offset-[-6px]`.
2. Tautan github di kartu gelap memakai Link Blue di atas Charcoal (3.39:1, gagal). Perbaikan: Porcelain dengan underline.
3. Caption still life memakai Graphite di atas Cloud Gray (4.15:1, gagal). Perbaikan: Ink.

Ditambah guard baru: setiap warna di `src` harus ada di token `globals.css`, supaya warna yatim tidak lolos lagi.

## Delivery Gate

### Blok 1: Hard Gate

- R-02 em dash: PASS, hanya dua kalimat personal owner, dijaga test.
- R-03 mobile: PASS dengan perbaikan (CTA 44px, hamburger 44x44, baris menu `py-3.5`, wordmark `clamp(40px, 14vw, 168px)`). Dijaga `tests/tap-target.test.mjs`. Pengukuran di perangkat nyata belum.
- R-17 angka tanpa sumber: PASS. Halaman menyebut "empat project" dan "enam kebiasaan" sebagai hitungan isi halaman sendiri, bukan statistik atau klaim performa.
- R-18 testimoni fiktif: PASS, tidak ada.
- R-23 aset: PASS, ikon dan OG dibuat ulang dengan izin owner, foto asli tidak diubah.
- R-24 nav mati: PASS, semua tautan punya tujuan.
- R-25 kontras: PASS, seluruh pasangan yang dirender lolos AA.
- R-26 kontrol mati: PASS, tidak ada.
- R-27 state: tidak berlaku, halaman statis tanpa data.
- R-28 FAQ: tidak ada FAQ.
- R-32 keyboard: PASS, `aria-expanded`, Escape, `:focus-visible`, dan ring kartu Karya tidak terpotong.
- R-33 patch via script: PASS, tidak ada.
- R-34 theme: tidak ada toggle.
- R-35 verifikasi sebelum serah: PENDING untuk click-through di browser nyata. Build dan test dijalankan, HTML render dan semua tautan diperiksa, tapi aku tidak punya browser di Termux. Owner perlu membuka halaman dan mengklik tiap kontrol.
- R-36 klaim palsu: PASS.
- R-37 arah design: PASS, `DESIGN.md` ada dan ikut di-commit.
- R-38 konten nyata: PASS untuk seluruh konten. Baris hero masih draf dan menunggu persetujuan owner.

### Blok 2: Purpose-Gate

- R-01 gradient: PASS. R-04 ikon: PASS. R-06 tipografi: PASS. R-07 background: PASS.
- R-08 panah: PASS. R-09 badge: PASS, dot dekoratif dihapus.
- R-10 glass: PASS. R-12 shadow: PASS. R-13 glow: PASS. R-14 kartu seragam: PASS. R-19 animasi: PASS. R-22 ilustrasi: PASS.

### Blok 3: Liveliness

- Dial: ENERGY 2 / RHYTHM 3 / MOTION 2. Komposisi section bervariasi. Focal point ada. Whitespace struktural. Satu accent. Motif identitas ada. Design Read dideklarasikan. PASS.

### Blok 4: Craftsmanship & Quality Locks

- C-1 sampai C-5: PASS.
- R-05, R-11, R-15, R-16, R-20, R-21, R-29, R-30, R-31: PASS.

## Yang masih terbuka

1. Click-through di browser nyata (R-35). Owner membuka halaman dan mengklik tiap kontrol.
2. Baris hero di `HERO_LINE` masih draf, menunggu persetujuan owner.
3. Speed Insights masih no-op (batas hobby), tidak berubah.
