import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");
const path = "src/components/MeshBackdrop.tsx";

test("komponen mesh ada dan dipakai di card alur", () => {
  assert.ok(existsSync(path), "MeshBackdrop.tsx missing");
  assert.ok(page.includes("MeshBackdrop"), "page does not use MeshBackdrop");
});

test("mesh punya node dan edge, bukan gambar", () => {
  const src = readFileSync(path, "utf8");
  const nodes = (src.slice(src.indexOf("const NODES"), src.indexOf("];", src.indexOf("const NODES"))).match(/\[\d+,\s*\d+\]/g) || []).length;
  const edges = (src.slice(src.indexOf("const EDGES"), src.indexOf("];", src.indexOf("const EDGES"))).match(/\[\d+,\s*\d+\]/g) || []).length;
  assert.ok(nodes >= 12, `expected a node mesh, found ${nodes} nodes`);
  assert.ok(edges >= 12, `expected edges, found ${edges} edges`);
  assert.ok(src.includes("<svg"), "mesh should be inline svg");
  assert.ok(!src.includes("<img"), "mesh should not be an image");
});

test("mesh bergerak cukup cepat, tidak beku", () => {
  const drift = css.match(/animation:\s*mesh-drift\s+(\d+(?:\.\d+)?)s/);
  const breathe = css.match(/animation:\s*mesh-breathe\s+(\d+(?:\.\d+)?)s/);
  assert.ok(drift, "mesh-drift duration missing");
  assert.ok(breathe, "mesh-breathe duration missing");
  assert.ok(Number(drift[1]) <= 16, `mesh drift too slow: ${drift[1]}s`);
  assert.ok(Number(breathe[1]) <= 8, `mesh breathe too slow: ${breathe[1]}s`);
});

test("mesh bergerak pelan dan hormat pada reduced motion", () => {
  assert.ok(css.includes(".mesh-drift"), "mesh-drift class missing");
  assert.ok(/@keyframes\s+mesh-drift/.test(css), "mesh-drift keyframes missing");
  const reduce = css.slice(css.indexOf("prefers-reduced-motion"));
  assert.ok(/mesh-drift/.test(reduce), "reduced motion does not stop the mesh");
});
