import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8").toLowerCase();

const COLORS = {
  "gallery-black": "#000000",
  "charcoal-stage": "#111111",
  ink: "#1d1d1f",
  porcelain: "#f5f5f7",
  paper: "#ffffff",
  steel: "#86868b",
  graphite: "#6e6e73",
  "control-charcoal": "#333336",
  "cloud-gray": "#e8e8ed",
  "apple-blue": "#0071e3",
  "link-blue": "#0066cc",
};

const RADII = {
  cards: "28px",
  links: "10px",
  badges: "5px",
  inputs: "980px",
  buttons: "9999px",
  utilitycontrols: "36px",
};

test("token warna baru ada dengan nilai persis", () => {
  for (const [name, value] of Object.entries(COLORS)) {
    assert.ok(css.includes(`--color-${name}: ${value}`), `missing --color-${name}`);
  }
});

test("token radius baru ada dengan nilai persis", () => {
  for (const [name, value] of Object.entries(RADII)) {
    assert.ok(css.includes(`--radius-${name}: ${value}`), `missing --radius-${name}`);
  }
});

test("token legacy sudah hilang", () => {
  const legacy = [
    "#c4c3b6",
    "#e7e5e4",
    "#dfdcd5",
    "#595855",
    "--font-davinci",
    "playfair",
    "texture-putty",
    "notched-card",
    "wordmark-carve",
    "#ff3037",
    "#00d959",
  ];
  for (const token of legacy) {
    assert.ok(!css.includes(token), `legacy token still present: ${token}`);
  }
});
