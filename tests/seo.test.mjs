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
