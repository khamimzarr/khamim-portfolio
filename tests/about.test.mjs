import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync("src/app/page.tsx", "utf8");

test("about memakai permukaan terang", () => {
  assert.ok(src.includes("bg-[#f5f5f7]") || src.includes("bg-[#ffffff]"), "light surface missing");
});

test("kontak nyata ada", () => {
  assert.ok(/mailto:khamimzarrr@gmail\.com/.test(src), "email missing");
  assert.ok(src.includes("github.com/khamimzarr"), "github missing");
  assert.ok(src.includes("instagram.com/bukann_bapakmu"), "instagram missing");
});

test("footer mempertahankan suara personal", () => {
  assert.ok(src.includes("Made with ngopi & vibes coding wkwk"), "personal footer line missing");
});
