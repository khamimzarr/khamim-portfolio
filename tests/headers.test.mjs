import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = readFileSync("next.config.ts", "utf8");

const REQUIRED = [
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Content-Security-Policy",
];

test("header keamanan wajib terpasang di semua path", () => {
  for (const key of REQUIRED) {
    assert.ok(config.includes(key), `header hilang: ${key}`);
  }
  assert.ok(/source:\s*"\/:path\*"/.test(config), "header tidak dipasang untuk semua path");
});

test("CSP tidak membuka object-src dan tidak membolehkan framing", () => {
  assert.ok(config.includes("object-src 'none'"), "object-src tidak dikunci");
  assert.ok(config.includes("frame-ancestors 'none'"), "frame-ancestors tidak dikunci");
  assert.ok(config.includes("form-action 'self'"), "form-action tidak dibatasi");
});

test("CSP tidak membuka script dari domain luar", () => {
  const csp = config.slice(config.indexOf("Content-Security-Policy"));
  assert.ok(/script-src 'self'/.test(csp), "script-src tidak dibatasi ke self");
  assert.ok(!/script-src[^"]*https?:/.test(csp), "script-src membolehkan host luar");
});

test("foto disajikan dalam format modern", () => {
  assert.ok(/formats:\s*\["image\/avif",\s*"image\/webp"\]/.test(config), "AVIF/WebP belum aktif");
});

test("nilai quality yang dipakai halaman sudah didaftarkan", () => {
  // Next 16 membalas 400 kalau quality tidak ada di daftar images.qualities.
  const page = readFileSync("src/app/page.tsx", "utf8");
  const used = [...page.matchAll(/quality=\{(\d+)\}/g)].map((m) => m[1]);
  const allowed = (config.match(/qualities:\s*\[([^\]]+)\]/) || [])[1];
  assert.ok(allowed, "images.qualities tidak diatur");
  const list = allowed.split(",").map((v) => v.trim());
  assert.ok(used.length > 0, "page.tsx tidak memakai quality sama sekali");
  for (const q of used) {
    assert.ok(list.includes(q), `quality ${q} dipakai tapi tidak ada di images.qualities`);
  }
});
