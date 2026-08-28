# 🌐 Catatan Domain & Google Search Console — khamimzar.my.id

> **Dibuat:** 28 Agu 2026 07:2x WIB  
> **Project:** `khamim-portfolio` (Next.js 16 + Tailwind 4) — `~/khamim-portfolio`  
> **Owner:** Khamim Zarkasyi — khamimzarrr@gmail.com / khamimzar@gmail.com (GSC) — GitHub khamimzarr — Vercel khamimzar-2499 / voiddarkfire

---

## 1. Domain

| Item | Detail |
|------|--------|
| **Domain** | `khamimzar.my.id` — beli di **IDwebhost** (member.idwebhost.com) 27 Agu 2026 |
| **Registrar** | IDwebhost (Third Party di Vercel) |
| **Nameserver** | tetap `ns1.idwebhost.id` / `ns2.idwebhost.id` — **jangan diganti ke Vercel** |
| **Vercel Project** | `khamim-portfolio` — `prj_p4q2IudMyYWnjHcHGKvOVT615Q5W` — team `voiddarkfire` (team_Rb0ylG7nhbMbWZ2lmMnPs7HO) |
| **Live utama** | `https://khamimzar.my.id` (apex tanpa www) — `308` dari `www` → apex |
| **Alt** | `https://khamim-portfolio.vercel.app` (masih aktif tapi bukan canonical) |

### DNS IDwebhost (DNS Management — jangan dihapus!)

| Type | Host / Name | Value | TTL |
|------|-------------|-------|-----|
| A | `@` | `216.198.79.1` | 3600 |
| A | `@` | `64.29.17.1` | 3600 |
| CNAME | `www` | `8c24bcb15603007c.vercel-dns-017.com.` | 3600 |
| TXT | `@` | `google-site-verification=wK2YTrRAtctmJjl8t_Ax28Aqo2yD7TTr9LGd4olm1gI` | 3600 |

> Alternatif Vercel kalau cuma 1 A: `76.76.21.21` — tapi sekarang pakai 2 A di atas (rank 1).

### Vercel Domain Config (verified 27-28 Agu 2026)

```
khamimzar.my.id      → redirect: null (utama) — verified: true — configuredBy: A — 308? no, 200
www.khamimzar.my.id  → redirect: khamimzar.my.id 308 — verified: true — configuredBy: CNAME
khamim-portfolio.vercel.app → redirect: null
```

Verifikasi:
```bash
npx vercel domains verify khamimzar.my.id
npx vercel domains verify www.khamimzar.my.id
# harus: status ok, configured-correctly, misconfigured false
npx vercel certs ls
# 2 cert 90d: khamimzar.my.id + www.khamimzar.my.id
curl -I https://khamimzar.my.id          # 200
curl -I https://www.khamimzar.my.id      # 308 → https://khamimzar.my.id/
curl -s https://dns.google/resolve?name=khamimzar.my.id&type=TXT | grep google-site-verification
```

---

## 2. SEO — Code (Next.js)

**File:** `src/app/layout.tsx`

```ts
metadataBase: new URL("https://khamimzar.my.id")
openGraph.url: "https://khamimzar.my.id"
verification.google: "wK2YTrRAtctmJjl8t_Ax28Aqo2yD7TTr9LGd4olm1gI"
```

**File baru:**

- `src/app/sitemap.ts` → `https://khamimzar.my.id/sitemap.xml` (1 URL: `/`, weekly, priority 1)
- `src/app/robots.ts` → `Allow: /`, `Sitemap: https://khamimzar.my.id/sitemap.xml`, `Host: https://khamimzar.my.id`

Cek live:
```bash
curl -s https://khamimzar.my.id/sitemap.xml
curl -s https://khamimzar.my.id/robots.txt
curl -s https://khamimzar.my.id | grep google-site-verification
```

Commit terkait:
```
fe1b213 feat: use khamimzar.my.id as canonical domain
b57708b feat(seo): add sitemap.xml + robots.txt for Google Search Console
1d0f0f7 feat(seo): add Google Search Console verification
```

Deploy terakhir: `khamim-portfolio-6c99ir8qm` ● Ready (28 Agu 00:xx WIB)

---

## 3. Google Search Console (GSC)

| Item | Detail |
|------|--------|
| **Akun GSC** | `khamimzar@gmail.com` (login di pojok kanan GSC harus ini) |
| **Property** | **Domain:** `khamimzar.my.id` (cover apex + www + subdomain) |
| **Metode verifikasi** | **Dual** — TXT DNS + meta tag (HTML tag) — keduanya LIVE |
| **Token** | `google-site-verification=wK2YTrRAtctmJjl8t_Ax28Aqo2yD7TTr9LGd4olm1gI` |
| **Sitemap submit** | `https://khamimzar.my.id/sitemap.xml` — **Terkirim 28 Agu 2026** — status awal `Tidak dapat mengambil peta situs` + `0 halaman` — **NORMAL** untuk domain baru, akan jadi `Berhasil` dalam 1-24 jam |
| **Inspeksi URL** | `https://khamimzar.my.id/` → awalnya `Ups! Ada yang tidak beres` saat `Minta Pengindeksan` — **28 Agu 07:3x WIB: Inspeksi → "URL sudah tersedia" (HTML 116k kebaca) → Pengindeksan diminta → "URL telah ditambahkan ke antrean crawl prioritas" ✅** |

### Cara verifikasi Ulang (jika perlu)

**Domain (TXT):**
1. IDwebhost → DNS Management → TXT `@` = token di atas
2. Cek: `https://dns.google/resolve?name=khamimzar.my.id&type=TXT` harus muncul token
3. GSC → Verifikasi

**URL prefix (meta tag) — langsung hijau:**
1. GSC → Tambah Property → **URL prefix** → `https://khamimzar.my.id` → metode **Tag HTML**
2. Token sudah ada di `layout.tsx` → klik Verifikasi → langsung Berhasil

Setelah Verified → **Sitemaps** → submit `https://khamimzar.my.id/sitemap.xml`  
**28 Agu 07:3x: Inspeksi URL → Tersedia → Minta Pengindeksan → antrean prioritas (jangan submit lagi, tunggu 1-7 hari)**  
Cek indexing 2-3 hari: `site:khamimzar.my.id` di google.com — **28 Agu cek: belum muncul = NORMAL (domain umur 1 hari)**

---

## 4. Reminder Otomatis (Termux)

**Script:** `~/scripts/shell/check-gsc-khamimzar.sh` — cek `sitemap 200?`, `homepage 200?`, `TXT ada?`

**Jadwal:**

| Via | Jadwal | Detail |
|-----|--------|--------|
| `cron` (`crond -s`) | tiap hari **08:00 WIB** | `0 8 * * * ... >> ~/.gsc-check.log` — kirim `termux-notification` |
| `termux-job-scheduler` #207711 | 24 jam persisted | backup kalau reboot |
| `~/.termux/boot/start-crond.sh` | tiap boot | `crond -s` auto-start |
| Log | `~/.gsc-check.log` | histori cek |

**Notifikasi besok 29 Agu 08:00:**
> 🔍 Reminder: Cek Google Search Console — ✅ khamimzar.my.id masih OK! Cek GSC → Sitemaps harusnya sudah 'Berhasil'

**Cek manual:**
```bash
~/scripts/shell/check-gsc-khamimzar.sh
cat ~/.gsc-check.log
crontab -l
termux-job-scheduler --pending
```

**Matikan reminder (setelah ke-index):**
```bash
crontab -r  # atau crontab -e hapus baris 0 8 * * *
termux-job-scheduler --cancel --job-id 207711
```

---

## 5. Checklist Next Session (AI wajib baca ini dulu!)

- [ ] Domain masih `khamimzar.my.id` tanpa www jadi utama? `curl -I https://khamimzar.my.id` 200, www 308
- [ ] DNS IDwebhost masih 2 A + CNAME + TXT? Jangan hapus!
- [ ] `layout.tsx` masih `khamimzar.my.id` + verification token?
- [x] GSC status 28 Agu 07:3x: Sitemaps terkirim (Tidak dapat mengambil = antri), Inspeksi URL Tersedia (116k), Minta Pengindeksan → antrean prioritas ✅
- [ ] 29 Agu: Sitemaps jadi `Berhasil`? Halaman ditemukan 1?
- [ ] `site:khamimzar.my.id` — 28 Agu belum muncul = normal, cek lagi 30-31 Agu (1-7 hari)
- [ ] Kalau semua hijau → hapus cron reminder atau ganti jadi weekly

---

## 6. Link Penting Update

| Apa | URL Baru |
|-----|----------|
| Portfolio Live (canonical) | https://khamimzar.my.id |
| Sitemap | https://khamimzar.my.id/sitemap.xml |
| Robots | https://khamimzar.my.id/robots.txt |
| GSC | https://search.google.com/search-console (property: khamimzar.my.id) |
| Vercel Project | khamim-portfolio (voiddarkfire) |
| GitHub | https://github.com/khamimzarr/khamim-portfolio |

> **Catatan untuk AI next session:** Jangan tanya lagi "domainnya apa?" — sudah `khamimzar.my.id` apex tanpa www. Kalau mau ganti ke www lagi, ubah via `npx vercel api /v9/projects/.../domains` PATCH redirect, jangan ubah DNS. SSL auto-renew 90d. GSC akun `khamimzar@gmail.com` token `wK2YTrR...`.

---

## 7. Polish Lanjut 28 Agu 07:3x

- `layout.tsx` → `alternates.canonical: https://khamimzar.my.id` → `<link rel="canonical" href="https://khamimzar.my.id">` LIVE
- `page.tsx` → karya `khamim-portfolio` vercel link `khamim-portfolio.vercel.app` → `khamimzar.my.id` (self canonical, tanpa www)
- Deploy `nfgrjwv9b` ● Ready 16s — canonical + self link verified live
- Next: Bing Webmaster (opsional) — submit sitemap sama `https://khamimzar.my.id/sitemap.xml`

- **28 Agu 06:08 WIB: Repo di-private** → `gh repo edit --visibility private` → `PRIVATE` ✅ — site `khamimzar.my.id` tetap 200, Vercel link `github khamimzarr/khamim-portfolio` tetap aktif, auto-deploy tetap jalan

- **28 Agu 10:1x WIB: Repo balik PUBLIC** → private bikin Vercel BLOCKED (team VOID Hobby seat) → `vercel logout/login + link + vercel --prod` → deploy `l6dcocj6e` READY alias `khamimzar.my.id` — Karya 05→04 live
