import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sidebar = readFileSync("src/components/Sidebar.tsx", "utf8");
const page = readFileSync("src/app/page.tsx", "utf8");

test("tidak ada href mati", () => {
  assert.ok(!/href="#"/.test(sidebar), 'href="#" present');
});

test("setiap target nav punya section pasangannya", () => {
  const ids = [...sidebar.matchAll(/id:\s*"([a-z-]+)"/g)].map((m) => m[1]);
  assert.ok(ids.length >= 4, `expected at least 4 nav targets, found ${ids.length}`);
  for (const id of ids) {
    assert.ok(page.includes(`id="${id}"`), `missing section for #${id}`);
  }
});

test("menu mobile bisa diakses keyboard", () => {
  assert.ok(sidebar.includes("aria-expanded"), "aria-expanded missing");
  assert.ok(sidebar.includes("Escape"), "Escape handler missing");
});
