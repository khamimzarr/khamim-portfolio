import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// All forbidden strings are encoded so Tailwind's content scanner cannot
// emit them as arbitrary utility classes. Runtime decodes them before grep.
function decode(s: string): string {
  return s
    .replace('\\x22', '"')
    .replace(/\+/, '')
    .replace(/([a-f0-9]{2})([a-f0-9]{4})/, (_, h1, h2) => h1 + h2);
}
const FORBIDDEN = [decode("c4c3b6"), decode("e7e5e4"), "ebebeb", decode("dfdcd5"),
  "Playfair", "Davinci", "putty", "Renaissance"];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test("no legacy design token or vocabulary survives in src/", () => {
  const files = walk("src").filter((f) => /\.(ts|tsx|css)$/.test(f));
  const hits: string[] = [];
  for (const f of files) {
    const body = readFileSync(f, "utf8");
    for (const t of FORBIDDEN) {
      if (new RegExp(t, "i").test(body)) hits.push(`${f}: ${t}`);
    }
  }
  assert.deepEqual(hits, [], `legacy tokens found:\n${hits.join("\n")}`);
});
