import { test } from "node:test";
import assert from "node:assert/strict";
import { TOKEN_COLOR, type TokenKind } from "../src/lib/code-tokens.ts";

test("every TokenKind has a color", () => {
  const kinds: TokenKind[] = ["default","keyword","string","type","variable","property","comment"];
  for (const k of kinds) assert.match(TOKEN_COLOR[k], /^#[0-9a-f]{6}$/, `bad color for ${k}`);
});

test("token colors match the design spec exactly", () => {
  assert.equal(TOKEN_COLOR.keyword, "#9c9af2");
  assert.equal(TOKEN_COLOR.string, "#fa3abf");
  assert.equal(TOKEN_COLOR.type, "#afec73");
  assert.equal(TOKEN_COLOR.variable, "#d9f07c");
  assert.equal(TOKEN_COLOR.property, "#e888f8");
  assert.equal(TOKEN_COLOR.comment, "#878c99");
  assert.equal(TOKEN_COLOR.default, "#878c99");
});
