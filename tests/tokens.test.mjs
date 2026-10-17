import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8").toLowerCase();

const COLORS = {
  canvas: "#080808",
  surface: "#0e0e10",
  raised: "#141417",
  line: "#1e1e22",
  "line-strong": "#2a2a30",
  text: "#c0c0c8",
  bright: "#e8e8ee",
  dim: "#8a8a94",
  accent: "#b8f050",
  "accent-ink": "#08080a",
};

const RADII = {
  cards: "4px",
  buttons: "4px",
  badges: "3px",
  inputs: "3px",
};

test("token warna CleveCode ada dengan nilai persis", () => {
  for (const [name, value] of Object.entries(COLORS)) {
    assert.ok(css.includes(`--color-${name}: ${value}`), `missing --color-${name}`);
  }
});

test("token radius CleveCode ada dengan nilai persis", () => {
  for (const [name, value] of Object.entries(RADII)) {
    assert.ok(css.includes(`--radius-${name}: ${value}`), `missing --radius-${name}`);
  }
});

test("token design lama sudah hilang", () => {
  const legacy = ["#f5f5f7", "#0071e3", "#0066cc", "#86868b", "#6e6e73", "#e8e8ed", "playfair", "davinci", "putty", "renaissance"];
  for (const token of legacy) {
    assert.ok(!css.includes(token), `legacy token still present: ${token}`);
  }
});
