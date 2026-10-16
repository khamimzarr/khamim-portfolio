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

test("the Tawakal motto survives character-for-character", () => {
  assert.ok(html.includes("Menitipkan segala cemas dan rencana pada Sang Maha Perencana"));
  assert.ok(html.includes("puncak dari rasa percaya akan takdir yang lebih indah"));
});

test("the owner's signature lines are untouched", () => {
  assert.ok(html.includes("ngopi sambil ngobrol project"));
  assert.ok(html.includes("wkwk tapi serius"));
  // '&' is HTML-escaped by React — assert the escaped form, verified live.
  assert.ok(html.includes("Made with ngopi &amp; vibes coding wkwk"));
});

test("no Renaissance vocabulary remains on the page", () => {
  for (const w of ["Renaissance","putty","Putty","Davinci","Fragmenta Temporis","Iter Matutinum",
                   "Cultura Silens","Cathedralis Vitrea","Calligraphia Codex","Amarum Lucidum"]) {
    assert.ok(!html.includes(w), `legacy word still rendered: ${w}`);
  }
});
