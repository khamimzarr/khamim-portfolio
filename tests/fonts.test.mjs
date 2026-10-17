import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync("src/app/layout.tsx", "utf8");

test("hanya Inter yang dimuat", () => {
  assert.ok(/Inter/.test(src), "Inter missing");
  assert.ok(!/Playfair/i.test(src), "Playfair still loaded");
  assert.ok(!/--font-davinci/.test(src), "--font-davinci still declared");
  assert.ok(/--font-sans/.test(src), "--font-sans missing");
});

test("metadata tidak lagi menyebut design lama", () => {
  assert.ok(!/renaissance/i.test(src), "metadata still says Renaissance");
  assert.ok(!/putty/i.test(src), "metadata still says putty");
});

test("body memakai permukaan gallery black", () => {
  assert.ok(/000000/.test(src), "body surface is not gallery black");
});
