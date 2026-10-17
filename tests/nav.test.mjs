import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const header = readFileSync("src/components/Header.tsx", "utf8");
const page = readFileSync("src/app/page.tsx", "utf8");

test("tidak ada href mati", () => {
  assert.ok(!/href="#"/.test(header), 'href="#" present');
});

test("setiap anchor nav punya section pasangannya", () => {
  const anchors = [...header.matchAll(/href[=:]\s*"(#[^"]+)"/g)].map((m) => m[1].slice(1));
  assert.ok(anchors.length > 0, "no anchor nav items found");
  for (const id of anchors) {
    assert.ok(page.includes(`id="${id}"`), `missing section for #${id}`);
  }
});

test("menu mobile bisa diakses keyboard", () => {
  assert.ok(header.includes("aria-expanded"), "aria-expanded missing");
  assert.ok(header.includes("Escape"), "Escape handler missing");
});
