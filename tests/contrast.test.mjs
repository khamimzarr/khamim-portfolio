import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8");

function token(name) {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `missing --color-${name}`);
  return match[1];
}

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function ratio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

test("pasangan teks yang dipakai lolos WCAG AA (4.5:1)", () => {
  const pairs = [
    ["porcelain", "gallery-black"],
    ["steel", "gallery-black"],
    ["ink", "paper"],
    ["graphite", "paper"],
    ["paper", "apple-blue"],
    ["link-blue", "paper"],
  ];
  for (const [fg, bg] of pairs) {
    const r = ratio(token(fg), token(bg));
    assert.ok(r >= 4.5, `${fg} on ${bg} = ${r.toFixed(2)}, below 4.5`);
  }
});

test("steel di permukaan terang gagal, jadi dilarang di sana", () => {
  assert.ok(ratio(token("steel"), token("paper")) < 4.5, "steel on paper unexpectedly passes");
});
