import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const wavePath = "src/components/ParticleWave.tsx";
const mountPath = "src/components/ParticleWaveMount.tsx";
const wave = existsSync(wavePath) ? readFileSync(wavePath, "utf8") : "";
const mount = existsSync(mountPath) ? readFileSync(mountPath, "utf8") : "";

test("komponen particle wave ada dan dipakai di panel hero", () => {
  assert.ok(existsSync(wavePath), "ParticleWave.tsx missing");
  assert.ok(existsSync(mountPath), "ParticleWaveMount.tsx missing");
  assert.ok(page.includes("ParticleWaveMount"), "page does not mount the wave");
  assert.equal((page.match(/<ParticleWaveMount\b/g) || []).length, 1, "wave should mount once");

  const hero = page.slice(page.indexOf('id="top"'), page.indexOf('id="terminal"'));
  assert.ok(hero.includes("<ParticleWaveMount"), "wave is not inside the hero section");
  assert.ok(hero.includes("relative isolate"), "hero panel is not an isolated stacking context");
  assert.ok(hero.includes("-z-10"), "wave layer is not behind the panel content");
});

test("wave tetap canvas WebGL murni tanpa three.js", () => {
  assert.ok(wave.startsWith('"use client"'), "ParticleWave must be a client component");
  assert.ok(wave.includes('getContext("webgl"'), "wave does not request a WebGL context");
  assert.ok(wave.includes("gl_PointSize"), "wave does not draw point sprites");
  assert.ok(!/from\s+["']three["']/.test(wave), "wave imports three");
  // three boleh ada di package.json (dipakai globe), tapi wave harus tetap
  // shader tangan sendiri: dua WebGL context per halaman, bukan tiga.
  assert.ok(!wave.includes("WebGLRenderer"), "wave uses three's renderer instead of raw WebGL");
  assert.ok(!wave.includes("<img"), "wave should not be an image");
});

test("jumlah partikel 1.500 - 2.500 titik", () => {
  const cols = wave.match(/const COLS = (\d+)/);
  const rows = wave.match(/const ROWS = (\d+)/);
  assert.ok(cols, "COLS constant missing");
  assert.ok(rows, "ROWS constant missing");
  const total = Number(cols[1]) * Number(rows[1]);
  assert.ok(total >= 1500, `only ${total} particles, below 1500`);
  assert.ok(total <= 2500, `${total} particles, above 2500`);
});

test("gelombang memakai sinus, bukan animasi acak", () => {
  assert.ok(/sin\(/.test(wave), "no sine wave in the vertex shader");
  assert.ok(wave.includes("uTime"), "wave has no time uniform");
  assert.ok(wave.includes("requestAnimationFrame"), "wave never animates");
});

test("layer dekoratif: aria-hidden, pointer-events-none, dan di-mask radial", () => {
  assert.ok(/pointer-events-none/.test(wave), "wave must not catch taps or selections");
  assert.ok(/aria-hidden/.test(wave), "wave must be hidden from screen readers");
  assert.ok(/\.wave-layer\s*\{/.test(css), "wave-layer class missing");
  const block = css.slice(css.indexOf(".wave-layer"), css.indexOf("}", css.indexOf(".wave-layer")));
  assert.ok(block.includes("radial-gradient"), "no radial fade mask on the wave");
  assert.ok(block.includes("mask-image"), "mask-image not applied");
});

test("warna tema terminal: sky blue, cyan, emerald", () => {
  assert.ok(wave.includes("0.518, 0.780"), "sky blue #0284c7 missing");
  assert.ok(wave.includes("0.714, 0.831"), "cyan #06b6d4 missing");
  assert.ok(wave.includes("0.725, 0.506"), "emerald #10b981 missing");
});

test("aman untuk hidrasi, reduced motion, dan tab tersembunyi", () => {
  assert.ok(mount.startsWith('"use client"'), "mount wrapper must be a client component");
  assert.ok(/dynamic\(/.test(mount), "mount does not use next/dynamic");
  assert.ok(/ssr:\s*false/.test(mount), "dynamic import must disable SSR");
  assert.ok(wave.includes("prefers-reduced-motion"), "wave ignores reduced motion");
  assert.ok(wave.includes("visibilitychange"), "wave keeps rendering in a hidden tab");
  assert.ok(wave.includes("IntersectionObserver"), "wave keeps rendering offscreen");
});
