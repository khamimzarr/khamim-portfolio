# Re-skin Khamim Portfolio → Trigger.dev Visual System

**Tanggal:** 16 Oktober 2026
**Status:** Spec disetujui untuk direncanakan
**Backup titik aman:** `~/backup-khamim-portfolio/20261016-094907` (tag `pre-redesign-20261016-094907`, commit `a1c71f9`)
**Design acuan:** style reference "Trigger.dev — Charging terminal on slate" (dipaste user 16 Okt 2026)

---

## 1. Tujuan & Kriteria Sukses

Portfolio `khamim-portfolio` (Next.js 16 + Tailwind 4, live di `khamimzar.my.id`) saat ini memakai sistem visual "Renaissance gallery on putty paper": canvas terang `#c4c3b6`, display Playfair Display, radius 9/28.8px, fotografi-led.

Pekerjaan ini menggantinya dengan sistem visual Trigger.dev: canvas gelap `#1c1e21`, aksen lime `#a8ff53`, hairline 1px, radius 4px, tipografi Geist/Geist Mono + Inter sebagai display.

**Yang diminta user (bagian B dari pilihan brief):** re-skin visual **plus** penulisan ulang copy — cerita, nilai, dan kepribadian tetap milik pemilik; hanya bahasanya yang mengikuti tema baru. Bukan penggantian identitas penuh (bukan opsi C).

### Kriteria sukses
1. `npm run build` hijau dan `npm run lint` bersih.
2. Nol sisa token/kosakata sistem lama di `src/`: `c4c3b6`, `e7e5e4`, `ebebeb`, `dfdcd5`, `Playfair`, `Davinci`, `putty`, `renaissance`.
3. 7 foto di `public/hobi/` tetap tampil; seluruh teks Motto Tawakal tetap utuh; CTA "ngopi sambil ngobrol project →", footer "Made with ngopi & vibes coding wkwk", dan caption "wkwk tapi serius" tetap ada persis.
4. Halaman hanya memakai 2 level permukaan (Canvas `#1c1e21`, Inset `#121317`) + hairline 1px. Tidak ada shadow, tidak ada gradient dekoratif.
5. Semua teks minimal 14px (aturan design melarang body di bawah 14px).

---

## 2. Keputusan Brief (hasil brainstorming bertahap)

| # | Pertanyaan | Keputusan |
|---|---|---|
| 1 | Seberapa jauh mengubah identitas & isi cerita | **B** — re-skin visual + tulis ulang copy; identitas & cerita tetap |
| 2 | Apa yang terjadi dengan foto & panel lukisan | **B** — 7 foto tetap ada dengan frame baru (radius 4px, hairline, caption mono); panel lukisan full-bleed diganti code pane `#121317` |
| 3 | Momen terbesar di hero | **C** — hybrid: headline 60px + CTA lime + code pane, **plus** wordmark `KHAMIMZAR` ~140px (Bone, satu aksen lime); logo lockup kecil di header |
| 4 | Font display (Satoshi tidak ada di Google Fonts) | **A** — Inter sebagai display + Geist (body) + Geist Mono (kode) |
| 5 | Ritme terang/gelap | **B** — semua Canvas `#1c1e21`; section **Karya** jadi Inset `#121317` full-bleed sebagai satu jangkar kedalaman |
| 6 | Elemen dekoratif lama (ticker, notched card, grain) | **B** — ticker lanjut sebagai marquee mono 14px; notched card & grain pensiun |
| 7 | Pendekatan implementasi | **3** — hybrid: token-first, lalu ekstrak hanya komponen yang berulang |

### Ambiguitas design yang sudah diputuskan
Dokumen design acuan kontradiksi soal lime: tabel token menulis *"Do not promote it to the primary CTA color"* dan Agent Prompt Guide menulis *"no distinct primary action color"*, tetapi bagian Components mendefinisikan **Primary CTA Button (Lime Fill)** dan bagian Elevation mendefinisikan inset glow `rgba(168,255,83,0.15)`.

**Keputusan:** lime **dipakai** sebagai fill tombol utama (mengikuti bagian Components yang paling detail dan didukung Elevation), dan highlight kata di headline memakai **Event Violet `#7655fd`** (sesuai peran token di tabel).

Presedensi yang dipakai: ketika dokumen design kontradiksi, bagian yang **paling spesifik dan paling dekat ke implementasi** (Components, Elevation) menang atas ringkasan tingkat tinggi (tabel token, Agent Prompt Guide). Aturan "lime adalah aksen kecil, bukan wash" tetap dipatuhi: lime hanya muncul sebagai fill tombol kecil, glyph logo, dan satu huruf aksen di wordmark — tidak pernah sebagai latar area luas.

---

## 3. Fondasi: Token & Font

### 3.1 Pemetaan warna

| Peran | Lama | Baru | Token baru |
|---|---|---|---|
| Canvas | Putty `#c4c3b6` | Slate `#1c1e21` | `--color-slate-canvas` |
| Permukaan dalam | — | `#121317` | `--color-ink-well` |
| Teks utama | Ink `#000000` | `#e5e7eb` | `--color-bone-text` |
| Teks sekunder | Graphite `#595855` | `#d7d9dd` | `--color-cloud-text` |
| Teks tersier | Ash `#808080` | `#878c99` | `--color-fog-text` |
| Teks muted | — | `#b5b8c0` | `--color-ash-text` |
| Hairline utama | Vellum `#dfdcd5` | `#272a2e` | `--color-steel-border` |
| Hairline tegas | — | `#3b3e45` | `--color-graphite-hairline` |
| Aksen fill | Ink `#000000` | Lime `#a8ff53` | `--color-signal-lime` |
| Highlight headline | — | `#7655fd` | `--color-event-violet` |
| Palet sintaks | — | `#9c9af2`, `#fa3abf`, `#afec73`, `#d9f07c`, `#e888f8`, `#f43f5e` | `--color-syntax-violet`, `-pink`, `-loop-green`, `-key-lime`, `-tag-magenta`, `-mute-red` |

Warna lama (putty, bone, chalk, paper, vellum) **dihapus** dari `globals.css`, tidak disisakan sebagai warisan.

### 3.2 Radius, spasi, layout

| Aspek | Lama | Baru |
|---|---|---|
| Radius cards | 9px | **4px** |
| Radius buttons | 28.8px | **4px** |
| Radius links | 2px | **4px** |
| Radius pill | — | **9999px** |
| Page max-width | 820px / 1120px | **1200px** |
| Section gap | 80px | **80–120px** |
| Card padding | 24px | **24–32px** |
| Spacing scale | 4·16·20·28·32·36·40·52·60·96·168 | **4·8·12·16·24·28·32·40·48·64·96·160·192** |

**Aturan yang dipertahankan dari sistem lama:** flat, tanpa shadow, tanpa gradient dekoratif.

### 3.3 Tipografi

| Peran | Lama | Baru |
|---|---|---|
| Display / heading | Playfair Display (`--font-davinci`) | **Inter** (`--font-display`) sebagai substitusi sah Satoshi, tracking `0.05em` pada ≥36px |
| Body / UI | Inter (`--font-helvetica-now`) | **Geist** (`--font-sans`), weight 300/400/500 |
| Kode / caption mono | — | **Geist Mono** (`--font-mono`), 14px, line-height 1.43 |

Type scale baru:

| Role | Size | Line height | Tracking | Token |
|---|---|---|---|---|
| caption | 14px | 1.43 | 0 | `--text-caption` |
| body | 16px | 1.56 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.4 | 0.4px | `--text-subheading` |
| heading-sm | 24px | 1.38 | — | `--text-heading-sm` |
| heading | 30px | 1.33 | — | `--text-heading` |
| heading-lg | 36px | 1.2 | 1.8px | `--text-heading-lg` |
| display | 48px | 1.11 | 2.4px | `--text-display` |
| hero | 60px | 1.0 | 3px | `--text-hero` |

**Konsekuensi:** seluruh label kecil 9–11px yang saat ini muncul ~10 kali di `page.tsx` **naik ke 14px**. Ini perubahan wajib, bukan preferensi, karena design melarang teks di bawah 14px.

**File disentuh:** `src/app/globals.css` (token penuh + animasi yang dipertahankan), `src/app/layout.tsx` (3 font + metadata).

---

## 4. Struktur Komponen

Hanya 4 komponen baru, masing-masing untuk pola yang **terbukti berulang**:

| Komponen | Perkiraan pemakaian | Tanggung jawab | Interface |
|---|---|---|---|
| `SectionLabel.tsx` | ~10× | label uppercase kecil di atas judul section | `{ children, className? }` |
| `FeaturePill.tsx` | ~12× | pill 9999px + ikon 12px berwarna opsional | `{ label, accent?, className? }` |
| `CodePane.tsx` | 2–3× | pane kode Inset + sorot sintaks, data-driven | `{ lines: CodeLine[], filename?, className? }` |
| `HairlineDivider.tsx` | ~4× | garis 1px steel border | `{ className? }` |

`CodePane` menerima data, bukan anak elemen, supaya sorot sintaks konsisten dan testable:
```ts
type TokenKind = "default" | "keyword" | "string" | "type" | "variable" | "property" | "comment";
type CodeLine = Array<{ text: string; kind: TokenKind }>;
```

**Tetap inline di `page.tsx`** (unik, tidak berulang): hero, code pane hero, grid Karya, 6 vignette, Motto, About, footer.

**Di-restyle di tempat:** `Header.tsx` (nav Geist 14px, CTA lime radius 4px, logo lockup), `Ticker.tsx` (marquee Geist Mono 14px, pemisah `//`).

**Tidak berubah:** `Reveal.tsx` (scroll-reveal tetap dipakai apa adanya).

Struktur akhir:
```
src/components/
├── Header.tsx           (restyle)
├── Reveal.tsx           (tidak berubah)
├── Ticker.tsx           (restyle)
├── SectionLabel.tsx     (baru)
├── FeaturePill.tsx      (baru)
├── CodePane.tsx         (baru)
└── HairlineDivider.tsx  (baru)
```
Target `page.tsx`: dari 445 baris menjadi ~300 baris.

---

## 5. Komposisi Halaman

Semua section berlatar Canvas `#1c1e21` kecuali **Karya** yang berlatar Inset `#121317`.

| # | Section | Background | Isi |
|---|---|---|---|
| 1 | Header | Canvas, sticky | logo lockup (glyph lime + nama Geist 600), nav Geist 14px, ghost link GitHub/Instagram, CTA lime, hamburger mobile |
| 2 | Hero | Canvas | SectionLabel → headline 60px → subtext 18px → CTA row → baris meta mono → wordmark `KHAMIMZAR` ~140px → code pane |
| 3 | Marquee | Canvas + hairline | ticker mono 14px |
| 4 | **Karya** | **Inset `#121317`** | 4 kartu radius 4px, border `#272a2e`, tag mono, pill "live" |
| 5 | Exhibition | Canvas | 6 foto, frame radius 4px + hairline, caption mono, label `01 / 06` |
| 6 | Marquee | Canvas + hairline | ticker mono 14px |
| 7 | Motto Tawakal | Canvas | teks utuh dipertahankan, blockquote 30px |
| 8 | About | Canvas | 2 kolom: narasi + kartu "visitor info" (Inset) + still life bunga |
| 9 | Marquee | Canvas + hairline | ticker mono 14px |
| 10 | Pills + Footer | Canvas + hairline atas | baris feature pill 6 hobi (ikon berwarna) lalu footer 3 kolom |

Ticker tetap muncul 3× seperti sekarang. Panel lukisan Renaissance full-bleed (Raphael) **dihapus**; perannya digantikan code pane di hero.

### 5.1 Arah penulisan ulang copy

Aturan: cerita dan kepribadian tetap, kosakata Renaissance/putty/Latin → dev/terminal.

**Wajib dipertahankan persis** (per `HANDOFF.md`): CTA "ngopi sambil ngobrol project →", footer "Made with ngopi & vibes coding wkwk", caption "wkwk tapi serius", dan **seluruh teks Motto Tawakal**. Isi 6 deskripsi hobi dan judul-judul hobi juga tidak diubah.

| Sekarang | Menjadi |
|---|---|
| Renaissance gallery on putty paper — Portfolio No. 01 | Portfolio — Folio No. 01 · Dev & Daily Rituals |
| Hidup di-*kurasi* sebagai seni rupa harian | Hidup aku *build* pelan-pelan — satu ritual sehari |
| Putty & Ink | Slate & Lime |
| Folio — Putty #C4C3B6 / Ink #000000 | Canvas #1C1E21 · Lime #A8FF53 |
| Davinci 374px · Helvetica Now 12px · Radius 28.8px | Geist Mono 14px · Radius 4px · Hairline 1px |
| Latin: Fragmenta Temporis, Iter Matutinum, Cultura Silens, Cathedralis Vitrea, Calligraphia Codex, Amarum Lucidum | `foto-random.jpg`, `ride-pagi.sh`, `tanaman.care`, `aquarium.md`, `coding.vibes`, `ngopi-project.log` |
| Exhibition Card — 01 | `run.log — 01` |
| Classical Panel — Raphael, The School of Athens (1511) | `terminal pane — scroll to read` |
| Kode & *kertas* yang sudah dipajang | Yang sudah aku *deploy* & rawat |
| no gradients, no shadows — only putty & ink | no shadows, no gradients — only slate & lime |
| Trio hexagon (indikator vignette) | label mono `01 / 06` |
| Pemisah ticker `◆` | `//` |

### 5.2 Isi code pane (sudah diputuskan)

Code pane di hero berisi objek TypeScript pendek yang benar-benar menggambarkan pemiliknya — bukan kode contoh generik, dan bukan kode yang mengklaim hal yang tidak benar. Rencana isi:

```ts
// folio.ts — khamimzar
const rituals = [
  "foto-random", "bersepeda", "tanaman",
  "aquarium", "vibes-coding", "ngopi",
] as const;

function build(kind: "slowly"): string {
  return rituals.join(" + ") + " — " + kind;
}
```

Sorot sintaks memakai peran token dari design: `const`/`function`/`return` = keyword (violet), string literal = string (pink), `rituals`/`build` = variable (key lime), `readonly`/tipe = type (loop green), komentar = comment (fog), teks lain = default (fog). Panah `→` di dalam string harus dihindari (bukan ASCII) — gunakan tanda hubung.

Isi code pane di section lain (jika dipakai) mengikuti pola yang sama: kode pendek, jujur, relevan dengan section-nya.

### 5.3 Metadata

`src/app/layout.tsx` diperbarui agar tidak menyebut sistem lama:

- `title.default`: `"KHAMIM ZARKASYI — Folio No. 01"`
- `title.template`: `"%s — Khamim Zarkasyi"` (tidak berubah)
- `description`: menyebut ritual harian (foto, sepeda, tanaman, aquarium, coding, ngopi) tanpa kata "putty"/"Renaissance"
- `openGraph.description` dan `twitter.description`: diselaraskan dengan `description`
- `keywords`: `putty` dan `Renaissance` diganti dengan `developer`, `portfolio`, `Indonesia`, `vibes coding`
- `metadataBase`, `alternates.canonical`, `verification.google`, `robots`, `icons` **tidak berubah**

---

## 6. Aset

| Aset | Baru | Cara |
|---|---|---|
| `src/app/icon.svg` | rounded-square slate radius 4px + segitiga play lime | tulis manual |
| `src/app/icon.png` (512×512) | turunan icon.svg | `rsvg-convert` / `magick` |
| `src/app/apple-icon.png` (180×180) | turunan icon.svg | `magick` |
| `public/og/og-cover.png` (1200×630) | canvas slate + headline + CTA lime + mock code pane | Python PIL 12.3.0 |

Tooling terverifikasi tersedia di device: `magick`, `convert`, `rsvg-convert`, `ffmpeg`, `python3` + PIL 12.3.0, dan `sharp` di `node_modules`.

---

## 7. Verifikasi

Device ini **tidak punya browser** (`chromium`/`chrome` tidak ada), sehingga konfirmasi visual akhir adalah tanggung jawab user via `npm run dev`. Bukti yang akan dikumpulkan:

1. `npm run build` hijau.
2. `npm run lint` bersih.
3. **Grep penjaga token lama:** `c4c3b6`, `e7e5e4`, `ebebeb`, `dfdcd5`, `Playfair`, `Davinci`, `putty`, `renaissance` (case-insensitive) di `src/` harus **0 hit**.
4. **Smoke test SSR nyata:** `npm run dev` lalu `curl -s localhost:3000` — HTML ter-render harus memuat headline baru dan `#1c1e21`/`#a8ff53`, dan **tidak** memuat `Playfair`/`c4c3b6`.
5. `magick identify` pada 4 aset hasil regenerasi (ukuran & dimensi).
6. `git status` + diff stat ditunjukkan ke user sebelum ada commit.

---

## 8. Batas Kerja

**Tidak dilakukan tanpa izin eksplisit user:**
- `git commit`, `git push`, `vercel --prod`

**Tidak diubah:**
- 7 foto di `public/hobi/`
- `src/components/Reveal.tsx`
- Seluruh teks Motto Tawakal
- Isi dan judul 6 deskripsi hobi

**Tidak ditambahkan:** dependency baru (Inter, Geist, Geist Mono semuanya tersedia di `next/font/google` — sudah diverifikasi).

**Rollback:** `~/backup-khamim-portfolio/20261016-094907/rollback-design.sh soft` lalu `npm run build`. Uji rollback sudah terbukti berhasil (lihat `README-BACKUP.md`).

---

## 9. Dependensi Eksternal (catatan risiko)

| Dependensi | Status | Dampak jika gagal |
|---|---|---|
| `next/font/google` — Inter, Geist, Geist_Mono | Diverifikasi ada di `next/dist/compiled/@next/font/dist/google/index.d.ts` | Font build gagal; fallback ke substitusi sistem |
| Satoshi (Fontshare) | **Tidak tersedia** di Google Fonts | Sudah dimitigasi: Inter dipakai sebagai display (keputusan #4) |
| `magick`, `rsvg-convert`, PIL, `sharp` | Diverifikasi ada di device | Regenerasi aset OG/icon gagal; aset lama tetap dipakai |

---

## 10. Ruang Lingkup yang Sengaja Dikecualikan (YAGNI)

- Tidak ada blog, testimoni, atau section baru.
- Tidak ada halaman kedua atau routing baru.
- Tidak ada dependency UI baru (framer-motion, radix, dsb).
- Tidak ada test runner baru; verifikasi lewat build + lint + grep + smoke test SSR.
- Tidak ada perubahan pada `robots.ts`, `sitemap.ts`, `next.config.ts`.
- Tidak ada refactor di luar yang dibutuhkan re-skin ini.
