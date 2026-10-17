import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync("src/app/page.tsx", "utf8");

test("tidak ada acuan ke design lama", () => {
  const legacy = [
    "putty",
    "renaissance",
    "kertas museum",
    "playfair",
    "davinci",
    "In restraint we find grandeur",
    "Time does not preserve great work",
  ];
  const lower = src.toLowerCase();
  for (const token of legacy) {
    assert.ok(!lower.includes(token.toLowerCase()), `legacy copy still present: ${token}`);
  }
});

test("em dash hanya dipakai di kalimat personal yang disetujui owner", () => {
  const approved = ["ngopi sambil ngerjain project", "Pahit yang menyalakan ide"];
  for (const line of src.split("\n")) {
    if (!line.includes("\u2014")) continue;
    assert.ok(
      approved.some((sentence) => line.includes(sentence)),
      `em dash outside approved voice: ${line.trim()}`,
    );
  }
});

test("tidak ada buzzword", () => {
  const buzzwords = ["seamless", "revolutionary", "next generation", "ai powered"];
  const lower = src.toLowerCase();
  for (const word of buzzwords) {
    assert.ok(!lower.includes(word), `buzzword present: ${word}`);
  }
});
