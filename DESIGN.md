# Khamim Portfolio - Design Direction

> "Khamim sebagai produk yang sedang diluncurkan." Galeri gelap, objek menyala di ruang hampir hitam.

**Theme:** dark, tetap, tanpa toggle
**Dial:** ENERGY 2 / RHYTHM 3 / MOTION 2

Sumber arah: style reference Apple Watch Series 12 yang dipaste owner (18 Okt 2026). Dipakai sebagai **bahasa visual**, bukan struktur halaman 1:1 (R-30). Arah ini tidak memakai aset Apple mana pun, tidak ada logo, glyph, harga, atau klaim produk Apple.

## Design Read

Reading this as: folio pribadi (karya dan hobi) untuk orang yang datang dari GitHub dan Instagram, dalam bahasa panggung produk yang near-black, dial ENERGY 2 / RHYTHM 3 / MOTION 2.

## Identitas

- Yang dipajang adalah cara Khamim hidup dan berkarya, bukan template CV.
- Permukaan gelap dulu, terang sebagai jeda. Section terang muncul sebagai "merchandising panel" yang mengapit panggung hitam, bukan sebagai mode tema kedua.
- Satu accent saja: Apple Blue untuk aksi utama dan focus. Sisanya monokrom.
- Motif identitas: wordmark KHAMIMZAR sebagai objek hero, plus foto asli Khamim sebagai bukti di kartu media.

## Alasan per keputusan (R-31)

| Keputusan | Alasan satu baris |
|---|---|
| Gallery Black `#000000` sebagai kanvas utama | Bahasa arahnya adalah benda menyala di ruang gelap, jadi hitam adalah panggungnya, bukan gaya "tech". |
| Charcoal Stage `#111111` sebagai tingkat kedua | Membuat hierarki permukaan tanpa shadow, lewat satu langkah warna. |
| Apple Blue `#0071e3` sebagai satu accent | Arahnya menyimpan biru untuk aksi utama, jadi accent-nya ada di satu tempat, bukan di semua kontrol. |
| Warna health dibuang | Portfolio tidak punya data kesehatan, dan arahnya sendiri melarang warna itu keluar dari konteks metrik. |
| Inter menggantikan SF Pro | SF Pro tidak tersedia sebagai webfont publik, dan Inter adalah padanan terdekat untuk bobot 600 dan tracking negatifnya. |
| Bobot maksimal 600 | Arahnya melarang headline display di 700 sampai 900, jadi ketegasan datang dari ukuran dan tracking, bukan dari berat. |
| Radius kartu 28px, tombol pill | Radius besar adalah ciri bahasa ini, dan variasi radius dipakai sebagai alat hierarki, bukan seragam. |
| Tanpa drop shadow | Hierarki datang dari langkah permukaan `#000000` ke `#111111` dan potongan sudut 28px, bukan dari bayangan. |
| MOTION 2: satu reveal kalem per section, tanpa stagger | Halaman ini panjang, jadi masuknya section perlu dibantu pelan, tapi stagger delay bertingkat akan melampaui dial dan jadi gegap gempita. |
| Teks personal owner mempertahankan em dash | Itu suara asli Khamim dan sudah disetujui owner. Lihat bagian Override di bawah. |

## Warna

| Nama | Nilai | Token | Peran |
|---|---|---|---|
| Gallery Black | `#000000` | `--color-gallery-black` | Kanvas hero, kartu media hitam, panggung |
| Charcoal Stage | `#111111` | `--color-charcoal-stage` | Section band gelap, modul berisi |
| Ink | `#1d1d1f` | `--color-ink` | Teks utama di permukaan putih |
| Porcelain | `#f5f5f7` | `--color-porcelain` | Teks utama di permukaan gelap, isian alternatif pucat |
| Paper | `#ffffff` | `--color-paper` | Permukaan merchandising putih, kartu |
| Steel | `#86868b` | `--color-steel` | Copy sekunder, detail nonaktif |
| Graphite | `#6e6e73` | `--color-graphite` | Helper text dan outline 1px |
| Control Charcoal | `#333336` | `--color-control-charcoal` | Isian kontrol utilitas |
| Cloud Gray | `#e8e8ed` | `--color-cloud-gray` | Isian netral pendukung |
| Apple Blue | `#0071e3` | `--color-apple-blue` | Tombol aksi utama dan focus, accent tunggal |
| Link Blue | `#0066cc` | `--color-link-blue` | Link teks di dalam body copy |

### Warna yang sengaja tidak dipakai

Pulse Red `#ff3037`, Vital Green `#00d959`, Signal Orange `#ff791b`, New Orange `#b64400`, Burnt Badge Wash `#311400`. Semuanya terikat pada metrik kesehatan dan status ketersediaan produk, dan portfolio tidak menampilkan keduanya. Memakai warna itu di luar konteksnya akan melanggar arahan aslinya sendiri dan mengotori palet (R-29).

## Tipografi

Satu keluarga: **Inter** (padanan SF Pro). Bobot 400 dan 600 saja. Tracking display negatif, tracking kecil juga negatif halus.

| Peran | Ukuran | Bobot | Line height | Tracking | Token |
|---|---|---|---|---|---|
| hero-display | 80px | 600 | 1.05 | -1.2px | `--text-hero-display` |
| feature-display | 64px | 600 | 1.06 | -0.576px | `--text-feature-display` |
| section-heading | 56px | 600 | 1.07 | -0.28px | `--text-section-heading` |
| metric-display | 48px | 600 | 1 | -0.144px | `--text-metric-display` |
| card-heading | 28px | 600 | 1.14 | 0.196px | `--text-card-heading` |
| feature-label | 17px | 600 | 1.24 | -0.374px | `--text-feature-label` |
| body | 17px | 400 | 1.47 | -0.374px | `--text-body` |
| body-strong | 14px | 600 | 1.29 | -0.224px | `--text-body-strong` |
| nav | 12px | 400 | 1 | -0.12px | `--text-nav` |
| utility-button | 12px | 400 | 1.33 | -0.12px | `--text-utility-button` |

Ukuran display turun lewat `clamp()` di mobile, tidak dibiarkan 80px di layar 375px (R-03).

Aturan kontras teks sekunder (builder call): Steel `#86868b` hanya boleh di atas permukaan gelap, karena di atas Paper dia hanya sekitar 3.6:1 dan gagal. Teks sekunder di permukaan terang memakai Graphite `#6e6e73`, yang sekitar 5.1:1 dan lolos.

## Spacing dan Bentuk

- Base unit 4px.
- Section padding vertikal: 80px desktop, 52px mobile, dengan variasi sesuai RHYTHM 3.
- Section gap 24px, card padding 16px, element gap 4px.
- Page max width `1120px` (builder call), teks panjang dibatasi sekitar 640px.

| Elemen | Radius |
|---|---|
| cards, media, modul | 28px |
| links | 10px |
| badges | 5px |
| inputs | 980px |
| buttons | 9999px |
| utility controls | 36px |

Shadow: tidak ada drop shadow. Satu-satunya pemisah adalah hairline `rgb(245,245,247) 0 1px 0 0` di tepi atas saat dibutuhkan.

## Permukaan

| Level | Nama | Nilai | Fungsi |
|---|---|---|---|
| 0 | Gallery Black | `#000000` | Panggung hero dan kartu media |
| 1 | Charcoal Stage | `#111111` | Section band gelap dan modul berisi |
| 2 | Paper | `#ffffff` | Kanvas merchandising dan kartu putih |
| 3 | Porcelain | `#f5f5f7` | Isian pucat alternatif dan teks di atas gelap |

## Komponen dan padanannya di portfolio

| Komponen arah | Padanan | Catatan |
|---|---|---|
| Global nav 44px | `Header` | Hamburger mobile tetap, tap target 44px (R-03) |
| Local product nav | sub-navigasi section di Header | hanya ke section yang benar-benar ada (R-24) |
| Hero product stage | Hero + wordmark KHAMIMZAR | wordmark adalah objeknya, tidak ada render palsu (R-23) |
| Black feature media card | Karya dan Exhibition | radius 28px, tanpa shadow |
| White merchandising card | About dan Visitor Info | teks Ink di Paper |
| Blue purchase pill | CTA tunggal "ngopi sambil ngobrol project" | Apple Blue, teks putih, radius 9999px |
| Inline product link | link email, GitHub, Instagram di body | Link Blue |
| Dark utility capsule | label meta hero (Based, Est, dsb) | `#333336`, radius 36px |
| Comparison module, metric tiles, availability badge, pill select, harga | tidak dipakai | tidak ada isinya yang nyata di portfolio |

## Do dan Don't

Do:
- Panggung gelap pakai Gallery Black, copy utamanya Porcelain.
- Kartu dan modul pakai radius 28px.
- Pill dan tombol pakai 9999px atau 980px.
- Aksi utama Apple Blue dengan teks putih, link teks Link Blue.
- Satu accent, di momen kunci saja.
- Hierarki dari langkah permukaan dan ukuran teks, bukan dari bayangan.

Don't:
- Jangan pakai drop shadow untuk menaikkan kartu.
- Jangan pakai Apple Blue di navigasi, dekorasi, atau semua kontrol.
- Jangan pakai radius 8px atau 12px untuk kartu.
- Jangan pakai bobot 700 sampai 900 di headline display.
- Jangan pakai warna health atau orange sama sekali.
- Jangan menyusun halaman meniru struktur atau isi halaman Apple (R-30): tanpa harga, tanpa klaim produk, tanpa metrik karangan, tanpa "Buy" atau "Trade in".
- Jangan bikin aset atau render palsu. Foto yang dipakai foto asli Khamim (R-23).

## Override yang disetujui owner

- **Em dash (`—`).** R-02 melarangnya, tapi dua kalimat personal yang ditulis owner mempertahankannya sebagai suara Khamim, sesuai izin R-37 untuk sampel suara owner: "ngopi sambil ngerjain project — wkwk, tapi jadi." dan "Pahit yang menyalakan ide — ngopi sambil ngulik project, wkwk tapi serius." Di teks lain yang bukan suara personal owner (label, caption, heading, teks teknis, UI), em dash diganti koma, titik, atau tanda kurung. Daftar lengkap dicatat di spec. Motto Tawakal saat ini tidak memakai em dash, jadi tidak masuk daftar ini.
- **Dark tetap tanpa toggle.** Arahnya bernama "benda menyala di ruang gelap", jadi tema gelap punya alasan identitas, bukan alasan "terlihat tech" (R-21). Tidak ada toggle, jadi tidak ada kewajiban dua mode (R-34).
