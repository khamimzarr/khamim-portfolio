import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const globePath = "src/components/TechGlobe.tsx";
const mountPath = "src/components/TechGlobeMount.tsx";
const landPath = "src/components/globe-land.ts";
const globe = existsSync(globePath) ? readFileSync(globePath, "utf8") : "";
const mount = existsSync(mountPath) ? readFileSync(mountPath, "utf8") : "";
const land = existsSync(landPath) ? readFileSync(landPath, "utf8") : "";

const routing = page.slice(page.indexOf('id="routing"'), page.indexOf('id="data"'));

test("kartu globe duduk di section 03, tepat di bawah kartu ALUR", () => {
  assert.ok(existsSync(globePath), "TechGlobe.tsx missing");
  assert.ok(existsSync(mountPath), "TechGlobeMount.tsx missing");
  assert.equal((page.match(/<TechGlobeMount\b/g) || []).length, 1, "globe should mount once");

  assert.ok(routing.includes("<TechGlobeMount"), "globe is not inside #routing");
  const alur = routing.indexOf("RoutingDiagram");
  const card = routing.indexOf("<TechGlobeMount");
  assert.ok(alur > -1 && card > alur, "globe card is not below the ALUR card");

  // Wadah canvas sesuai brief.
  assert.ok(/aspect-square[^"]*max-w-\[280px\]/.test(routing), "globe container is not aspect-square max-w-[280px]");
  assert.ok(routing.includes("mx-auto"), "globe container is not centered");
  assert.ok(routing.includes("panel relative mt-3 overflow-hidden p-4 md:p-6"), "card styling differs from ALUR");
});

test("label dan keterangan kartu ada", () => {
  assert.ok(/Global Network|EDGE ROUTE/.test(routing), "card header tag missing");
  assert.ok(/Distribusi node dan edge serverless/i.test(routing), "card caption missing");
});

test("globe digambar sebagai canvas 2D, bukan three.js", () => {
  assert.ok(globe.startsWith('"use client"'), "TechGlobe must be a client component");
  assert.ok(globe.includes('getContext("2d")'), "globe is not a 2D canvas");
  assert.ok(!/from\s+["']three["']/.test(globe), "globe imports three");
  assert.ok(!pkg.dependencies.three, "three was added as a dependency");
  assert.ok(!pkg.dependencies.cobe, "cobe was added as a dependency");
});

test("bola titik daratan: peta 72x36 dan proyeksi ortografis", () => {
  const rows = land.match(/^\s{2}"[.#]+",$/gm) || [];
  assert.equal(rows.length, 36, `expected 36 mask rows, found ${rows.length}`);
  for (const row of rows) {
    assert.equal(row.trim().replace(/[",]/g, "").length, 72, "mask row is not 72 cells");
  }
  const cells = rows.join("").split("").filter((c) => c === "#").length;
  assert.ok(cells > 500 && cells < 1500, `land cells ${cells} outside a sane range`);

  assert.ok(globe.includes('71, 85, 105'), "slate #475569 land dots missing");
  assert.ok(/z\\?2? > 0|p\\[2\\]/.test(globe), "no depth test on the projection");
  assert.ok(globe.includes("Math.cos(yaw)"), "no rotation applied");
});

test("empat busur orbital emerald/lime dengan titik pijar", () => {
  const arcs = (globe.match(/\{ from: \[[^\]]+\], to: \[[^\]]+\], color:/g) || []).length;
  assert.ok(arcs >= 3 && arcs <= 4, `expected 3-4 arcs, found ${arcs}`);
  assert.ok(globe.includes('16, 185, 129'), "emerald #10b981 missing");
  assert.ok(globe.includes('163, 230, 53'), "cyber lime #a3e635 missing");
  assert.ok(globe.includes("slerp"), "arcs are not great-circle segments");
  assert.ok(globe.includes("createRadialGradient"), "no glowing spark on the arc");
});

test("glow tepi bola sekitar 20%", () => {
  const glow = globe.match(new RegExp(`rgba\\(\\$\\{EMERALD\\}, 0\\.(\\d+)\\)`));
  assert.ok(glow, "no emerald glow stop");
  const values = [...globe.matchAll(/rgba\(\$\{EMERALD\}, 0\.(\d+)\)/g)].map((m) => Number(`0.${m[1]}`));
  assert.ok(values.some((v) => v >= 0.18 && v <= 0.25), `glow ${values.join(", ")} is not ~20%`);
});

test("interaktif: drag, auto-rotate, dan hemat daya", () => {
  assert.ok(globe.includes('addEventListener("pointerdown"'), "no drag handling");
  assert.ok(globe.includes('addEventListener("pointermove"'), "drag does not rotate");
  assert.ok(globe.includes("touch-pan-y"), "vertical page scroll would be blocked on mobile");
  assert.ok(/yaw \+= dt \* /.test(globe), "no auto-rotate");

  assert.ok(globe.includes("prefers-reduced-motion"), "globe ignores reduced motion");
  assert.ok(globe.includes("IntersectionObserver"), "globe keeps rendering offscreen");
  assert.ok(globe.includes("visibilitychange"), "globe keeps rendering in a hidden tab");
  assert.ok(globe.includes("ResizeObserver"), "canvas does not follow its container size");

  assert.ok(mount.startsWith('"use client"'), "mount wrapper must be a client component");
  assert.ok(/dynamic\(/.test(mount), "mount does not use next/dynamic");
  assert.ok(/ssr:\s*false/.test(mount), "dynamic import must disable SSR");
});
