import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync("src/app/page.tsx", "utf8");

test("empat project dengan tautan nyata", () => {
  for (const name of ["hr-ai-review", "ruang-resepsi", "structur-md", "dropdeploy"]) {
    assert.ok(src.includes(name), `project missing: ${name}`);
  }
  assert.ok(src.includes("https://github.com/khamimzarr/hr-ai-review"), "github link missing");
  assert.ok(src.includes("https://dropdeploy.my.id"), "live link missing");
});

test("kartu karya memakai media-card dan tanpa screenshot", () => {
  assert.ok(src.includes("media-card"), "media-card class missing");
  assert.ok(!src.includes("<img"), "raw img / fake screenshot present");
});

test("ada anchor exhibition", () => {
  assert.ok(src.includes('id="exhibition"'), "exhibition anchor missing");
});
