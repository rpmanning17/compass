# Compass tokens

This directory is the atomic source of truth for Compass's visual style. Every other layer in the system — components, the Figma library, Storybook examples, downstream consuming applications — derives from the JSON files here.

## Layout

Tokens live in two layers, deliberately:

- **Atomic** (top-level files): raw scale values. `color.json`, `typography.json`, `spacing.json`, `radii.json`, `shadows.json`, `motion.json`. Per-client forks override these to carry brand identity.
- **Semantic** (`semantic/`): role-based aliases that reference atomic tokens. `text.json`, `surface.json`, `border.json`, `intent.json`, `interactive.json`. Components consume semantic tokens, never atomic tokens directly.

The two-layer split is what makes Compass portable. Swap the atomic palette for a new client's brand and every semantic token cascades automatically; components stay untouched. This cascade is the whole point of the semantic layer, and the build pipeline preserves it through to the Figma export so the cascade survives in Tokens Studio too.

## Token shape (DTCG)

All tokens follow the [Design Tokens Community Group draft format](https://tr.designtokens.org/format/). Each token is an object with `$value` and `$type`:

```json
{
  "color": {
    "gray": {
      "50": { "$value": "#F8FAFC", "$type": "color" }
    }
  }
}
```

References use curly-brace path syntax pointing at any token in the merged tree:

```json
{
  "text": {
    "primary": {
      "$value": "{color.gray.900}",
      "$type": "color",
      "$description": "Default text color for body content and headings."
    }
  }
}
```

`$type` values used in this repo: `color`, `dimension`, `fontFamily`, `fontWeight`, `number`, `duration`, `cubicBezier`, `shadow`, `typography`. Composite types (`shadow`, `typography`) carry an object as `$value`; everything else is a primitive string or number.

## Naming conventions

- **Lowercase, hyphenated** for multi-word names — `link-hover`, `letter-spacing`, `success-bg`.
- **Numeric scales** for ordinal axes — color shades 50–950, spacing 0–32, type sizes xs–6xl.
- **Descriptive names** where the value carries meaning rather than ordinal position — motion durations as `instant`/`fast`/`normal`/`slow`/`slower`, radii as `none`/`xs`/`sm`/`md`/`lg`/`full`.
- **Periods are forbidden** in token names. They collide with DTCG's reference path separator. The 2px sub-spacing token is `0_5`, not `0.5`.

### Flat hyphenated semantic names — deliberate

Semantic tokens like `interactive.primary-default` and `text.link-hover` are written as flat siblings under their group, not as nested children:

```json
// chosen — flat hyphenated keys
{
  "interactive": {
    "primary-default": { "$value": "{color.indigo.500}", "$type": "color" },
    "primary-hover":   { "$value": "{color.indigo.600}", "$type": "color" }
  }
}
```

The alternative — nesting `hover` inside a `primary` parent that itself has `$value` — is the DTCG "group with value" pattern, where a node tries to be both a token and a parent. The pattern is technically allowed in the DTCG spec but causes ambiguity in Style Dictionary plugins and downstream tooling. The flat form is unambiguous, and the kebab-case CSS output is identical (`--interactive-primary-default`, `--interactive-primary-hover`).

## Build pipeline

```bash
npm run build:tokens
```

Style Dictionary (pinned to `4.4.0`) reads `tokens/**/*.json`, resolves references, and emits four files into `dist/`:

| File | Format | Consumers |
|---|---|---|
| `dist/tokens.css` | CSS custom properties; alias chains preserved via `var(--token-name)` | Apps consuming Compass via CSS |
| `dist/tokens.js` | ES module named exports | React components (Phase 3) |
| `dist/tokens.d.ts` | TypeScript declarations | Component typing |
| `dist/tokens.figma.json` | DTCG JSON, alias-aware (references kept as `{path}`) | Tokens Studio import → Figma variables |

Configuration lives in `style-dictionary.config.mjs` at the repo root. Two custom additions worth knowing about:

**`expand-typography` preprocessor** (CSS platform only). Composite typography tokens like `heading-1` get expanded into atomic per-property tokens before transforms run. The CSS `font:` shorthand has no slot for `letter-spacing`, so Style Dictionary's stock `typography/css/shorthand` transform silently drops it. Expanding to per-property vars (`--typography-heading-1-letter-spacing` and friends) keeps the full composite intact in CSS. JS and Figma platforms preserve the composite shape because their consumers (component code, Tokens Studio) handle composites natively.

**`json/dtcg-clean` format** (Figma platform). Style Dictionary's stock `json` format dumps internal metadata (`filePath`, `isSource`, `original`, `name`, `attributes`, `path`) on every token. The custom format walks the tree and emits only `$value`, `$type`, and `$description` — what Tokens Studio expects. References are preserved (not resolved) so per-client theming cascades through Tokens Studio sync correctly.

## Adding a new token

### A new atomic value

Find the right file (`color.json`, `spacing.json`, etc.). Add the token in DTCG shape with the appropriate `$type`, matching the file's existing naming convention. Run `npm run build:tokens` to verify it builds clean. The token appears in all output formats automatically.

### A new semantic alias

Find the right file in `semantic/` based on the role (text, surface, border, intent, or interactive). Reference an atomic token via `{group.subgroup.name}` and add a `$description` explaining the role:

```json
"warning-strong": {
  "$value": "{color.warning.700}",
  "$type": "color",
  "$description": "High-emphasis warning color, e.g., for destructive-warning buttons."
}
```

Run `npm run build:tokens` to verify the reference resolves and to regenerate outputs.

### A new category (rare)

Create a new JSON file in `tokens/` (atomic) or `tokens/semantic/` (alias). Use a top-level wrapper key matching the file's intent (e.g., `motion`, `surface`). Add token entries with `$value` and `$type`. No build config changes needed — the `tokens/**/*.json` glob picks up new files automatically.

## Known cosmetic issues

These are real but not worth the maintenance cost of a custom transform; they don't affect functional output.

- **Font family quote escaping in CSS.** `--typography-family-sans` renders as `"Inter", system-ui, -apple-system, '"Segoe UI"', Roboto, sans-serif`. The mixed single/double quoting around `"Segoe UI"` is awkward but functions correctly in every browser. CSS tolerates both quote styles.
- **Token name collisions warning at build time.** Style Dictionary emits a warning that internal `name` attributes collide across tokens (e.g., `color.gray.500` and `color.indigo.500` both have `name: "500"` in the figma platform, which has no transformGroup applying `name/kebab`). The warning is inert: `json/dtcg-clean` walks the token tree by path and never reads the `name` field, so the JSON output is correct.

## Known limitations

Logged in PLAN.md §8. As of Phase 2 close: the DTCG 2025.10 object-shape compliance gap, and `surface.overlay` alias traceability (hardcoded `rgba` rather than alias-plus-alpha). Both are revisitable when tooling and transforms catch up.
