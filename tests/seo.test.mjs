import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const layout = readFileSync("src/app/layout.tsx", "utf8");

test("meta description muat di hasil pencarian", () => {
  const match = layout.match(/description:\s*\n?\s*"([^"]+)"/);
  assert.ok(match, "meta description tidak ditemukan");
  assert.ok(match[1].length <= 160, `description ${match[1].length} karakter, di atas 160`);
  assert.ok(match[1].length >= 80, `description ${match[1].length} karakter, terlalu pendek`);
});

test("description tidak mengklaim semua project Next.js", () => {
  const match = layout.match(/description:\s*\n?\s*"([^"]+)"/);
  assert.ok(match, "meta description tidak ditemukan");
  const desc = match[1];
  // Dari empat kartu karya hanya dua yang bertumpuk Next.js; kalimat lama
  // ("Empat project Next.js") membuat Google mengutip klaim yang salah.
  assert.ok(!/empat project next\.js/i.test(desc), "description masih menyebut semua project Next.js");
  assert.ok(/empat project live/i.test(desc), "description harus menyebut jumlah project live");
  const og = layout.match(/openGraph:\s*{[^}]*description:\s*\n?\s*"([^"]+)"/);
  assert.ok(og, "og:description tidak ditemukan");
  assert.ok(!/next\.js/i.test(og[1]), "og:description masih mengklaim Next.js");
});

test("judul dan manifest tidak menyebut konsep yang beda dari isi halaman", () => {
  // "· Karya" hanya label section; judul SERP harus menyebut siapa pemiliknya.
  const title = layout.match(/default:\s*"([^"]+)"/);
  assert.ok(title, "judul default tidak ditemukan");
  assert.ok(/frontend developer/i.test(title[1]), `judul "${title[1]}" tidak menyebut peran`);
  const manifest = readFileSync("src/app/manifest.ts", "utf8");
  assert.ok(!manifest.includes("Empat project Next.js"), "deskripsi manifest masih klaim lama");
  assert.ok(!layout.includes("Empat project Next.js"), "layout masih menyimpan kalimat lama");
});

test("halaman membawa data terstruktur Person dan WebSite", () => {
  assert.ok(layout.includes("application/ld+json"), "JSON-LD tidak dipasang");
  assert.ok(layout.includes('"@type": "Person"'), "schema Person hilang");
  assert.ok(layout.includes('"@type": "WebSite"'), "schema WebSite hilang");
  assert.ok(layout.includes('"@id": "https://khamimzar.my.id/#person"'), "id Person hilang");
  assert.ok(layout.includes("bukann_bapakmu") && layout.includes("github.com/khamimzarr"), "sameAs tidak lengkap");
});

test("theme-color dipasang lewat viewport", () => {
  assert.ok(/export const viewport/.test(layout), "export viewport hilang");
  assert.ok(layout.includes('themeColor: "#080808"'), "themeColor bukan warna kanvas");
});

test("manifest web app ada dan berisi ikon nyata", () => {
  const path = "src/app/manifest.ts";
  assert.ok(existsSync(path), "src/app/manifest.ts hilang");
  const src = readFileSync(path, "utf8");
  assert.ok(src.includes('name: "Khamim Zarkasyi'), "nama manifest hilang");
  assert.ok(src.includes('theme_color: "#080808"'), "theme_color manifest hilang");
  for (const icon of ["/icon-192.png", "/icon.png"]) {
    assert.ok(src.includes(icon), `ikon manifest hilang: ${icon}`);
  }
});
