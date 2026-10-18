import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8");
const layout = readFileSync("src/app/layout.tsx", "utf8");
const terminal = readFileSync("src/components/Terminal.tsx", "utf8");

test(".reveal tetap terbaca saat JavaScript mati", () => {
  // Tanpa JS tidak ada yang menambah .in-view, jadi opac-0 akan menyembunyikan panel selamanya.
  const block = css.slice(css.indexOf("@media (scripting: none)"), css.indexOf("}", css.indexOf("@media (scripting: none)")) + 1);
  assert.ok(block.includes(".reveal"), "scripting:none tidak mengembalikan .reveal");
  assert.ok(/opacity:\s*1/.test(block), "scripting:none tidak menset opacity 1");
});

test("layout membawa cadangan noscript untuk browser tanpa scripting media query", () => {
  assert.ok(/<noscript/.test(layout), "layout tidak punya <noscript>");
  assert.ok(/\.reveal\{opacity:1/.test(layout.replace(/\s+/g, "")), "noscript tidak menset .reveal terbaca");
});

test("terminal menampilkan transkrip utuh tanpa JavaScript", () => {
  assert.ok(/terminal-live/.test(terminal), "pre animasi tidak ditandai terminal-live");
  assert.ok(/<noscript/.test(terminal), "terminal tidak punya cadangan noscript");
  assert.ok(terminal.includes("NOSCRIPT_HTML"), "cadangan tidak memakai transkrip utuh");
  // Isi transkrip sekarang spesifikasi kerja, jadi yang dijaga adalah baris spec-nya.
  for (const field of ["OS / Host", "Stack", "Tools", "Focus", "Status"]) {
    assert.ok(terminal.includes(field), `transkrip kehilangan ${field}`);
  }
});
