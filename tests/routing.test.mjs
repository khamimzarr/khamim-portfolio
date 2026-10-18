import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");
const path = "src/components/RoutingDiagram.tsx";

const PROJECTS = ["hr-ai-review", "ruang-resepsi", "structur-md", "dropdeploy"];

test("komponen routing ada dan menggantikan paragraf meta", () => {
  assert.ok(existsSync(path), "RoutingDiagram.tsx missing");
  assert.ok(page.includes("RoutingDiagram"), "page does not use RoutingDiagram");
  assert.ok(!/Halaman ini dibangun seperti konsol gelap/.test(page), "meta paragraph still present");
});

test("simpul routing kembali ke alur karya yang disetujui owner", () => {
  const src = readFileSync(path, "utf8");
  assert.ok(src.includes('label="KHAMIMZAR"'), "node atas bukan KHAMIMZAR");
  assert.ok(src.includes('label="TERMINAL"'), "node tengah bukan TERMINAL");
  assert.ok(src.includes('sub="vibe coding"'), "keterangan node tengah bukan vibe coding");
  // Label service map sebelumnya tidak boleh tersisa.
  assert.ok(!src.includes('label="DOMAIN"'), "label DOMAIN masih ada");
  assert.ok(!src.includes('label="EDGE"'), "label EDGE masih ada");
  assert.ok(!src.includes("khamimzar.my.id"), "host masih dipakai sebagai label node");
  for (const p of PROJECTS) {
    assert.ok(src.includes(p), `output node missing: ${p}`);
  }
});

test("routing diagram pindah ke section 03 dan tidak lagi di dalam Tentang", () => {
  const routing = page.indexOf('id="routing"');
  const data = page.indexOf('id="data"');
  assert.ok(routing > 0, "section #routing hilang");
  assert.ok(data > routing, "section #data harus setelah #routing");
  assert.ok(page.indexOf("RoutingDiagram />") > routing, "RoutingDiagram tidak dipasang di section Routing");
  assert.ok(page.indexOf("RoutingDiagram />") < data, "RoutingDiagram bocor ke section Data");
});

test("diagram punya versi desktop dan mobile", () => {
  const src = readFileSync(path, "utf8");
  const svgs = src.match(/<svg/g) || [];
  assert.ok(svgs.length >= 2, `expected a desktop and a mobile svg, found ${svgs.length}`);
});

test("denyut routing dianimasikan dan dihormati reduced motion", () => {
  assert.ok(css.includes(".route-pulse"), "pulse class missing");
  assert.ok(/@keyframes\s+route-pulse/.test(css), "pulse keyframes missing");
  const reduceBlock = css.slice(css.indexOf("prefers-reduced-motion"));
  assert.ok(/route-pulse/.test(reduceBlock), "reduced motion does not stop the pulse");
});
