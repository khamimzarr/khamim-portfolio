import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const sidebar = readFileSync("src/components/Sidebar.tsx", "utf8");
const terminal = readFileSync("src/components/Terminal.tsx", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const PROJECTS = ["hr-ai-review", "ruang-resepsi", "structur-md", "dropdeploy"];
const LIVE = ["hr-ai-review-nine.vercel.app", "ruang-resepsi.vercel.app", "structur-md.vercel.app", "dropdeploy.my.id"];
const PHOTOS = ["foto-random", "bersepeda", "tanaman", "ikan", "coding", "ngopi"];

test("section console ada semua", () => {
  for (const id of ["karya", "exhibition", "tentang", "terminal"]) {
    assert.ok(page.includes(`id="${id}"`), `section missing: #${id}`);
  }
});

test("section Motto sudah dihapus", () => {
  assert.ok(!/Motto/i.test(page), "Motto section still present");
  assert.ok(!/Maha Perencana/.test(page), "motto quote still present");
});

test("empat karya nyata dengan tautan live", () => {
  for (const p of PROJECTS) {
    assert.ok(page.includes(p), `project missing: ${p}`);
  }
  for (const url of LIVE) {
    assert.ok(page.includes(url), `live url missing: ${url}`);
  }
});

test("enam foto exhibition dan kontak tentang nyata", () => {
  for (const f of PHOTOS) {
    assert.ok(page.includes(`/hobi/${f}.jpg`), `photo missing: ${f}`);
  }
  assert.ok(/mailto:khamimzarrr@gmail\.com/.test(page), "email missing");
  assert.ok(page.includes("github.com/khamimzarr"), "github missing");
  assert.ok(page.includes("instagram.com/bukann_bapakmu"), "instagram missing");
});

test("terminal dibangun dari karya", () => {
  for (const p of PROJECTS) {
    assert.ok(terminal.includes(p), `terminal does not mention ${p}`);
  }
  assert.ok(/prefers-reduced-motion|useReducedMotion/.test(terminal), "terminal ignores reduced motion");
});

test("sidebar menautkan section console", () => {
  for (const id of ["karya", "exhibition", "tentang", "terminal"]) {
    assert.ok(sidebar.includes(`id: "${id}"`), `sidebar missing target ${id}`);
    assert.ok(page.includes(`id="${id}"`), `page missing section ${id}`);
  }
  assert.ok(sidebar.includes("aria-current"), "sidebar has no active state");
});

test("tiga dimensi sudah dilepas", () => {
  assert.ok(!pkg.dependencies.three, "three still a dependency");
  assert.ok(!pkg.dependencies["@react-three/fiber"], "r3f still a dependency");
  assert.ok(!existsSync("src/components/three"), "three components still present");
  assert.ok(!/AmbientBackground|HeroScene|KaryaScene/.test(page), "3D still imported");
});

test("teks Tentang yang lama sudah dihapus", () => {
  assert.ok(!/Seorang penjaga hal kecil/.test(page), "old heading still present");
  assert.ok(!/Halo, aku Khamim Zarkasyi/.test(page), "old paragraph still present");
  assert.ok(page.includes("RoutingDiagram"), "routing diagram should stay in Tentang");
  assert.ok(page.includes("Still life, bunga di halaman Khamim"), "still life caption should stay");
});

test("card Data dan card foto memakai perlakuan yang sama", () => {
  assert.ok(page.includes("items-stretch"), "grid does not stretch both cards to one height");
  assert.ok(!page.includes('className="tile p-2"'), "photo card still uses the old mismatched frame");
  const panelCards = page.match(/panel flex flex-col p-4 md:p-5/g) || [];
  assert.ok(panelCards.length >= 2, `expected both cards to share one treatment, found ${panelCards.length}`);
});

test("suara personal di footer tetap ada", () => {
  assert.ok(page.includes("Made with ngopi & vibes coding wkwk"), "personal footer line missing");
});
