import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const HTML = ".next/server/app/index.html";
if (!existsSync(HTML)) {
  throw new Error(`Run 'npm run build' first — ${HTML} not found.`);
}
const html = readFileSync(HTML, "utf8");

test("all seven owner photos survive the re-skin", () => {
  for (const f of ["foto-random","bersepeda","tanaman","ikan","coding","ngopi","foto-bunga"]) {
    assert.ok(html.includes(`/hobi/${f}.jpg`), `missing /hobi/${f}.jpg`);
  }
});

test("the six mono file labels render", () => {
  for (const l of ["foto-random.jpg","ride-pagi.sh","tanaman.care","aquarium.md","coding.vibes","ngopi-project.log"]) {
    assert.ok(html.includes(l), `missing label ${l}`);
  }
});

test("all four karya cards survive", () => {
  for (const p of ["hr-ai-review","ruang-resepsi","structur-md","dropdeploy"]) {
    assert.ok(html.includes(p), `missing project ${p}`);
  }
});
