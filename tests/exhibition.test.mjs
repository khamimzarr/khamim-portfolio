import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync("src/app/page.tsx", "utf8");

test("enam foto asli dipakai", () => {
  for (const file of ["foto-random", "bersepeda", "tanaman", "ikan", "coding", "ngopi"]) {
    assert.ok(src.includes(`/hobi/${file}.jpg`), `photo missing: ${file}`);
  }
});

test("foto kotak, bukan lingkaran", () => {
  assert.ok(src.includes("aspect-square"), "square photo frame missing");
});

test("judul Latin dilepas", () => {
  for (const word of ["Fragmenta", "Iter Matutinum", "Cultura", "Cathedralis", "Calligraphia", "Amarum"]) {
    assert.ok(!src.includes(word), `latin subtitle still present: ${word}`);
  }
});
