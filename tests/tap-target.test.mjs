import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const header = readFileSync("src/components/Header.tsx", "utf8");

test("CTA hero punya tinggi sentuh minimal 44px", () => {
  const hits = page.match(/min-h-\[44px\]/g) || [];
  assert.ok(hits.length >= 2, `expected two 44px CTAs, found ${hits.length}`);
});

test("tombol menu mobile 44x44", () => {
  assert.ok(header.includes("w-11 h-11"), "hamburger is not 44x44");
});

test("item menu mobile punya tinggi sentuh cukup", () => {
  assert.ok(header.includes("py-3.5"), "mobile menu rows are too short");
});

test("wordmark hero tidak melebihi container 1120px", () => {
  const match = page.match(/clamp\((\d+)px,\s*([\d.]+)vw,\s*(\d+)px\)/);
  assert.ok(match, "wordmark clamp missing");
  const max = Number(match[3]);
  assert.ok(max <= 180, `wordmark max ${max}px can overflow the 1120px container`);
});
