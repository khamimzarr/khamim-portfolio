import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");

test("page memasang satu layer dot-grid", () => {
  const hits = page.match(/className="dot-grid"/g) || [];
  assert.equal(hits.length, 1, `expected exactly one dot-grid layer, found ${hits.length}`);
  assert.ok(/dot-grid" aria-hidden/.test(page), "dot-grid should be aria-hidden");
});

test("dot-grid adalah pola statis, bukan gambar dan bukan animasi", () => {
  const block = css.slice(css.indexOf(".dot-grid"), css.indexOf("}", css.indexOf(".dot-grid")));
  assert.ok(block.includes("radial-gradient"), "dot-grid should be a radial-gradient pattern");
  assert.ok(block.includes("position: absolute"), "dot-grid must be an absolute layer");
  assert.ok(block.includes("pointer-events: none"), "dot-grid must not catch taps");
  assert.ok(!block.includes("animation"), "dot-grid should stay static");
});

test("konten utama duduk di atas dot-grid", () => {
  assert.ok(/<main[^>]*relative z-10/.test(page), "main is not layered above the dot-grid");
});
