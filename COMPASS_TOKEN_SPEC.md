# Compass Token Spec — Phase 2 Design Input

**Vibe vector:** Editorial precision. Quiet, technical, considered, generous.
**Palette posture:** Cool grays, muted indigo primary, restrained status colors.
**Typography:** Inter (sans) + JetBrains Mono (mono).

This document is the design spec for Phase 2's tokens layer. Cowork should translate these values into the DTCG-aligned JSON structure for Style Dictionary, following the directory layout already approved (atomic tokens by category + `tokens/semantic/` for the alias layer).

---

## 1. Color

### 1.1 Cool gray scale (slate-tinted)

| Step | Hex |
|------|-----|
| 50  | `#F8FAFC` |
| 100 | `#F1F5F9` |
| 200 | `#E2E8F0` |
| 300 | `#CBD5E1` |
| 400 | `#94A3B8` |
| 500 | `#64748B` |
| 600 | `#475569` |
| 700 | `#334155` |
| 800 | `#1E293B` |
| 900 | `#0F172A` |
| 950 | `#020617` |

These are the Tailwind "slate" values. Well-tested, accessible contrast ratios, slight cool undertone consistent with the vibe.

### 1.2 Muted indigo (primary)

| Step | Hex |
|------|-----|
| 50  | `#EEF0F8` |
| 100 | `#DADEF0` |
| 200 | `#B5BDE1` |
| 300 | `#8F9CD2` |
| 400 | `#6F7CC0` |
| 500 | `#5662AB` |
| 600 | `#444E8A` |
| 700 | `#363E6E` |
| 800 | `#2A3055` |
| 900 | `#1F2440` |
| 950 | `#131628` |

Anchored at `#5662AB` for the 500 — a deep, considered indigo, intentionally desaturated compared to Tailwind's default indigo. Reads as "ink" rather than "Crayola."

### 1.3 Status colors (full 50–950 scales)

**Success (muted forest green)**

| Step | Hex |
|------|-----|
| 50  | `#F0F7F2` |
| 100 | `#DDEBE2` |
| 200 | `#BBD7C5` |
| 300 | `#94C0A6` |
| 400 | `#6BA784` |
| 500 | `#4A8B65` |
| 600 | `#387050` |
| 700 | `#2D5840` |
| 800 | `#234232` |
| 900 | `#1B3026` |
| 950 | `#0F1C16` |

**Danger (muted oxblood)**

| Step | Hex |
|------|-----|
| 50  | `#FBF1F1` |
| 100 | `#F5DDDD` |
| 200 | `#ECBABA` |
| 300 | `#DF9595` |
| 400 | `#D06D6D` |
| 500 | `#B84747` |
| 600 | `#99383A` |
| 700 | `#7C2E30` |
| 800 | `#602527` |
| 900 | `#471D1F` |
| 950 | `#2B1213` |

**Warning (muted amber)**

| Step | Hex |
|------|-----|
| 50  | `#FAF5EC` |
| 100 | `#F2E8D2` |
| 200 | `#E5D2A5` |
| 300 | `#D6B976` |
| 400 | `#C49E48` |
| 500 | `#A8842A` |
| 600 | `#876B23` |
| 700 | `#6A551E` |
| 800 | `#524219` |
| 900 | `#3C3014` |
| 950 | `#251D0C` |

**Info (slate blue, distinct from indigo primary)**

| Step | Hex |
|------|-----|
| 50  | `#EFF4F8` |
| 100 | `#D9E5EE` |
| 200 | `#B3CADC` |
| 300 | `#8AAEC8` |
| 400 | `#6093B3` |
| 500 | `#437998` |
| 600 | `#34607C` |
| 700 | `#294D63` |
| 800 | `#1F3B4C` |
| 900 | `#182D3A` |
| 950 | `#0E1B24` |

### 1.4 Pure values

- `white`: `#FFFFFF`
- `black`: `#000000`

(Use sparingly — semantic surface tokens should prefer `gray.50` over pure white in most cases.)

---

## 2. Typography

### 2.1 Font families

- **`sans`**: `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- **`mono`**: `"JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace`

Both loaded via Google Fonts in consuming applications. The token JSON should specify the font stack as above.

### 2.2 Font sizes (1.25 modular ratio, 16px base)

| Token | rem | px |
|-------|-----|-----|
| `xs`   | 0.75rem  | 12px |
| `sm`   | 0.875rem | 14px |
| `base` | 1rem     | 16px |
| `lg`   | 1.125rem | 18px |
| `xl`   | 1.25rem  | 20px |
| `2xl`  | 1.5rem   | 24px |
| `3xl`  | 1.875rem | 30px |
| `4xl`  | 2.25rem  | 36px |
| `5xl`  | 3rem     | 48px |
| `6xl`  | 3.75rem  | 60px |

### 2.3 Font weights

| Token | Value |
|-------|-------|
| `regular`  | 400 |
| `medium`   | 500 |
| `semibold` | 600 |
| `bold`     | 700 |

### 2.4 Line heights

| Token | Value |
|-------|-------|
| `tight`   | 1.2 |
| `snug`    | 1.4 |
| `normal`  | 1.5 |
| `relaxed` | 1.6 |
| `loose`   | 1.75 |

### 2.5 Letter spacing

| Token | Value |
|-------|-------|
| `tight`  | -0.02em |
| `normal` | 0 |
| `wide`   | 0.02em |

### 2.6 Composite tokens

Bundle size + line-height + weight for common roles. Atomic tokens above stay independently accessible per the prior decision (some teams prefer atomic-only).

| Token | Size | Weight | Line height | Letter spacing |
|-------|------|--------|-------------|----------------|
| `heading-1` | `4xl`  | `semibold` | `tight`  | `tight`  |
| `heading-2` | `3xl`  | `semibold` | `tight`  | `tight`  |
| `heading-3` | `2xl`  | `semibold` | `snug`   | `normal` |
| `heading-4` | `xl`   | `semibold` | `snug`   | `normal` |
| `heading-5` | `lg`   | `medium`   | `snug`   | `normal` |
| `body-lg`   | `lg`   | `regular`  | `normal` | `normal` |
| `body`      | `base` | `regular`  | `normal` | `normal` |
| `body-sm`   | `sm`   | `regular`  | `normal` | `normal` |
| `caption`   | `xs`   | `regular`  | `normal` | `wide`   |
| `code`      | `base` | `regular`  | `normal` | `normal` (mono family) |

---

## 3. Spacing

4px base unit. Numeric multiples (Tailwind convention).

| Token | px |
|-------|-----|
| `0`    | 0 |
| `0.5`  | 2px |
| `1`    | 4px |
| `2`    | 8px |
| `3`    | 12px |
| `4`    | 16px |
| `5`    | 20px |
| `6`    | 24px |
| `8`    | 32px |
| `10`   | 40px |
| `12`   | 48px |
| `16`   | 64px |
| `20`   | 80px |
| `24`   | 96px |
| `32`   | 128px |

The `0.5` step is a deliberate inclusion for sub-step adjustments (icon offsets, hairline separators); above that, full multiples only.

---

## 4. Radii

Small. Editorial precision does not have pillowy corners.

| Token | px |
|-------|-----|
| `none` | 0 |
| `xs`   | 2px |
| `sm`   | 4px |
| `md`   | 6px |
| `lg`   | 8px |
| `full` | 9999px |

Note: no `xl` or `2xl` radii. Components should default to `sm` or `md`. `lg` for cards/large surfaces. `full` for pills and circular avatars.

---

## 5. Shadows

Four levels, soft, cool-gray-tinted to match palette. No Material Design drop shadows.

| Token | Value |
|-------|-------|
| `none` | `none` |
| `xs`   | `0 1px 2px 0 rgba(15, 23, 42, 0.04)` |
| `sm`   | `0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.05)` |
| `md`   | `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)` |
| `lg`   | `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.06)` |

The `rgba(15, 23, 42, ...)` is `gray.900`. Tinting shadows with the palette's cool-gray ensures shadows don't read warm against cool surfaces.

Components should default to no shadow; use `sm` or `md` for elevated states only.

---

## 6. Motion

### 6.1 Durations

| Token | Value |
|-------|-------|
| `instant` | 0ms |
| `fast`    | 150ms |
| `normal`  | 200ms |
| `slow`    | 300ms |
| `slower`  | 500ms |

### 6.2 Easings

| Token | Value |
|-------|-------|
| `linear`      | `linear` |
| `standard`    | `cubic-bezier(0.2, 0, 0, 1)` |
| `decelerate`  | `cubic-bezier(0, 0, 0.2, 1)` |
| `accelerate`  | `cubic-bezier(0.4, 0, 1, 1)` |
| `emphasized`  | `cubic-bezier(0.2, 0, 0, 1)` |

Calm, decelerative defaults. No bounce, no overshoot. `standard` is the safe default for most transitions.

---

## 7. Semantic tokens (`tokens/semantic/`)

Aliases that map atomic tokens to roles. Components should consume semantic tokens, not raw scale tokens. This is what makes per-client theming clean — swap the raw palette and semantic tokens cascade.

### 7.1 Text

| Token | Value |
|-------|-------|
| `text-primary`   | `gray.900` |
| `text-secondary` | `gray.600` |
| `text-tertiary`  | `gray.500` |
| `text-disabled`  | `gray.400` |
| `text-inverse`   | `gray.50` |
| `text-link`      | `indigo.600` |
| `text-link-hover` | `indigo.700` |
| `text-success`   | `success.700` |
| `text-danger`    | `danger.700` |
| `text-warning`   | `warning.700` |
| `text-info`      | `info.700` |

### 7.2 Surface

| Token | Value |
|-------|-------|
| `surface-page`     | `gray.50` |
| `surface-default`  | `#FFFFFF` |
| `surface-subtle`   | `gray.50` |
| `surface-muted`    | `gray.100` |
| `surface-elevated` | `#FFFFFF` (with `shadow.sm` or `md` applied separately) |
| `surface-inverse`  | `gray.900` |
| `surface-overlay`  | `rgba(15, 23, 42, 0.5)` (gray.900 at 50% — for modal scrim) |

### 7.3 Border

| Token | Value |
|-------|-------|
| `border-subtle`  | `gray.100` |
| `border-default` | `gray.200` |
| `border-strong`  | `gray.300` |
| `border-focus`   | `indigo.500` |
| `border-success` | `success.500` |
| `border-danger`  | `danger.500` |
| `border-warning` | `warning.500` |
| `border-info`    | `info.500` |

### 7.4 Intent (status containers — alerts, badges)

For each intent (success/danger/warning/info), provide a `bg` (subtle background) and `fg` (foreground text/icon):

| Token | Value |
|-------|-------|
| `intent-success-bg` | `success.50` |
| `intent-success-fg` | `success.700` |
| `intent-danger-bg`  | `danger.50` |
| `intent-danger-fg`  | `danger.700` |
| `intent-warning-bg` | `warning.50` |
| `intent-warning-fg` | `warning.700` |
| `intent-info-bg`    | `info.50` |
| `intent-info-fg`    | `info.700` |

### 7.5 Interactive (button/control surfaces)

| Token | Value |
|-------|-------|
| `interactive-primary-default` | `indigo.500` |
| `interactive-primary-hover`   | `indigo.600` |
| `interactive-primary-active`  | `indigo.700` |
| `interactive-primary-fg`      | `gray.50` (text on primary) |
| `interactive-neutral-default` | `gray.100` |
| `interactive-neutral-hover`   | `gray.200` |
| `interactive-neutral-active`  | `gray.300` |
| `interactive-neutral-fg`      | `gray.900` |

---

## 8. Notes for Cowork

1. **DTCG shape.** Each token uses `$value` and `$type`. References use `{group.subgroup.name}` syntax. Confirmed in prior turn.
2. **Atomic + semantic split.** Atomic tokens (color, typography, spacing, radii, shadows, motion) live as flat files in `tokens/`. Semantic tokens live in `tokens/semantic/` and reference atomic tokens by path.
3. **Style Dictionary outputs.** Three formats per the plan: CSS variables, TypeScript exports, Tokens Studio-importable JSON.
4. **Pin the Style Dictionary version.** No `latest`. Specific version (likely `^4.x`).
5. **Composite typography tokens.** Per prior decision, both atomic AND composite typography tokens stay accessible; composite tokens reference atomic ones.
6. **Cross-check pause.** After JSON is written and build runs end-to-end, pause for Codex CLI review per §7 of PLAN.md before final commit.
