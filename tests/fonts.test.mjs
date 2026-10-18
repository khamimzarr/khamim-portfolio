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

test("Space Grotesk dimuat untuk judul, dengan bobot terbatas", () => {
  assert.ok(/Space_Grotesk/.test(src), "Space Grotesk missing");
  assert.ok(/--font-space-grotesk/.test(src), "variabel Space Grotesk missing");
  const block = src.slice(src.indexOf("Space_Grotesk({"), src.indexOf("});", src.indexOf("Space_Grotesk({")));
  assert.ok(/weight:\s*\["500",\s*"600"\]/.test(block), "bobot Space Grotesk bukan 500/600");
  assert.ok(/display:\s*"swap"/.test(block), "Space Grotesk tidak pakai font-display swap");
});

test("tiga peran font terikat jelas: display, sans, mono", () => {
  assert.ok(css.includes("--font-display: var(--font-space-grotesk)"), "font-display tidak diikat ke Space Grotesk");
  assert.ok(/\.display\s*\{[^}]*font-family:\s*var\(--font-display\)/.test(css), "kelas .display tidak memakai font-display");
  // Judul section dan judul project wajib kelas .display; body tetap font-sans bawaan body.
  const page = readFileSync("src/app/page.tsx", "utf8");
  assert.ok(/<h2 className="display/.test(page), "judul section belum memakai .display");
  assert.ok(/<h3 className="display/.test(page), "judul project belum memakai .display");
  const terminal = readFileSync("src/components/Terminal.tsx", "utf8");
  assert.ok(/className="terminal-live mono/.test(terminal), "terminal tidak lagi monospace");
});

test("tailwind font-sans dan font-mono diikat ke variabel next/font", () => {
  assert.ok(css.includes("--font-sans: var(--font-geist-sans)"), "font-sans not bound to Geist");
  assert.ok(css.includes("--font-mono: var(--font-geist-mono)"), "font-mono not bound to Geist Mono");
});

test("body memakai kanvas CleveCode", () => {
  assert.ok(/080808/.test(src), "body surface is not the CleveCode canvas");
});
