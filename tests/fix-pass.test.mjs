import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const header = readFileSync("src/components/Header.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");

// --- C1: focus ring on the whole-card link must survive .media-card overflow:hidden
test("kartu karya punya focus ring yang tidak terpotong", () => {
  assert.ok(
    page.includes("outline-offset-[-6px]"),
    "card anchor has no inset focus ring, so overflow:hidden clips it",
  );
});

// --- C2: Link Blue on Charcoal is 3.39:1, so the dark card link must not use it
test("tautan github di kartu gelap tidak memakai Link Blue", () => {
  const cardLinks = page.match(/pointer-events-auto font-sans text-\[12px\][^"]*/g) || [];
  assert.ok(cardLinks.length > 0, "card github link not found");
  for (const cls of cardLinks) {
    assert.ok(!cls.includes("#0066cc"), `card link still Link Blue on Charcoal: ${cls}`);
  }
});

// --- I1: Graphite on Cloud Gray is 4.15:1, so the still-life caption must use Ink
test("caption still life tidak memakai Graphite di atas Cloud Gray", () => {
  const lines = page.split("\n");
  const i = lines.findIndex((line) => line.includes("Still life"));
  assert.ok(i > 0, "still life caption not found");
  const block = lines.slice(Math.max(0, i - 3), i + 1).join("\n");
  assert.ok(!block.includes("#6e6e73"), "caption still Graphite on Cloud Gray");
});

// --- I2: no colour may appear in src that the token layer does not define
test("semua warna di src ada di token globals.css", () => {
  const tokens = new Set((css.match(/#[0-9a-fA-F]{6}/g) || []).map((h) => h.toLowerCase()));
  for (const [file, src] of [["page.tsx", page], ["Header.tsx", header]]) {
    for (const hex of src.match(/#[0-9a-fA-F]{6}/g) || []) {
      assert.ok(tokens.has(hex.toLowerCase()), `${file} uses orphan colour ${hex}`);
    }
  }
});
