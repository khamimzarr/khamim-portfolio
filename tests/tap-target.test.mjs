import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const sidebar = readFileSync("src/components/Sidebar.tsx", "utf8");

test("aksi utama punya tinggi sentuh minimal 44px", () => {
  const hits = page.match(/min-h-\[44px\]/g) || [];
  assert.ok(hits.length >= 2, `expected at least two 44px actions, found ${hits.length}`);
});

test("tombol menu mobile 44x44", () => {
  assert.ok(sidebar.includes("w-11 h-11"), "menu button is not 44x44");
});

test("baris nav sidebar punya tinggi sentuh cukup", () => {
  const css = readFileSync("src/app/globals.css", "utf8").replace(/\s+/g, " ");
  assert.ok(/\.nav-row\s*\{[^}]*min-height:\s*44px/.test(css), ".nav-row is shorter than 44px");
});

test("terminal punya fokus keyboard terlihat", () => {
  const terminal = readFileSync("src/components/Terminal.tsx", "utf8");
  assert.ok(/focus-visible|aria-label|tabIndex/.test(terminal), "terminal has no keyboard affordance");
});

test("tautan aksi di kartu karya tetap 44px tingginya", () => {
  const rows = page.slice(page.indexOf("projects.map"));
  // Dua aksi per kartu (Live Demo + GitHub) memakai kelas tombol yang sudah 44px.
  assert.equal((rows.match(/btn-accent|btn-ghost/g) || []).length, 2, "kedua tautan kartu harus memakai kelas tombol 44px");

  const css = readFileSync("src/app/globals.css", "utf8").replace(/\s+/g, " ");
  for (const cls of ["btn-accent", "btn-ghost"]) {
    assert.ok(new RegExp(`\\.${cls}\\s*\\{[^}]*min-height:\\s*44px`).test(css), `.${cls} di bawah 44px`);
    assert.ok(new RegExp(`\\.${cls}\\s*\\{[^}]*display:\\s*inline-flex`).test(css), `.${cls} bukan inline-flex`);
  }
  assert.ok(/\.link-action\s*\{[^}]*min-height:\s*44px/.test(css), ".link-action di bawah 44px");
});
