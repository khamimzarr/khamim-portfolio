import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync("src/app/layout.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");

test("Geist dan Geist Mono yang dimuat", () => {
  assert.ok(/Geist_Mono/.test(src), "Geist Mono missing");
  assert.ok(/\bGeist\b/.test(src), "Geist missing");
  assert.ok(!/Inter/.test(src), "Inter still loaded");
  assert.ok(!/Playfair/i.test(src), "Playfair still loaded");
  assert.ok(/--font-geist-sans/.test(src) && /--font-geist-mono/.test(src), "next/font variables missing");
});

test("tailwind font-sans dan font-mono diikat ke variabel next/font", () => {
  assert.ok(css.includes("--font-sans: var(--font-geist-sans)"), "font-sans not bound to Geist");
  assert.ok(css.includes("--font-mono: var(--font-geist-mono)"), "font-mono not bound to Geist Mono");
});

test("body memakai kanvas CleveCode", () => {
  assert.ok(/080808/.test(src), "body surface is not the CleveCode canvas");
});
