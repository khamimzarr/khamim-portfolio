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

test("globe terpasang sekali di section 03, di bawah kartu ALUR", () => {
  assert.ok(existsSync(globePath), "Globe.tsx missing");
  assert.ok(existsSync(mountPath), "GlobeMount.tsx missing");
  assert.equal((page.match(/<GlobeMount\b/g) || []).length, 1, "globe should mount once");

  assert.ok(routing.includes("<GlobeMount"), "globe is not inside #routing");
  const alur = routing.indexOf("RoutingDiagram");
  const card = routing.indexOf("<GlobeMount");
  assert.ok(alur > -1 && card > alur, "globe card is not below the ALUR card");

  // Wadah globe proporsional: sisi 380px, dipotong rapi.
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

test("globe memakai three + three-globe, dimuat dinamis tanpa SSR", () => {
  // Owner memilih rute library (Aceternity / GitHub Globe) supaya geografi
  // dan lengkung busurnya akurat, jadi guard "zero-dependency" di repo ini
  // diganti. Yang dikunci sekarang: three HANYA dipakai globe, dan globe
  // selalu di-lazy-load supaya tidak menambah bundle awal.
  assert.ok(globe.startsWith('"use client"'), "Globe must be a client component");
  assert.ok(/from\s+["']three-globe["']/.test(globe), "globe does not use three-globe");
  assert.ok(/from\s+["']three["']/.test(globe), "globe does not use three");

  assert.ok(pkg.dependencies.three, "three dependency missing");
  assert.ok(pkg.dependencies["three-globe"], "three-globe dependency missing");
  assert.ok(pkg.devDependencies["@types/three"], "@types/three missing");

  // Mount wrapper: dynamic import + ssr:false, jadi tidak dirender di server.
  assert.ok(mount.startsWith('"use client"'), "mount wrapper must be a client component");
  assert.ok(/dynamic\(/.test(mount), "mount does not use next/dynamic");
  assert.ok(/ssr:\s*false/.test(mount), "dynamic import must disable SSR");

  // WebGL lewat WebGLRenderer three, bukan konteks mentah.
  assert.ok(/new\s+WebGLRenderer\(/.test(globe), "globe does not create a three renderer");
  assert.ok(/new\s+PerspectiveCamera\(/.test(globe), "globe has no perspective camera");
  assert.ok(/globeCurvatureResolution/.test(globe), "sphere geometry is not driven by three-globe");
});

test("bola bulat utuh: three-globe + atmosphere, bukan shader tangan", () => {
  // Sisa implementasi lama harus benar-benar pergi, supaya tidak ada dua
  // jalur render yang saling bersaing.
  assert.ok(!globe.includes("gl_PointSize"), "old point-sprite shader still present");
  assert.ok(!globe.includes("aTangent"), "old arc ribbon shader still present");
  assert.ok(!globe.includes("zFront"), "old sphere occlusion hack still present");
  assert.ok(!globe.includes('getContext("webgl"'), "globe still grabs a raw WebGL context");
  assert.ok(!globe.includes('getContext("2d")'), "globe still renders with Canvas 2D");

  // Rim light / atmosphere tipis di tepi siluet: ini yang bikin bentuk
  // bulat 3D-nya padat tanpa kabut hijau di latar kartu.
  assert.ok(globe.includes("showAtmosphere(true)"), "no atmosphere rim light");
  assert.ok(/atmosphereColor\(\s*EMERALD\s*\)/.test(globe), "atmosphere is not emerald");
  assert.ok(/atmosphereAltitude\(/.test(globe), "atmosphere has no altitude");

  // Bola harus terisi cahaya; tanpa light MeshPhongMaterial jadi hitam rata.
  assert.ok(/new\s+AmbientLight\(/.test(globe), "no ambient light");
  assert.ok(/new\s+DirectionalLight\(/.test(globe), "no directional light");

  // Kamera dihitung dari FOV, jadi ukuran globe mengikuti kartu.
  assert.ok(globe.includes("fillRatio"), "camera distance is not derived from a fill ratio");
  assert.ok(/camera\.position\.set\(0, 0, distance\)/.test(globe), "camera does not sit on the +Z axis");
});

test("daratan dari Natural Earth, bukan kisi heksagon", () => {
  // Data titik disimpan sebagai base64 + varint, jadi tes ini men-decode
  // sendiri untuk membuktikan isinya benar-benar geografi, bukan angka hiasan.
  const body = land.slice(land.indexOf("const DOTS_B64 ="), land.indexOf("const LAT_STEPS"));
  // Data disimpan sebagai satu template literal berspasi; spasi diabaikan
  // decoder, jadi cukup ambil isi di antara backtick.
  const b64 = body.slice(body.indexOf("`") + 1, body.lastIndexOf("`")).replace(/\s/g, "");

  const table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const bytes = [];
  let acc = 0;
  let bits = 0;
  for (const ch of b64) {
    const v = table.indexOf(ch);
    if (v < 0) continue;
    acc = (acc << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((acc >> bits) & 0xff);
    }
  }

  const LON_SPAN = 1441;
  const LAT_STEPS = 4;
  const dots = [];
  let prev = 0;
  let value = 0;
  let shift = 0;
  for (const byte of bytes) {
    value |= (byte & 0x7f) << shift;
    if (byte & 0x80) {
      shift += 7;
      continue;
    }
    shift = 0;
    const delta = value & 1 ? -((value + 1) >>> 1) : value >>> 1;
    value = 0;
    prev += delta;
    const latIndex = Math.floor(prev / LON_SPAN);
    const lonIndex = prev - latIndex * LON_SPAN;
    dots.push([latIndex / LAT_STEPS - 90, lonIndex / LAT_STEPS - 180]);
  }

  assert.ok(dots.length > 5000, `only ${dots.length} land dots, continents would read as blobs`);
  assert.ok(dots.length < 9000, `${dots.length} land dots is dense enough to read as mesh, not a map`);

  const lats = dots.map(([lat]) => lat);
  const lons = dots.map(([, lon]) => lon);
  assert.ok(Math.min(...lats) <= -70 && Math.max(...lats) >= 70, "latitudes do not reach the poles");
  assert.ok(Math.min(...lons) <= -170 && Math.max(...lons) >= 170, "longitudes do not wrap the planet");

  // Bentuk benua: ada daratan di sekitar Jakarta, tidak ada di tengah Pasifik.
  const near = (lat, lon, d) => dots.some(([a, b]) => Math.abs(a - lat) < d && Math.abs(b - lon) < d);
  assert.ok(near(-6.2, 106.8, 3), "no land dots near Jakarta, the map is not real geography");
  assert.ok(near(48.8, 2.3, 3), "no land dots near Europe");
  assert.ok(!near(-10, -140, 4), "land dots in the middle of the Pacific");

  // Globe membaca data itu dan mencampurnya sebagai satu mesh titik.
  assert.ok(globe.includes("decodeLandDots"), "globe does not read the land data");
  assert.ok(globe.includes(".pointsMerge(true)"), "land dots are not merged into one mesh");
  assert.ok(/\.pointAltitude\(/.test(globe), "land dots have no altitude");
  assert.ok(/\.pointRadius\(/.test(globe), "land dots have no radius");
  // Palet slate redup #64748b - #94a3b8.
  assert.ok(globe.includes('"#94a3b8"'), "slate #94a3b8 missing");
  assert.ok(globe.includes('"#64748b"'), "slate #64748b missing");
});

test("busur melayang 3D (Bézier tube), bukan lingkaran radar datar", () => {
  const arcs = (globe.match(/\{ startLat: [-\d.]+, startLng: [-\d.]+, endLat: [-\d.]+, endLng: [-\d.]+ \}/g) || []).length;
  assert.ok(arcs >= 2 && arcs <= 3, `expected 2-3 orbital arcs, found ${arcs}`);

  // arcStroke != null membuat three-globe memakai TubeGeometry di atas
  // CubicBezierCurve3; kalau null, dia jatuh ke busur great-circle datar.
  assert.ok(/\.arcStroke\(\d/.test(globe), "arcs are not drawn as tubes (flat great-circle instead)");
  // arcAltitude eksplisit > 0: inilah yang mengangkat busur ke atas bola.
  const alt = globe.match(/\.arcAltitude\(([\d.]+)\)/);
  assert.ok(alt, "arcs have no explicit altitude");
  assert.ok(Number(alt[1]) > 0.15, `arc altitude ${alt[1]} is too low to read as floating`);
  assert.ok(globe.includes(".arcAltitudeAutoScale(0)"), "arc altitude is auto-scaled per arc");
  assert.ok(/\.arcCurveResolution\(\d+\)/.test(globe), "arcs have no curve resolution");

  // Emerald -> cyber lime, putus-putus yang bergerak.
  assert.ok(globe.includes('"#10b981"'), "emerald #10b981 missing");
  assert.ok(globe.includes('"#a3e635"'), "cyber lime #a3e635 missing");
  assert.ok(/\.arcDashAnimateTime\(\d+\)/.test(globe), "arc dashes are not animated");

  // Tidak ada lagi lingkaran radar / outline bola.
  assert.ok(!/arc\(cx, cy, r/.test(globe), "globe draws a hard circle outline");
  assert.ok(!globe.includes("createRadialGradient"), "globe still paints a canvas-2D glow ring");
  assert.ok(!globe.includes("ctx."), "globe still uses a 2D context");
});

test("marker: satu titik denyut di Indonesia, bukan target bidik konsentris", () => {
  const marker = globe.match(/const MARKER = \{ lat: (-?[\d.]+), lng: (-?[\d.]+) \}/);
  assert.ok(marker, "no marker constant");
  assert.ok(Math.abs(Number(marker[1]) - -2) < 3, "marker latitude is not Indonesia");
  assert.ok(Math.abs(Number(marker[2]) - 118) < 6, "marker longitude is not Indonesia");

  // Gelombang denyut yang merambat di permukaan bola.
  assert.ok(/\.ringsData\(/.test(globe), "no pulse ring layer");
  assert.ok(/\.ringRepeatPeriod\(\d+\)/.test(globe), "pulse ring does not repeat");
  assert.ok(/\.ringPropagationSpeed\(/.test(globe), "pulse ring does not propagate");
  assert.ok(/\.ringMaxRadius\(/.test(globe), "pulse ring has no max radius");
  assert.ok(/\.ringColor\(/.test(globe), "pulse ring has no color");
  // Titik inti marker ikut di layer points, ditandai flag marker.
  assert.ok(globe.includes("marker: true"), "marker has no core dot in the points layer");
  assert.ok(/pointColor\(/.test(globe), "points have no color accessor");
});

test("interaktif: drag, auto-rotate, dan hemat daya", () => {
  assert.ok(globe.includes('addEventListener("pointerdown"'), "no drag handling");
  assert.ok(globe.includes('addEventListener("pointermove"'), "drag does not rotate");
  assert.ok(globe.includes("touchAction"), "vertical page scroll would be blocked on mobile");
  assert.ok(/targetYaw \+= dt \* /.test(globe), "no auto-rotate");

  assert.ok(globe.includes("prefers-reduced-motion"), "globe ignores reduced motion");
  assert.ok(globe.includes("IntersectionObserver"), "globe keeps rendering offscreen");
  assert.ok(globe.includes("visibilitychange"), "globe keeps rendering in a hidden tab");
  assert.ok(globe.includes("ResizeObserver"), "canvas does not follow its container size");
  assert.ok(/renderer\.dispose\(\)/.test(globe), "renderer is never disposed");
});

test("tanpa kabut hijau ambient di latar kartu", () => {
  assert.ok(!/\.globe-glow/.test(css), "globe-glow CSS block is still there");
  assert.ok(!/globe-glow/.test(page), "page still applies the globe-glow class");
  assert.ok(
    !/radial-gradient\([^)]*16,\s*185,\s*129/.test(css),
    "a green radial halo is still painted behind the globe",
  );
  assert.ok(!/rgba\(16,\s*185,\s*129/.test(css), "a green glow is still defined in CSS");
});

test("globe Canvas 2D dan shader tangan yang lama sudah pensiun", () => {
  assert.ok(!existsSync("src/components/TechGlobe.tsx"), "TechGlobe.tsx still present");
  assert.ok(!existsSync("src/components/TechGlobeMount.tsx"), "TechGlobeMount.tsx still present");
  assert.ok(!page.includes("TechGlobe"), "page still imports TechGlobe");
});
