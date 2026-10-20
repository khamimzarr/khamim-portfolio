import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const globePath = "src/components/Globe.tsx";
const mountPath = "src/components/GlobeMount.tsx";
const landPath = "src/components/globe-land.ts";
const globe = existsSync(globePath) ? readFileSync(globePath, "utf8") : "";
const mount = existsSync(mountPath) ? readFileSync(mountPath, "utf8") : "";
const land = existsSync(landPath) ? readFileSync(landPath, "utf8") : "";

const routing = page.slice(page.indexOf('id="routing"'), page.indexOf('id="data"'));

test("globe WebGL terpasang sekali di section 03, di bawah kartu ALUR", () => {
  assert.ok(existsSync(globePath), "Globe.tsx missing");
  assert.ok(existsSync(mountPath), "GlobeMount.tsx missing");
  assert.equal((page.match(/<GlobeMount\b/g) || []).length, 1, "globe should mount once");

  assert.ok(routing.includes("<GlobeMount"), "globe is not inside #routing");
  const alur = routing.indexOf("RoutingDiagram");
  const card = routing.indexOf("<GlobeMount");
  assert.ok(alur > -1 && card > alur, "globe card is not below the ALUR card");

  // Wadah globe proporsional: sisi 360-400px, dipotong rapi.
  assert.ok(/aspect-square[^"]*max-w-\[380px\]/.test(routing), "globe container is not aspect-square max-w-[380px]");
  assert.ok(routing.includes("mx-auto"), "globe container is not centered");
  assert.ok(routing.includes("panel relative mt-3 overflow-hidden p-4 md:p-6"), "card styling differs from ALUR");
});

test("kartu punya header dan baris status terminal", () => {
  assert.ok(/Global Network|EDGE ROUTE/.test(routing), "card header tag missing");
  assert.ok(/Distribusi node dan edge serverless/i.test(routing), "card caption missing");
  assert.ok(
    /REGION: AP-SOUTHEAST\s*•\s*LATENCY: &lt;18MS • STATUS: ACTIVE/.test(routing),
    "status terminal di bawah globe hilang",
  );
});

test("globe digambar sebagai WebGL murni, tanpa three.js dan tanpa cobe", () => {
  assert.ok(globe.startsWith('"use client"'), "Globe must be a client component");
  assert.ok(globe.includes('getContext("webgl"'), "globe does not request a WebGL context");
  assert.ok(globe.includes("gl_PointSize"), "globe does not draw point sprites");
  // Busur digambar sebagai pita (TRIANGLES), bukan gl.LINES: garis WebGL
  // selalu 1 piksel device, jadi jadi hairline kalau globe diperbesar.
  assert.ok(globe.includes("gl.drawArrays(gl.TRIANGLES"), "orbit arcs are not drawn as ribbons");
  assert.ok(globe.includes("aSide"), "arc ribbon has no side attribute");
  assert.ok(globe.includes("aTangent"), "arc ribbon has no tangent attribute");
  assert.ok(globe.includes("uniform float uWidth"), "arc ribbon width is not adjustable");
  assert.ok(!globe.includes("gl.drawArrays(gl.LINES"), "arcs still use 1px device lines");
  assert.ok(!globe.includes('getContext("2d")'), "globe still renders with Canvas 2D");
  assert.ok(!/from\s+["']three["']/.test(globe), "globe imports three");
  assert.ok(!pkg.dependencies.three, "three was added as a dependency");
  assert.ok(!pkg.dependencies.cobe, "cobe was added as a dependency");
});

test("rotasi, cahaya, redup kedalaman, dan denyut dihitung di shader", () => {
  assert.ok(globe.includes("uniform float uYaw"), "no yaw uniform");
  assert.ok(globe.includes("uniform float uPitch"), "no pitch uniform");
  assert.ok(globe.includes("diffuse"), "no directional light, so the sphere reads flat");
  assert.ok(globe.includes("depthFade"), "no depth attenuation");
  // Depth attenuation: belakang lebih redup, tapi tidak hilang total.
  assert.ok(/smoothstep\(-0\.25, 0\.45, z2\)/.test(globe), "depth attenuation is not depth-bucketed");
  assert.ok(globe.includes("vPulse"), "no pulse varying for the active marker");
  assert.ok(globe.includes("sin(uTime * 3.2)"), "marker does not blink softly");
  assert.ok(globe.includes("uTime"), "shader has no time uniform");
});

test("tanpa outline lingkaran dan tanpa glow hijau di latar", () => {
  assert.ok(!/arc\(cx, cy, r/.test(globe), "globe draws a hard circle outline");
  assert.ok(!globe.includes("createRadialGradient"), "globe still paints a canvas-2D glow ring");
  assert.ok(!globe.includes("ctx."), "globe still uses the 2D context");

  // Tidak ada halo atmosfer di CSS: latar di sekitar bola harus menyatu
  // utuh dengan warna kartu, tanpa kabut hijau.
  assert.ok(!/\.globe-glow/.test(css), "globe-glow CSS block is still there");
  assert.ok(!/globe-glow/.test(page), "page still applies the globe-glow class");
  // Tidak boleh ada radial gradient hijau di stylesheet mana pun.
  assert.ok(
    !/radial-gradient\([^)]*16,\s*185,\s*129/.test(css),
    "a green radial halo is still painted behind the globe",
  );
  assert.ok(
    !/rgba\(16,\s*185,\s*129/.test(css),
    "a green glow is still defined in CSS",
  );
});

test("benua dari peta 144x72, warna slate, marker Indonesia, orbit emerald/lime", () => {
  const rows = land.match(/^\s{2}"[.#]+",$/gm) || [];
  assert.equal(rows.length, 72, `expected 72 mask rows, found ${rows.length}`);
  for (const row of rows) {
    assert.equal(row.trim().replace(/[",]/g, "").length, 144, "mask row is not 144 cells");
  }
  const cells = rows.join("").split("").filter((c) => c === "#").length;
  assert.ok(cells > 2000 && cells < 6000, `land cells ${cells} outside a sane range`);

  assert.ok(globe.includes("LAND_MASK"), "globe does not read the land mask");
  assert.ok(globe.includes("71 / 255, 85 / 255, 105 / 255"), "slate #475569 missing");
  assert.ok(globe.includes("203 / 255, 213 / 255, 225 / 255"), "slate #cbd5e1 missing");
  assert.ok(globe.includes("16 / 255, 185 / 255, 129 / 255"), "emerald #10b981 missing");
  assert.ok(globe.includes("163 / 255, 230 / 255, 53 / 255"), "cyber lime #a3e635 missing");

  assert.ok(/const INDONESIA = toVec\(-2, 118\)/.test(globe), "no marker at Indonesia");
  assert.ok(globe.includes("MARKER_VERT"), "no dedicated marker shader");
  const arcs = (globe.match(/\{ from: \[[^\]]+\], to: \[[^\]]+\] \}/g) || []).length;
  assert.ok(arcs >= 2 && arcs <= 3, `expected 2-3 orbital arcs, found ${arcs}`);
  assert.ok(globe.includes("ARC_STEPS"), "arcs have no sampling steps");
  // Busur menempel permukaan bola dan digambar putus-putus, jadi bagian
  // belakangnya disembunyikan oklusi dan tidak terbaca sebagai garis menusuk.
  assert.ok(/Math\.sin\(Math\.PI \* t\) \* 0\.02/.test(globe), "arcs do not hug the sphere");
  assert.ok(/if \(i % 3 === 2\) continue;/.test(globe), "arcs are not drawn as a dashed path");
  // Oklusi: busur yang menempel permukaan (z2 == zFront) harus tetap
  // terlihat, jadi ambangnya di bawah permukaan, bukan di atasnya.
  assert.ok(globe.includes("zFront"), "arcs are not occluded by the sphere");
  assert.ok(globe.includes("sqrt(max(0.0, 1.0 - r2))"), "no orthographic depth test for occlusion");
  assert.ok(
    /smoothstep\(zFront - 0\.14, zFront - 0\.02, z2\)/.test(globe),
    "occlusion threshold would hide arcs that sit on the surface",
  );
  // Baris kutub dilewati, jadi tidak ada cincin konsentris di bawah bola.
  assert.ok(/Math\.abs\(lat\) > 58/.test(globe), "polar rows are not skipped");
  // Tiap ujung rute punya node, jadi garis terbaca sebagai koneksi.
  assert.ok(globe.includes("ARC_NODES"), "route endpoints have no nodes");
  // Busur hanya terlihat di sabuk luar, jadi tidak pernah melintas di
  // tengah wajah bola.
  assert.ok(globe.includes("float limb = smoothstep(0.52, 0.86, r);"), "arcs still cross the sphere face");
  assert.ok(globe.includes("max(limb, outside)"), "arc band mask is not applied");
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

test("globe Canvas 2D yang lama sudah pensiun", () => {
  assert.ok(!existsSync("src/components/TechGlobe.tsx"), "TechGlobe.tsx still present");
  assert.ok(!existsSync("src/components/TechGlobeMount.tsx"), "TechGlobeMount.tsx still present");
  assert.ok(!page.includes("TechGlobe"), "page still imports TechGlobe");
});
