import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");

const terrainPath = "src/components/RoutingTerrain.tsx";
const mountPath = "src/components/RoutingTerrainMount.tsx";
const terrain = existsSync(terrainPath) ? readFileSync(terrainPath, "utf8") : "";
const mount = existsSync(mountPath) ? readFileSync(mountPath, "utf8") : "";

test("terrain dipasang sekali di dalam kartu 03 Routing", () => {
  assert.ok(existsSync(terrainPath), "RoutingTerrain.tsx missing");
  assert.ok(existsSync(mountPath), "RoutingTerrainMount.tsx missing");
  assert.equal((page.match(/<RoutingTerrainMount\b/g) || []).length, 1, "terrain should mount once");

  const routing = page.slice(page.indexOf('id="routing"'), page.indexOf('id="data"'));
  assert.ok(routing.includes("<RoutingTerrainMount"), "terrain is not inside #routing");
  assert.ok(routing.includes("relative isolate"), "routing panel is not an isolated stacking context");
  assert.ok(routing.includes("-z-10"), "terrain is not behind the diagram");
  // Konten alur harus di atas terrain.
  assert.ok(/eyebrow relative z-10/.test(routing), "label Alur is not layered at z-10");
  assert.ok(/relative z-10">\s*<RoutingDiagram/.test(routing), "diagram is not layered at z-10");
});

test("geometrinya kisi grid, bukan pita ombak", () => {
  const cols = terrain.match(/const COLS = (\d+)/);
  const rows = terrain.match(/const ROWS = (\d+)/);
  assert.ok(cols && rows, "grid constants missing");
  const total = Number(cols[1]) * Number(rows[1]);
  assert.ok(total >= 1000, `only ${total} particles`);

  // Garis horizontal + vertikal antar titik = kisi, bukan pita.
  assert.ok(terrain.includes("gl.LINES"), "no grid wires between particles");
  assert.ok(terrain.includes("gl.POINTS"), "no particles");
  assert.ok(/for \(let col = 0; col < COLS - 1/.test(terrain), "no horizontal grid rows");
  assert.ok(/for \(let row = 0; row < ROWS - 1/.test(terrain), "no vertical grid columns");
  assert.ok(terrain.includes("float h = sin("), "terrain height is not driven by sine waves");
  assert.ok(terrain.includes("uTime"), "terrain has no time uniform");
});

test("warna emerald + cyber lime di atas slate, tanpa cyan seperti hero", () => {
  assert.ok(terrain.includes("0.063, 0.725, 0.506"), "emerald #10b981 missing");
  assert.ok(terrain.includes("0.639, 0.902, 0.208"), "cyber lime #a3e635 missing");
  assert.ok(terrain.includes("0.200, 0.255, 0.333"), "slate #334155 missing");
  // Palet wave hero (#0284c7 / #06b6d4) tidak boleh ikut.
  assert.ok(!terrain.includes("0.518, 0.780"), "sky blue from the hero wave leaked in");
  assert.ok(!terrain.includes("0.024, 0.714, 0.831"), "cyan from the hero wave leaked in");
});

test("layer dekoratif ditahan 20-25% dan tidak menangkap klik", () => {
  const block = css.slice(css.indexOf(".terrain-layer"), css.indexOf("}", css.indexOf(".terrain-layer")));
  const opacity = block.match(/opacity:\s*([\d.]+)/);
  assert.ok(opacity, "terrain-layer has no opacity");
  assert.ok(Number(opacity[1]) >= 0.2 && Number(opacity[1]) <= 0.25, `opacity ${opacity[1]} outside 20-25%`);
  assert.ok(block.includes("mask-image"), "terrain edges are not softened");
  assert.ok(/pointer-events-none/.test(terrain), "terrain must not catch taps");
  assert.ok(/aria-hidden/.test(terrain), "terrain must be hidden from screen readers");
});

test("SSR mati, reduced motion dihormati, canvas berhenti saat tak terlihat", () => {
  assert.ok(terrain.startsWith('"use client"'), "RoutingTerrain must be a client component");
  assert.ok(mount.startsWith('"use client"'), "mount wrapper must be a client component");
  assert.ok(/dynamic\(/.test(mount), "mount does not use next/dynamic");
  assert.ok(/ssr:\s*false/.test(mount), "dynamic import must disable SSR");
  assert.ok(terrain.includes("prefers-reduced-motion"), "terrain ignores reduced motion");
  assert.ok(terrain.includes("visibilitychange"), "terrain keeps rendering in a hidden tab");
  assert.ok(terrain.includes("IntersectionObserver"), "terrain keeps rendering offscreen");
});

test("mesh SVG lama sudah pensiun", () => {
  assert.ok(!existsSync("src/components/MeshBackdrop.tsx"), "MeshBackdrop.tsx still present");
  assert.ok(!page.includes("MeshBackdrop"), "page still imports MeshBackdrop");
  assert.ok(!css.includes(".mesh-drift"), "mesh-drift CSS left behind");
  assert.ok(!css.includes(".mesh-breathe"), "mesh-breathe CSS left behind");
});
