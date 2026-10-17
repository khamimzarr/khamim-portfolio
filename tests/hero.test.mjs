import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync("src/app/page.tsx", "utf8");

test("hero memakai panggung gelap dan wordmark clamp baru", () => {
  assert.ok(src.includes("clamp(40px, 14vw, 168px)"), "wordmark clamp missing");
  assert.ok(src.includes('id="karya"'), "karya anchor missing");
});

test("hero punya satu aksi accent dan satu outline", () => {
  assert.ok(src.includes("bg-[#0071e3]"), "apple blue action missing");
  assert.ok(/mailto:khamimzarrr@gmail\.com/.test(src), "mailto action missing");
  assert.ok(!/Buy|From \$|Trade in/.test(src), "commerce vocabulary present");
});
