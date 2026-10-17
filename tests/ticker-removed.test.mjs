import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("komponen Ticker sudah dihapus", () => {
  assert.ok(!existsSync("src/components/Ticker.tsx"), "Ticker.tsx still exists");
});

test("page.tsx tidak mengimpor Ticker", () => {
  const page = readFileSync("src/app/page.tsx", "utf8");
  assert.ok(!page.includes("Ticker"), "page still references Ticker");
});
