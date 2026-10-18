import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const sidebar = readFileSync("src/components/Sidebar.tsx", "utf8");

const OUTPUTS = [
  { name: "hr-ai-review", live: "https://hr-ai-review-nine.vercel.app" },
  { name: "ruang-resepsi", live: "https://ruang-resepsi.vercel.app" },
  { name: "structur-md", live: "https://structur-md.vercel.app" },
  { name: "dropdeploy", live: "https://dropdeploy.my.id" },
];

test("empat tangkapan layar project ada di public/output dan benar-benar JPEG", () => {
  for (const o of OUTPUTS) {
    const path = `public/output/${o.name}.jpg`;
    assert.ok(existsSync(path), `tangkapan layar hilang: ${path}`);
    const head = readFileSync(path).subarray(0, 3);
    assert.deepEqual([...head], [0xff, 0xd8, 0xff], `${path} bukan JPEG`);
  }
});

test("tangkapan layar tetap ringan", () => {
  // Batas 150 KB per berkas: tanpa penjaga ini foto 300 KB gampang masuk lagi.
  for (const o of OUTPUTS) {
    const size = statSync(`public/output/${o.name}.jpg`).size;
    assert.ok(size < 150 * 1024, `${o.name}.jpg ${Math.round(size / 1024)} KB, di atas 150 KB`);
  }
});

test("tiap kartu karya memuat tangkapan layar dan tautan live-nya", () => {
  for (const o of OUTPUTS) {
    assert.ok(page.includes(`/output/${o.name}.jpg`), `tile hilang: ${o.name}`);
    assert.ok(page.includes(o.live), `tautan live hilang: ${o.name}`);
  }
  // Kartu kini satu blok utuh, jadi tautan live dibangun dari data kartu sendiri.
  const links = page.match(/href=\{p\.live\}/g) || [];
  assert.equal(links.length, 1, "tiap kartu harus memakai satu tautan p.live dari data project");
});

test("tidak ada lagi section Output terpisah, karya jadi satu section", () => {
  assert.ok(!page.includes('id="output"'), "section #output masih ada, mestinya sudah lebur ke 02 Karya");
  assert.ok(!page.includes('label="Output"'), "label section Output masih ada");
  assert.ok(!sidebar.includes('label: "Output"'), "nav sidebar masih menautkan Output");
  assert.ok(!/exhibition/i.test(page + sidebar), "sisa kata Exhibition masih ada");
  assert.ok(page.includes('id="karya"'), "section Karya hilang");
});

test("panel log berisi empat entri", () => {
  const block = page.slice(page.indexOf("const log = ["), page.indexOf("];", page.indexOf("const log = [")));
  const entries = block.match(/\{ hash: "/g) || [];
  assert.equal(entries.length, 4, `panel log harus 4 entri, ada ${entries.length}`);
  assert.ok(block.includes('hash: "a11y"'), "entri a11y hilang dari log");
});

test("foto hobi lama sudah dibersihkan", () => {
  // 960 KB aset mati: sudah tidak ada yang merujuknya sejak section 03 jadi Output.
  assert.ok(!existsSync("public/hobi"), "folder public/hobi masih ada");
  for (const f of ["foto-random", "bersepeda", "tanaman", "ikan", "coding", "ngopi", "foto-bunga"]) {
    assert.ok(!existsSync(`public/hobi/${f}.jpg`), `foto hobi masih ada: ${f}.jpg`);
  }
});
