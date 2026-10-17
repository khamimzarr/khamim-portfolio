import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// IHDR sits at offset 8 (sig) + 4 (length) + 4 ("IHDR"); colour type is byte 9 of its data.
function pngColorTypes(buf) {
  const types = [];
  let i = 0;
  while ((i = buf.indexOf(PNG_SIG, i)) !== -1) {
    types.push(buf[i + 25]);
    i += 8;
  }
  return types;
}

test("favicon.ico berisi frame PNG RGBA (color type 6)", () => {
  const types = pngColorTypes(readFileSync("src/app/favicon.ico"));
  assert.ok(types.length > 0, "no PNG frames inside the ico");
  for (const t of types) {
    assert.equal(t, 6, `ico PNG colour type ${t} is not RGBA`);
  }
});

test("icon.png dan apple-icon.png RGBA", () => {
  for (const file of ["src/app/icon.png", "src/app/apple-icon.png", "public/og/og-cover.png"]) {
    const types = pngColorTypes(readFileSync(file));
    assert.equal(types[0], 6, `${file} is not RGBA`);
  }
});
