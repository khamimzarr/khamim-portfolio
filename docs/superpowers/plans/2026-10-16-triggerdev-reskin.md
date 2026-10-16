# Trigger.dev Re-skin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace khamim-portfolio's Renaissance/putty visual system with the Trigger.dev slate/lime system — new tokens, fonts, components, rewritten copy, regenerated assets — without losing the owner's photos, motto, or voice.

**Architecture:** Token-first. `globals.css` is rewritten to the new palette/scale, `layout.tsx` swaps Playfair Display for Inter + Geist + Geist Mono and enables the `dark` variant, so every later task styles against a correct foundation. Components that already repeat (`SectionLabel`, `FeaturePill`, `CodePane`, `HairlineDivider`) are extracted into `src/components/`; unique sections stay inline in `page.tsx`. Verification runs against the **real rendered HTML** produced by `next build`, because this device cannot import `.tsx` from a test runner (see Verification Strategy).

**Tech Stack:** Next.js 16.3.2 (App Router), React 19.2.8, Tailwind 4 via `@tailwindcss/postcss`, TypeScript 5, `next/font/google` (Inter, Geist, Geist_Mono), Node 26 `node --test` for `.ts`-only unit tests, ImageMagick 7 + `rsvg-convert` for asset regeneration.

**Spec:** `docs/superpowers/specs/2026-10-16-triggerdev-reskin-design.md`

## Global Constraints

Exact values, copied from the spec. Every task's requirements include this section.

- **Surfaces:** only two levels — Canvas `#1c1e21` (`--color-slate-canvas`) and Inset `#121317` (`--color-ink-well`). No third surface, no per-section custom color.
- **Hairlines:** `#272a2e` for normal borders, `#3b3e45` for emphasized ones. Always 1px.
- **Text roles:** primary `#e5e7eb` (bone), secondary `#d7d9dd` (cloud), tertiary `#878c99` (fog), muted `#b5b8c0` (ash). Never hardcode a hex in a component — use the token utility.
- **Accent discipline:** Signal Lime `#a8ff53` only as a small filled surface (primary button fill, logo glyph, one accent letter in the wordmark). Never as a large background or wash.
- **Syntax palette** — `#9c9af2`, `#fa3abf`, `#afec73`, `#d9f07c`, `#e888f8`, `#f43f5e` — appears **only** inside code contexts and feature-pill icons. Never on body copy or backgrounds.
- **Radii:** `4px` for every rectangular component. `9999px` only for pills. No other radius anywhere.
- **Forbidden:** drop shadows, decorative gradients, textures, `clip-path` notches, and any font size below `14px`.
- **Type scale:** caption 14/1.43 · body 16/1.56 · body-lg 18/1.5 · subheading 20/1.4/0.4px · heading-sm 24/1.38 · heading 30/1.33 · heading-lg 36/1.2/1.8px · display 48/1.11/2.4px · hero 60/1.0/3px.
- **Layout:** page max-width `1200px`, section vertical gap 80–120px, card padding 24–32px, element gap 8–16px.
- **Preserved verbatim:** the entire Motto Tawakal block; CTA "ngopi sambil ngobrol project →"; footer "Made with ngopi & vibes coding wkwk"; caption "wkwk tapi serius"; all 6 hobby titles and their 6 descriptions; the 7 photos in `public/hobi/`.
- **No new dependencies.** Inter, Geist, and Geist Mono are all in `next/font/google`.
- **Gate:** no `git commit`, `git push`, or `vercel --prod` without explicit owner approval.

## Verification Strategy (device-verified; do not substitute)

Three facts were tested on this device before writing this plan. They override any instinct to write component unit tests:

1. **Node 26 cannot import `.tsx` from a test.** `node --test` handles a `.ts` file, but resolving a `.tsx` import throws `ERR_UNKNOWN_FILE_EXTENSION`. There is no `tsx`, `esbuild`, `@swc/register`, `sucrase`, or `ts-node` in `node_modules`. **Therefore: never write a test that imports a component or `page.tsx` directly.** `node --test` is used only for plain `.ts` modules.
2. **`npx tsc --noEmit` and `npm run lint` both pass on this project today** (`tsc=0`, `lint=0`) and are the primary static gates.
3. **The real rendered HTML is available after a build** at `.next/server/app/index.html`, and it contains the actual server-rendered content — including client components (`Header`, `Ticker`) and inline `style` attributes. This is the strongest content assertion available offline, and it is what the content-guard tests use.

Consequences for every task below:

- Prefer a `.ts` module for logic that deserves a unit test (see `src/lib/code-tokens.ts` in Task 5).
- Assert page content against `.next/server/app/index.html`, and **build before testing** whenever a test reads that file.
- HTML-escape expected strings: React escapes `&` to `&amp;` in HTML. An assertion for the literal `Made with ngopi & vibes coding wkwk` will fail; the correct expectation is `Made with ngopi &amp; vibes coding wkwk`.
- `/tmp` is **not writable** on this device. Redirect build and lint output to `$HOME`, e.g. `npm run build > "$HOME/.build.log" 2>&1`.
- `node --test tests/*.test.ts` works (the shell glob expands). `node --test tests/` does **not**. Always use the glob.

Baseline for reference, measured before any change: `tsc=0`, `lint=0`, `build=0` (97s), 9/9 static pages, and `.next/static/css` contains 1 occurrence each of `c4c3b6` and `dfdcd5`.

## Review Focus

Each line is a failure mode the spec implies but no test in this plan directly exercises; the mitigation named next to it is what a reviewer must check by hand.

1. **Photos survive the re-skin.** A rewritten exhibition section could drop an image or its `alt`. → partially pinned by Task 10 Step 4 (asserts all 7 `/hobi/*.jpg` paths appear in the built HTML); `alt` text must be checked by eye because it is the `caption` string, which is layout copy.
2. **The motto is copied character-for-character.** Typographic cleanup is exactly how a sentence loses a clause. → pinned by Task 11 Step 4 and Task 12.
3. **Old tokens leak back through code that still compiles.** A missed `text-white/60` builds fine and looks wrong on slate. → pinned by Task 12 Step 2 (`no-legacy` scanner over all of `src/`).
4. **HTML entity escaping defeats a content assertion.** Verified live: `Made with ngopi & vibes coding wkwk` renders as `Made with ngopi &amp; vibes coding wkwk`. → pinned by Task 12 Step 3, which asserts the escaped form.
5. **`dark:` utilities emit nothing without the `dark` class.** Tailwind 4's default strategy is the `prefers-color-scheme` media query; a `dark:` variant in markup will not respond to a class unless `@custom-variant dark` is declared. → pinned by Task 13, which decides this explicitly rather than leaving it implicit.

---

### Task 1: Foundation — tokens in `globals.css`

**Files:**
- Modify: `src/app/globals.css` (full rewrite, 155 lines → ~175)
- Modify: `tsconfig.json` (one added compiler option, required by Task 5)

**Interfaces:**
- Consumes: nothing.
- Produces in this task: Tailwind `@theme` entries and `:root` custom properties named `--color-slate-canvas`, `--color-ink-well`, `--color-bone-text`, `--color-cloud-text`, `--color-fog-text`, `--color-ash-text`, `--color-steel-border`, `--color-graphite-hairline`, `--color-signal-lime`, `--color-event-violet`, `--color-syntax-violet`, `--color-syntax-pink`, `--color-loop-green`, `--color-key-lime`, `--color-tag-magenta`, `--color-mute-red`; font vars `--font-display`, `--font-sans`, `--font-mono`; radii `--radius-cards`/`--radius-buttons`/`--radius-links` at `4px`, `--radius-pills` at `9999px`; `--page-max-width: 1200px`; the nine `--text-*` roles; the spacing scale; and two CSS classes — `.hairline` and `.frame-file`.
- Deliberately defined by the task that owns them, **not** here: `.section-label` (Task 3), `.feature-pill` / `.feature-pill-dot` (Task 4), `.code-pane` / `.code-pane-file` / `.code-pane-line` (Task 5). Do not declare any rule twice.

- [ ] **Step 1: Replace the token blocks in `globals.css`**

Keep `@import "tailwindcss";` as the first line. In `:root`, delete the old color block (putty/ink/bone/chalk/vellum/graphite/ash/paper) and write the 16 new color tokens. Replace the font vars: `--font-davinci`/`--font-helvetica-now` become `--font-display` / `--font-sans` / `--font-mono`. Set `--radius-cards: 4px`, `--radius-buttons: 4px`, `--radius-links: 4px`, `--radius-pills: 9999px`, `--page-max-width: 1200px`. Replace the `--text-*`/`--leading-*`/`--tracking-*` block with the nine roles from Global Constraints. Replace the spacing scale with `4 8 12 16 24 28 32 40 48 64 96 160 192`.

Mirror the colors and the three font families into the existing `@theme { }` block so Tailwind emits utilities like `bg-slate-canvas`, `text-bone-text`, `border-steel-border`.

Then set the page defaults: `body { background: var(--color-slate-canvas); color: var(--color-bone-text); font-family: var(--font-sans); }`, `::selection { background: var(--color-signal-lime); color: var(--color-ink-well); }`, and `* { scrollbar-color: #3b3e45 #1c1e21; }`.

- [ ] **Step 2: Delete the retired decorative CSS and rewrite the survivors**

Delete `.texture-putty::before` (grain) and `.notched-card` (clip-path notch) outright — both are forbidden by Global Constraints. Rewrite the motion rules in the new language:

```css
.wordmark-carve { display:inline-block; white-space:nowrap; animation: carve 1.1s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes carve { from { letter-spacing:0.16em; opacity:0; transform:translateY(24px); } to { letter-spacing:0.05em; opacity:1; transform:translateY(0); } }

.reveal { opacity:0; transform:translateY(22px); transition:opacity .8s cubic-bezier(0.16,1,0.3,1), transform .8s cubic-bezier(0.16,1,0.3,1); will-change:opacity,transform; }
.reveal.in-view { opacity:1; transform:translateY(0); }

.ticker { display:flex; white-space:nowrap; overflow:hidden; user-select:none; }
.ticker-track { display:flex; flex-shrink:0; gap:2.5rem; align-items:center; padding-right:2.5rem; animation:ticker 26s linear infinite; }
@keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-100%); } }
.ticker:hover .ticker-track { animation-play-state:paused; }

.frame .f-image { transition: transform .8s cubic-bezier(0.16,1,0.3,1); }
.frame:hover .f-image { transform: scale(1.04); }
.frame .f-caption { opacity:.7; transition: opacity .5s ease; }
.frame:hover .f-caption { opacity:1; }
```

Keep `@keyframes fadeWord` and `.word-fade` unchanged. Then add the two rules that belong to this task:

```css
.hairline { height:1px; width:100%; background: var(--color-steel-border); }
.frame-file { font-family: var(--font-mono); font-size: 14px; line-height: 1.43; color: var(--color-fog-text); }
```

- [ ] **Step 3: Add `allowImportingTsExtensions` to `tsconfig.json`**

In `compilerOptions`, add `"allowImportingTsExtensions": true` immediately after `"noEmit": true`. Without it, `npx tsc --noEmit` rejects the `.ts`-suffixed relative imports that `node --test` requires.

**Device reminder:** capture build output with `npm run build > "$HOME/.build.log" 2>&1`. Never redirect to `/tmp`.

- [ ] **Step 4: Verify the old tokens are gone and the new ones are present**

Run:
```bash
cd ~/khamim-portfolio
grep -c "c4c3b6\|dfdcd5\|texture-putty\|notched-card" src/app/globals.css || echo 0
grep -c "slate-canvas\|signal-lime\|ink-well" src/app/globals.css
npx tsc --noEmit; echo "tsc=$?"
```
Expected: first command `0`; second command `>= 3`; `tsc=0`.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css tsconfig.json
git commit -m "feat(design): swap design tokens to slate/lime system"
```

---

### Task 2: Foundation — fonts and metadata in `layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx` (88 lines)

**Interfaces:**
- Consumes: the `--font-display`, `--font-sans`, `--font-mono` variable names from Task 1.
- Produces: three font loaders whose `variable` names match Task 1 exactly, and `metadata.title.default` set to `"KHAMIM ZARKASYI — Folio No. 01"`. The `<html>` className keeps the three font variables **and** is left without a `dark` class — Task 13 owns that decision.

- [ ] **Step 1: Swap the font loaders**

Replace the two `next/font/google` imports with three. Keep `subsets: ["latin"]` and `display: "swap"`; use the weights the spec lists.

```ts
const display = Inter({ variable: "--font-display", subsets: ["latin"], weight: ["400","500","600"], display: "swap" });
const sans = Geist({ variable: "--font-sans", subsets: ["latin"], weight: ["300","400","500"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["300","400"], display: "swap" });
```

Set the `<html>` className to include `display.variable`, `sans.variable`, and `mono.variable`.

- [ ] **Step 2: Strip the old vocabulary from metadata**

Set `title.default` to `"KHAMIM ZARKASYI — Folio No. 01"` and keep `title.template` as `"%s — Khamim Zarkasyi"`. Rewrite `description` to name the six rituals with no mention of putty or Renaissance. Align `openGraph.description` and `twitter.description` to the same sentence. In `keywords`, delete `"putty"` and `"Renaissance"`, keep `"portfolio"`, `"frontend developer"`, `"Indonesia"`, `"vibes coding"`, and add `"developer"`.

Leave `metadataBase`, `alternates.canonical`, `verification.google`, `robots`, `icons`, `authors`, `creator`, `publisher`, and `openGraph.images` untouched — the canonical URL and the Google verification token must not break.

- [ ] **Step 3: Repoint the body background at the new token**

`<body className="min-h-full flex flex-col bg-slate-canvas">` replaces the hardcoded `bg-[#c4c3b6]`. Confirm the class comes from the Task 1 `@theme` entry rather than an arbitrary value.

- [ ] **Step 4: Verify the build, the font substitution, and the emitted utilities**

Run:
```bash
cd ~/khamim-portfolio
npm run build > "$HOME/.build.log" 2>&1; echo "exit=$?"
grep -E "Compiled successfully|Failed to compile" "$HOME/.build.log"
grep -c "Playfair" src/app/layout.tsx || echo 0
npx tsc --noEmit; echo "tsc=$?"
```
Expected: `exit=0`, `Compiled successfully`, `0`, `tsc=0`.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(design): Inter + Geist + Geist Mono, new metadata"
```

---

### Task 3: Component — `SectionLabel`

**Files:**
- Create: `src/components/SectionLabel.tsx`
- Modify: `src/app/globals.css` (add `.section-label`)

**Interfaces:**
- Consumes: `--text-caption`, `--color-fog-text` from Task 1.
- Produces: `SectionLabel({ children, className }: { children: ReactNode; className?: string })` — default export, renders a `<p class="section-label">`.

- [ ] **Step 1: Implement `SectionLabel` and its CSS rule**

```tsx
import type { ReactNode } from "react";

export default function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`section-label ${className}`}>{children}</p>;
}
```

Add to `globals.css`:
```css
.section-label {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: 0.4px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--color-fog-text);
}
```

- [ ] **Step 2: Verify it typechecks and compiles into the page**

There is no unit test for this component (see Verification Strategy). It is verified by `tsc`, `lint`, and by appearing in the built HTML in the tasks that use it.

Run:
```bash
npx tsc --noEmit; echo "tsc=$?"
npm run lint > "$HOME/.lint.log" 2>&1; echo "lint=$?"
```
Expected: `tsc=0`, `lint=0`.

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionLabel.tsx src/app/globals.css
git commit -m "feat(ui): add SectionLabel component"
```

---

### Task 4: Component — `FeaturePill`

**Files:**
- Create: `src/components/FeaturePill.tsx`
- Modify: `src/app/globals.css` (add `.feature-pill`, `.feature-pill-dot`)

**Interfaces:**
- Consumes: `--radius-pills`, `--color-bone-text`, `--color-steel-border` from Task 1.
- Produces: `FeaturePill({ label, accent, className }: { label: string; accent?: string; className?: string })` — default export. `accent` is a CSS color string; when supplied, an `aria-hidden` dot with `style={{ background: accent }}` renders before the label.

- [ ] **Step 1: Implement `FeaturePill` and its CSS rule**

```tsx
export default function FeaturePill({ label, accent, className = "" }:
  { label: string; accent?: string; className?: string }) {
  return (
    <span className={`feature-pill ${className}`}>
      {accent ? <span aria-hidden="true" className="feature-pill-dot" style={{ background: accent }} /> : null}
      {label}
    </span>
  );
}
```

Add to `globals.css`:
```css
.feature-pill {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid var(--color-steel-border);
  border-radius: 9999px;
  padding: 4px 10px;
  font-family: var(--font-sans);
  font-size: 14px; line-height: 1.43;
  color: var(--color-bone-text);
}
.feature-pill-dot { width: 12px; height: 12px; border-radius: 9999px; flex: none; }
```

- [ ] **Step 2: Verify**

Run:
```bash
npx tsc --noEmit; echo "tsc=$?"
npm run lint > "$HOME/.lint.log" 2>&1; echo "lint=$?"
```
Expected: `tsc=0`, `lint=0`.

- [ ] **Step 3: Commit**

```bash
git add src/components/FeaturePill.tsx src/app/globals.css
git commit -m "feat(ui): add FeaturePill component"
```

---

### Task 5: Component — `CodePane` and the syntax token model

**Files:**
- Create: `src/lib/code-tokens.ts` (types + the token→color map; **no JSX**)
- Create: `src/components/CodePane.tsx`
- Create: `tests/code-tokens.test.ts`
- Modify: `src/app/globals.css` (add `.code-pane`, `.code-pane-file`, `.code-pane-line`)

**Interfaces:**
- Consumes: the six syntax colors from Task 1.
- Produces:
  - `type TokenKind = "default" | "keyword" | "string" | "type" | "variable" | "property" | "comment"` and `type CodeLine = Array<{ text: string; kind: TokenKind }>`, both exported from `src/lib/code-tokens.ts`.
  - `TOKEN_COLOR: Record<TokenKind, string>` from the same file — the single source of truth for syntax colors.
  - `CodePane({ lines, filename, className }: { lines: CodeLine[]; filename?: string; className?: string })` — default export from `src/components/CodePane.tsx`, rendering `class="code-pane"`, an optional `<p class="code-pane-file">`, and one `<span>` per token with an inline `style={{ color: TOKEN_COLOR[kind] }}`.

**Why the split:** the test runner can import `src/lib/code-tokens.ts` but cannot import `src/components/CodePane.tsx`. Putting the color map in the `.ts` file makes the spec-locked values unit-testable; the component itself is covered because its inline styles land in the built HTML, where Task 12 asserts them.

- [ ] **Step 1: Write the failing test for the token map**

```ts
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd ~/khamim-portfolio && node --test tests/code-tokens.test.ts`
Expected: FAIL — cannot find module `../src/lib/code-tokens.ts`.

- [ ] **Step 3: Implement `src/lib/code-tokens.ts`**

Export the two types and `TOKEN_COLOR` with exactly the seven hexes asserted above.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/code-tokens.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Implement `CodePane.tsx` and its CSS**

Root is `<div className={\`code-pane ${className}\`}>`. When `filename` is set, render `<p className="code-pane-file">{filename}</p>` first. Then map `lines` to `<div className="code-pane-line" key={i}>`, each containing one `<span key={j} style={{ color: TOKEN_COLOR[t.kind] }}>{t.text}</span>` per token. **Do not trim `t.text`** — the token text carries its own leading whitespace, and `.code-pane-line` sets `white-space: pre`.

Add to `globals.css`:
```css
.code-pane { background: var(--color-ink-well); border: 1px solid var(--color-steel-border); border-radius: 4px; padding: 24px; }
.code-pane-file { font-family: var(--font-mono); font-size: 14px; line-height: 1.43; color: var(--color-fog-text); margin-bottom: 16px; }
.code-pane-line { font-family: var(--font-mono); font-size: 14px; line-height: 1.43; white-space: pre; }
```

- [ ] **Step 6: Verify**

Run:
```bash
node --test tests/code-tokens.test.ts
npx tsc --noEmit; echo "tsc=$?"
```
Expected: PASS, 2 tests; `tsc=0`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/code-tokens.ts src/components/CodePane.tsx tests/code-tokens.test.ts src/app/globals.css
git commit -m "feat(ui): add CodePane with spec-locked syntax tokens"
```

---

### Task 6: Component — `HairlineDivider`

**Files:**
- Create: `src/components/HairlineDivider.tsx`
- Modify: `src/app/globals.css` (add `.hairline` if Task 1 did not)

**Interfaces:**
- Consumes: `--color-steel-border` from Task 1.
- Produces: `HairlineDivider({ className }: { className?: string })` — default export, `<div role="presentation" className="hairline …" />`.

- [ ] **Step 1: Implement `HairlineDivider`**

```tsx
export default function HairlineDivider({ className = "" }: { className?: string }) {
  return <div role="presentation" className={`hairline ${className}`} />;
}
```

`role="presentation"` matters: the component renders an empty visual line, so assistive technology should skip it.

- [ ] **Step 2: Verify**

Run:
```bash
grep -c "^\.hairline" src/app/globals.css
npx tsc --noEmit; echo "tsc=$?"
```
Expected: `1`, `tsc=0`.

- [ ] **Step 3: Commit**

```bash
git add src/components/HairlineDivider.tsx src/app/globals.css
git commit -m "feat(ui): add HairlineDivider component"
```

---

### Task 7: Restyle `Header.tsx`

**Files:**
- Modify: `src/components/Header.tsx` (85 lines)

**Interfaces:**
- Consumes: Task 1 tokens; the lime-fill rule from Global Constraints.
- Produces: the same default export and the same `NAV` array of 5 `{ href, label }` entries. No new props. `NAV` is consumed only inside this file.

- [ ] **Step 1: Restyle the shell and the logo lockup**

`<header>` becomes `bg-slate-canvas/95 sticky top-0 z-40 border-b border-steel-border backdrop-blur-[2px]` — drop `bg-[#c4c3b6]`, the `border-[#dfdcd5]/60`, and the `/60` opacity. Replace the circular `K` badge with the brand lockup: a small lime play-triangle SVG (`fill="currentColor"` on a `className="text-signal-lime"` wrapper) followed by the name in Geist 600. Keep the existing mark-plus-`<span>` structure so the `sm:` breakpoint behaviour is preserved. The wordmark text moves from `text-[11px] tracking-[0.14em]` to `font-sans text-[14px] tracking-[0.4px]`.

- [ ] **Step 2: Restyle the nav and add the lime CTA**

Nav links become `font-sans text-[14px] text-cloud-text hover:text-bone-text transition-colors` with no underline — the spec's nav item has no underline affordance. Append one primary action after the five ghost links: `<a href="mailto:khamimzarrr@gmail.com" className="bg-signal-lime text-ink-well rounded-[4px] px-4 py-2 font-sans text-[14px] font-medium">Hubungi</a>`. This is the only filled button in the header.

- [ ] **Step 3: Fix the hamburger and the mobile panel**

The bar spans use `bg-black` → `bg-bone-text`. The mobile panel uses `bg-[#c4c3b6]` → `bg-slate-canvas` and `border-[#dfdcd5]/60` → `border-steel-border`. The panel's `animate-[revealUp_0.25s_ease_both]` references a keyframe that does not exist in `globals.css`; since the panel is not scroll-driven, drop the animation class entirely and keep the plain bordered panel.

- [ ] **Step 4: Verify no legacy tokens remain and the file typechecks**

Run:
```bash
cd ~/khamim-portfolio
grep -c "c4c3b6\|dfdcd5\|text-black\|font-\[Inter\]\|font-\[--font-davinci\]" src/components/Header.tsx || echo 0
npx tsc --noEmit; echo "tsc=$?"
npm run lint > "$HOME/.lint.log" 2>&1; echo "lint=$?"
```
Expected: `0`, `tsc=0`, `lint=0`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat(design): restyle Header to slate/lime with lime CTA"
```

---

### Task 8: Restyle `Ticker.tsx` as a mono marquee

**Files:**
- Modify: `src/components/Ticker.tsx` (37 lines)

**Interfaces:**
- Consumes: the `.ticker` / `.ticker-track` rules kept in Task 1; `--font-mono`, `--color-fog-text`, `--color-graphite-hairline`.
- Produces: the same default export, still rendering two `Track`s (`ariaHidden={false}` and `ariaHidden={true}`). Two tracks are what makes the `translateX(-100%)` loop seamless — do not remove one.

- [ ] **Step 1: Swap the item vocabulary and the separator**

Replace `ITEMS` with the terminal-flavoured set, keeping order:
`["KHAMIMZAR","FOLIO NO. 01","SLATE #1C1E21","LIME #A8FF53","GEIST MONO 14PX","RADIUS 4PX","HAIRLINE 1PX","FOTO","SEPEDA","TANAMAN","AQUARIUM","VIBES CODING","NGOPI"]`.
Change the trailing separator from `◆` to `//` and its class from `text-black opacity-30` to `text-graphite-hairline`.

- [ ] **Step 2: Swap typography and container colors**

Item spans become `font-mono text-[14px] tracking-[0.04em] uppercase text-fog-text`. The container becomes `ticker w-full bg-slate-canvas border-y border-steel-border py-3 overflow-hidden`. The item gap lives in `.ticker-track` — do not duplicate it inline.

- [ ] **Step 3: Verify**

Run:
```bash
cd ~/khamim-portfolio
grep -c "◆\|e7e5e4\|dfdcd5\|font-\[Inter\]" src/components/Ticker.tsx || echo 0
npx tsc --noEmit; echo "tsc=$?"
```
Expected: `0`, `tsc=0`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Ticker.tsx
git commit -m "feat(design): restyle Ticker as Geist Mono marquee"
```

---

### Task 9: Rewrite `page.tsx` — imports, hero, wordmark, code pane

**Files:**
- Modify: `src/app/page.tsx` (445 lines)

**Interfaces:**
- Consumes: `Header` (Task 7), `Reveal` (unchanged), `Ticker` (Task 8), `SectionLabel` (Task 3), `FeaturePill` (Task 4), `CodePane` + `CodeLine` (Task 5), `HairlineDivider` (Task 6).
- Produces, for Tasks 10–11:
  - module-level `HERO_CODE: CodeLine[]` in `page.tsx`.
  - the renamed array `frames` (was `vignettes`) with the field `file` (replacing `latin`); each entry still has `title`, `desc`, `img`, `caption`.
  - the renamed Karya objects: `projects` keeps `name`, `desc`, `lang`, `href`, `vercel`, `featured`.
  - the deleted `heroPainting` constant and the deleted classical-panel section.

**Anchor warning:** after this task, `vignettes` and `latin` no longer exist. Tasks 10 and 11 must use `frames` and `file`. Do not reintroduce the old names.

- [ ] **Step 1: Rewrite the import block and the hero copy**

Keep `import Image from "next/image"`, `Header`, `Reveal`, `Ticker`. Add the four new components and `import type { CodeLine } from "@/lib/code-tokens";`. Delete the `heroPainting` Wikimedia constant — nothing uses it after Step 3.

Hero copy per spec §5.1, keeping the owner's meaning:
- label: `Portfolio — Folio No. 01 · Dev & Daily Rituals`
- headline: `Hidup aku build pelan-pelan — satu ritual sehari`, with `build` wrapped in `<span style={{ color: "var(--color-event-violet)" }}>`
- subtext: the existing sentence with "Renaissance" removed
- meta row: `Based: Indonesia` · `Est. 2026` · `Slate & Lime`
- buttons: primary `bg-signal-lime text-ink-well rounded-[4px]` labelled `hubungi via email`; two ghost buttons `border border-steel-border text-cloud-text rounded-[4px] hover:border-graphite-hairline` for GitHub and Instagram.

- [ ] **Step 2: Add the wordmark and the hero code pane**

Wordmark: `fontSize: "clamp(48px, 9vw, 140px)"`, `fontFamily: "var(--font-display)"`, `fontWeight: 600`, `letterSpacing: "0.05em"`, `lineHeight: 1`, color `var(--color-bone-text)`, wrapped in the existing `.wordmark-carve` span. Per spec decision #3 exactly one letter carries the accent: wrap the final `R` of `KHAMIMZAR` in `<span style={{ color: "var(--color-signal-lime)" }}>`.

Define `HERO_CODE` above the component with the spec's exact body, tokenised by kind: `const`/`function`/`return` → `keyword`; each string literal → `string`; `rituals`/`build` → `variable`; the `"slowly"` literal and `readonly` → `type`; the leading `//` line → `comment`; everything else (punctuation, whitespace) → `default`. Replace the em-dash inside the `build` return string with a plain hyphen `" - "` so the pane contains no typographic dash.

Render `<CodePane lines={HERO_CODE} filename="folio.ts" />` directly after the wordmark.

- [ ] **Step 3: Replace the classical panel with the terminal meta strip**

Delete the entire classical-panel `<section>` (the full-bleed painting, the `notched-card` exhibition card). In its place render `<HairlineDivider />` followed by a flex row of mono text: `terminal pane - scroll to read` on the left and `01 / 06` on the right, both `font-mono text-[14px] text-fog-text`. The `Hexagon` helper function at the bottom of the file is deleted in Task 10 once the last caller is gone.

- [ ] **Step 4: Rename `vignettes` → `frames` and `latin` → `file`**

Update the array declaration and every field name, and update the exhibition `map` to read `v.file`. Do not change any `title`, `desc`, `img`, or `caption` value. The six `file` values, in array order: `foto-random.jpg`, `ride-pagi.sh`, `tanaman.care`, `aquarium.md`, `coding.vibes`, `ngopi-project.log`.

- [ ] **Step 5: Verify the hero renders and the painting is gone**

Run:
```bash
cd ~/khamim-portfolio
npm run build > "$HOME/.build.log" 2>&1; echo "exit=$?"
grep -E "Compiled successfully|Failed to compile" "$HOME/.build.log"
grep -c "wikimedia\|School of Athens\|notched-card\|heroPainting" src/app/page.tsx || echo 0
grep -c "HERO_CODE\|CodePane\|signal-lime" src/app/page.tsx
```
Expected: `exit=0`, `Compiled successfully`, `0`, and `>= 3`.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(page): new hero — headline, lime CTA, wordmark, code pane"
```

---

### Task 10: Rewrite `page.tsx` — Karya (Inset), exhibition frames, marquees

**Files:**
- Modify: `src/app/page.tsx`
- Create: `tests/rendered-page.test.ts` (the content-guard suite; grown in Tasks 11 and 12)

**Interfaces:**
- Consumes: `frames` with `{ title, file, desc, img, caption }`, `projects` with `{ name, desc, lang, href, vercel, featured }`, `FeaturePill`, `HairlineDivider`.
- Produces: the built HTML that every content test reads.

**Ordering requirement:** these tests read `.next/server/app/index.html`, so **build before running them**. A stale file from an earlier build will make them lie.

- [ ] **Step 1: Write the failing content guard**

```ts
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
```

- [ ] **Step 2: Build, then run it to verify it fails**

Run:
```bash
npm run build > "$HOME/.build.log" 2>&1
node --test tests/rendered-page.test.ts
```
Expected: the label test FAILS — the page still renders the Latin names.

- [ ] **Step 3: Rewrite the Karya and exhibition sections**

**Karya** — `<section id="karya" className="w-full bg-ink-well border-y border-steel-border px-6 md:px-10 py-20 md:py-28">` with an inner `max-w-[1200px]`. Each card: `bg-ink-well border border-steel-border rounded-[4px] p-6` — no `bg-white`, and the hover moves the border to `var(--color-graphite-hairline)`. Keep the full-card `<a>` overlay pattern, the secondary `github ↗` link, and the `live ↗` tag restyled as a `FeaturePill` with `accent="#a8ff53"`. The `Featured` badge becomes `bg-signal-lime text-ink-well rounded-[4px]`. Heading copy: `Empat karya yang tumbuh dari ngopi & vibes coding` — the count word must still match the array length, because `scripts/tambah-karya.sh` rewrites that word (see Task 14 figure).

**Exhibition** — `<section id="exhibition" className="w-full bg-slate-canvas px-6 md:px-10 py-20 md:py-28">`. Rename the wrapper `vignette` → `frame`, `v-image` → `f-image`, `v-caption` → `f-caption`, matching the Task 1 CSS. Drop `rounded-full`: each photo becomes a `rounded-[4px]` frame with `border border-steel-border`, sized `aspect-square` or `aspect-[4/5]`. Replace the Latin label element with `<p className="frame-file">{v.file}</p>` (the `.frame-file` rule is defined in Task 1). Delete the three `<Hexagon />` indicators and the `Hexagon` helper function, replacing them with a mono `01 / 06` counter derived from the loop index. Keep every `title`, `desc`, and `caption` string byte-for-byte.

**Marquees** — exactly three `<Ticker />` placements, per the spec's section table: one after the hero meta strip, one after the exhibition section, and one before the footer (added in Task 11).

- [ ] **Step 4: Build, then run the guard**

Run:
```bash
npm run build > "$HOME/.build.log" 2>&1; echo "exit=$?"
node --test tests/rendered-page.test.ts
```
Expected: `exit=0`, PASS 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/rendered-page.test.ts
git commit -m "feat(page): Karya Inset section, framed exhibition, mono marquees"
```

---

### Task 11: Rewrite `page.tsx` — motto, about, pills, footer

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `tests/rendered-page.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 9–10.
- Produces: the finished page; no new exports.

- [ ] **Step 1: Extend the content guard with the copy protections**

Append to `tests/rendered-page.test.ts`:

```ts
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
```

- [ ] **Step 2: Build, then run it to verify it fails**

Run:
```bash
npm run build > "$HOME/.build.log" 2>&1
node --test tests/rendered-page.test.ts
```
Expected: the legacy-vocabulary test FAILS while the Latin labels and putty strings remain.

- [ ] **Step 3: Rewrite the motto, about, pills, and footer**

**Motto** — keep both `<blockquote>` sentences and the `— Khamim Zarkasyi` attribution byte-for-byte; only classes change (`font-display text-[30px] leading-[1.33] text-bone-text`), with the label via `SectionLabel` and the rule via `HairlineDivider`. The label text stays `Motto — Tawakal`.

**About** — two columns. The narrative keeps its meaning with technical vocabulary swapped: the `Putty #c4c3b6`/`Ink #000000` sentence becomes `Slate #1c1e21` as the canvas and `Lime #a8ff53` as the accent. The visitor card becomes `bg-ink-well border border-steel-border rounded-[4px] p-6`. The still-life card becomes a `rounded-[4px]` framed image, keeping `/hobi/foto-bunga.jpg` and its caption. The six hobby chips become `FeaturePill`s with accents, in order: `#9c9af2`, `#a8ff53`, `#afec73`, `#fa3abf`, `#e888f8`, `#a8ff53`.

**Pills row and footer** — add `<HairlineDivider />`, then the six `FeaturePill`s as the page-foot row the spec asks for, then the third `<Ticker />`, then the footer. The footer background becomes `bg-slate-canvas` with a top `border-steel-border`; the three link columns keep every URL unchanged. The closing line becomes `No shadows, no gradients — only slate & lime.` while `Made with ngopi & vibes coding wkwk` and `© 2026 Khamim Zarkasyi` stay verbatim.

- [ ] **Step 4: Build, then run the guard**

Run:
```bash
npm run build > "$HOME/.build.log" 2>&1; echo "exit=$?"
node --test tests/rendered-page.test.ts
```
Expected: `exit=0`, PASS 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/rendered-page.test.ts
git commit -m "feat(page): motto, about, feature pills and footer in new system"
```

---

### Task 12: Legacy-token scanner and full-suite gate

**Files:**
- Create: `tests/no-legacy.test.ts`
- Modify: any `src/**` file the scanner reports

**Interfaces:**
- Consumes: the finished `src/` tree from Tasks 1–11.
- Produces: nothing consumed by later tasks; this is the regression net.

- [ ] **Step 1: Write the legacy-token scanner**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const FORBIDDEN = ["c4c3b6","e7e5e4","ebebeb","dfdcd5","Playfair","Davinci","putty","Renaissance"];

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
```

- [ ] **Step 2: Run it and fix every hit in `src/`**

Run: `node --test tests/no-legacy.test.ts`
Expected: PASS with an empty `hits` array. Edit each reported file until the report is empty. **Do not add exceptions to the test** — the spec's success criterion is zero hits.

Note: this scanner deliberately covers only `src/`. `README.md`, `HANDOFF.md`, and the scripts legitimately mention the old system until Task 14 rewrites them, and the spec document itself must keep both vocabularies to describe the migration.

- [ ] **Step 3: Prove Tailwind emitted the new colors**

This catches classes Tailwind could not see (dynamically concatenated class names) and confirms the `@theme` block is wired up.

Run:
```bash
cd ~/khamim-portfolio
npm run build > "$HOME/.build.log" 2>&1
CSS=$(find .next/static/css -name "*.css" | head -1)
echo "css=$CSS"
for t in 1c1e21 121317 a8ff53 e5e7eb 272a2e 3b3e45; do printf "%-8s %s\n" "$t" "$(grep -c "$t" "$CSS")"; done
```
Expected: every line prints a count `>= 1`. Note that `1c1e21` and `121317` also appear as inline styles in the HTML, but this step checks the compiled **CSS** specifically — a `0` here means the `@theme` entry is missing.

- [ ] **Step 4: Run the full suite**

Run:
```bash
cd ~/khamim-portfolio
node --test tests/*.test.ts 2>&1 | tail -8
npx tsc --noEmit; echo "tsc=$?"
npm run lint > "$HOME/.lint.log" 2>&1; echo "lint=$?"
npm run build > "$HOME/.build.log" 2>&1; echo "build=$?"
```
Expected: all suites PASS, `tsc=0`, `lint=0`, `build=0`.

- [ ] **Step 5: Commit**

```bash
git add tests/no-legacy.test.ts
git commit -m "test(design): guard against legacy tokens"
```

---

### Task 13: Decide and implement the dark-variant strategy

**Files:**
- Modify: `src/app/globals.css` (conditionally — see Step 1)
- Modify: `src/app/layout.tsx` (conditionally — see Step 1)

**Interfaces:**
- Consumes: the finished `src/` tree.
- Produces: a documented decision. If any `dark:` utility is used in `src/`, this task must make it functional; if none is used, this task must record that and change nothing.

**Why this task exists:** Tailwind 4's default `dark` variant follows `prefers-color-scheme`, so a `dark:` class in markup does not respond to a `dark` class on `<html>` unless `@custom-variant dark (&:where(.dark, .dark *));` is declared. The spec says "dark theme" but never says whether `dark:` utilities are used. Leaving that ambiguous is how a class silently does nothing.

- [ ] **Step 1: Find out whether any `dark:` variant is actually used**

Run:
```bash
cd ~/khamim-portfolio
grep -rn "dark:" src/ | grep -v "node_modules" || echo "NO dark: UTILITIES USED"
```
Expected: either no output (the whole app is dark by explicit token, not by variant), or a list of hits.

- [ ] **Step 2: Act on the result**

- **If Step 1 printed no hits:** the page is dark by token alone, which is correct and simpler. Record that in a one-line comment at the top of `globals.css` (`/* dark-only design: no dark: variant used — surfaces come from tokens */`) and do not add the custom variant. Skip to Step 3.
- **If Step 1 printed hits:** add `@custom-variant dark (&:where(.dark, .dark *));` beside the `@import` in `globals.css`, and add `dark` to the `<html>` className in `layout.tsx` so those utilities activate.

- [ ] **Step 3: Verify the page is dark without relying on the variant**

Run:
```bash
cd ~/khamim-portfolio
npm run build > "$HOME/.build.log" 2>&1; echo "exit=$?"
H=.next/server/app/index.html
grep -c "1c1e21" "$H"
grep -c "c4c3b6" "$H" || echo 0
```
Expected: `exit=0`; `1c1e21` present; `c4c3b6` is `0`. This proves the dark canvas comes from the token, not from a colour-scheme media query — the page will look identical regardless of the device's light/dark setting.

- [ ] **Step 4: Commit** (only if Step 2 changed a file)

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "chore(design): make the dark-variant strategy explicit"
```

---

### Task 14: Reconcile the Karya scripts and the docs

**Files:**
- Modify: `scripts/tambah-karya.sh`
- Modify: `scripts/hapus-karya.sh`
- Modify: `README.md`
- Modify: `HANDOFF.md`

**Interfaces:**
- Consumes: the final `page.tsx` from Tasks 9–11.
- Produces: scripts whose substitution targets still exist, and docs that describe the new system.

**Why this task exists:** `tambah-karya.sh` rewrites the string `"X karya kecil"` and the footer's `"Karya — 0X"`. After Task 10 the heading reads `Empat karya yang tumbuh dari ngopi & vibes coding`, so the `karya kecil` substitution silently no-ops, and the `Karya — 0X` footer label no longer exists at all. Both scripts must have their targets updated. The count word must keep matching, because the script derives it from the `projects[]` length.

- [ ] **Step 1: Update the substitution targets in both scripts**

In each script, replace the `karya kecil` regex with the new stem `karya yang tumbuh dari ngopi & vibes coding`, and delete the now-meaningless `Karya — 0X` footer substitution. Keep the Indonesian number-word map (`Satu` … `Dua belas`) — the new heading still opens with that word. Verify the `projects[]` regex and the `name: "` counter still match the rewritten array (Task 10 kept both).

- [ ] **Step 2: Verify the scripts' targets exist in the page**

Run:
```bash
cd ~/khamim-portfolio
python3 - <<'PY'
import re, pathlib
c = pathlib.Path("src/app/page.tsx").read_text()
print("projects block:", bool(re.search(r"const projects = \[(.*?)\n  \];", c, re.DOTALL)))
print("heading stem:", "karya yang tumbuh dari ngopi & vibes coding" in c)
print("count word present:", any(f"{w} karya yang tumbuh" in c for w in ["Satu","Dua","Tiga","Empat","Lima"]))
print("projects found:", len(re.findall(r'name: "', c)))
PY
```
Expected: the first three print `True` and the last prints `4`.

- [ ] **Step 3: Update `README.md` and `HANDOFF.md`**

`README.md`: replace the title `Renaissance Gallery on Putty Paper` with `Folio No. 01 — Slate & Lime`; replace the putty/ink/Playfair description with slate/lime/Geist; replace the Stack font line.

`HANDOFF.md`: update the status date; replace the "DESIGN.md Tokens (jangan diubah)" section with the new token table; update the component tree to include the four new components and `src/lib/code-tokens.ts`; add a line pointing at the spec path so the next session reads it first; note that the verification model is "build, then assert on `.next/server/app/index.html`" and that `.tsx` cannot be imported by `node --test` on this device.

- [ ] **Step 4: Verify no scratch files were left behind and the repo is clean of strays**

Run:
```bash
cd ~/khamim-portfolio
git status --short
git diff --stat pre-redesign-20261016-094907
```
Expected: only tracked project files show as modified. Nothing in `$HOME` (like `.page-scratch.tsx` or `.build.log`) appears, because those live outside the repo.

- [ ] **Step 5: Commit**

```bash
git add scripts/tambah-karya.sh scripts/hapus-karya.sh README.md HANDOFF.md
git commit -m "docs: align Karya scripts and handoff docs with the slate/lime system"
```

---

### Task 15: Regenerate the four brand assets

**Files:**
- Modify: `src/app/icon.svg`
- Modify: `src/app/icon.png` (512×512)
- Modify: `src/app/apple-icon.png` (180×180)
- Modify: `public/og/og-cover.png` (1200×630)

**Interfaces:**
- Consumes: `#1c1e21`, `#121317`, `#a8ff53`, `#e5e7eb`, `#878c99`, `#272a2e`.
- Produces: assets referenced by the unchanged `metadata.icons` and `metadata.openGraph.images` entries in `layout.tsx`.

- [ ] **Step 1: Write the new `icon.svg`**

The brand glyph on a slate field. A `4px` rx on a 64px square reads as a square at favicon size, which is the honest translation of the radius rule.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="4" fill="#1c1e21"/>
  <path d="M25 19 L46 32 L25 45 Z" fill="#a8ff53"/>
</svg>
```

- [ ] **Step 2: Rasterise both icon sizes**

Run:
```bash
cd ~/khamim-portfolio
rsvg-convert -w 512 -h 512 -o src/app/icon.png src/app/icon.svg
rsvg-convert -w 180 -h 180 -o src/app/apple-icon.png src/app/icon.svg
magick identify src/app/icon.png src/app/apple-icon.png
```
Expected: two lines reporting `512x512` and `180x180`.

- [ ] **Step 3: Build the OG cover with `rsvg-convert`**

`rsvg-convert` renders text with the device's system fonts; this was verified working with `Noto Sans`/`Roboto` present in `/system/fonts`. Author the SVG at `$HOME/.og-source.svg` (never inside `public/`, so it cannot accidentally ship): a `#1c1e21` field, `KHAMIM ZARKASYI` in `#e5e7eb`, the subline `Folio No. 01 — Slate & Lime` in `#878c99`, a lime `#a8ff53` rounded rect as the primary button with an `#121317` label reading `ngopi sambil ngobrol project`, and a mock code pane — a `#121317` rect with a 1px `#272a2e` stroke holding three short mono lines coloured `#9c9af2`, `#fa3abf`, and `#d9f07c`. Use `font-family="Noto Sans, Roboto, DejaVu Sans, sans-serif"`, because the Google fonts are not installed as system fonts on this device.

```bash
rsvg-convert -w 1200 -h 630 -o public/og/og-cover.png "$HOME/.og-source.svg"
magick identify public/og/og-cover.png
rm -f "$HOME/.og-source.svg"
```
Expected: `1200x630`.

- [ ] **Step 4: Verify dimensions and that the lime accent actually rendered**

Run:
```bash
cd ~/khamim-portfolio
python3 - <<'PY'
from PIL import Image
for p in ["src/app/icon.png","src/app/apple-icon.png","public/og/og-cover.png"]:
    im = Image.open(p).convert("RGB")
    lime = sum(1 for c in im.getdata() if abs(c[0]-168)<40 and c[1]>210 and c[2]<130)
    print(f"{p}: {im.size} lime_px={lime}")
PY
```
Expected: `512x512`, `180x180`, `1200x630`, and `lime_px > 0` on all three. A `lime_px=0` means the render silently dropped the glyph — re-check the SVG before committing.

- [ ] **Step 5: Commit**

```bash
git add src/app/icon.svg src/app/icon.png src/app/apple-icon.png public/og/og-cover.png
git commit -m "feat(brand): regenerate icon, apple-icon and OG cover in slate/lime"
```

---

### Task 16: Final verification gate

**Files:**
- No file changes. This task produces evidence only.

**Interfaces:**
- Consumes: the complete work from Tasks 1–15.
- Produces: the evidence bundle the owner reviews before any deploy decision.

- [ ] **Step 1: Run every gate in one pass**

```bash
cd ~/khamim-portfolio
node --test tests/*.test.ts 2>&1 | tail -8
npx tsc --noEmit; echo "tsc=$?"
npm run lint > "$HOME/.lint.log" 2>&1; echo "lint=$?"
npm run build > "$HOME/.build.log" 2>&1; echo "build=$?"
grep -E "Compiled successfully|Generating static pages" "$HOME/.build.log" | tail -2
```
Expected: all suites PASS, `tsc=0`, `lint=0`, `build=0`, and 9/9 static pages generated.

- [ ] **Step 2: Prove the rendered HTML is the new system**

```bash
cd ~/khamim-portfolio
H=.next/server/app/index.html
echo "— harus >= 1 —"
for t in 1c1e21 a8ff53 e5e7eb "KHAMIMZAR" "ngopi sambil ngobrol project" "Menitipkan segala cemas"; do
  printf "%-34s %s\n" "$t" "$(grep -c "$t" "$H")"
done
echo "— harus 0 —"
for t in c4c3b6 Playfair "School of Athens" "Fragmenta Temporis"; do
  printf "%-34s %s\n" "$t" "$(grep -c "$t" "$H")"
done
```
Expected: every line in the first group is `>= 1`; every line in the second group is `0`.

- [ ] **Step 3: Record the diff surface for the owner**

```bash
git status --short
git diff --stat pre-redesign-20261016-094907
```
Expected: the stat lists only `src/`, `public/`, `scripts/`, `README.md`, `HANDOFF.md`, `tsconfig.json`, and `docs/`. No stray files, no `node_modules`, no `.next`.

- [ ] **Step 4: Stop and report**

Do not commit the final state, push, or deploy. Report the evidence from Steps 1–3, plus the visual-check instruction: the owner runs `npm run dev` and opens the page on the device, because **no browser exists in this environment** for an automated screenshot or a Lighthouse-style check. Hand over the rollback command:

```bash
~/backup-khamim-portfolio/20261016-094907/rollback-design.sh soft
```
