# Tokens seeded from atlair-mail's panel

`@atlair/tokens` is seeded from `atlair-mail/apps/web/src/styles/`. This note records how each panel value
was mapped, and what was left out on purpose.

## Structure

- `primitive.json` holds every raw value. Light and dark values sit side by side (`color.canvas.light`,
  `color.canvas.dark`, `color.slate` and `color.slate-dark`).
- `semantic.light.json` and `semantic.dark.json` hold the same names and point at primitives only.
  Components use the semantic names and nothing else.
- Files follow the DTCG format. Colours are hex strings (8 digits when there is alpha), and shadows are
  arrays of layers, with `inset` where the panel uses it.

## Mapping

| Panel | Token |
|---|---|
| `--color-atlair-50…950`, `--color-puff` | `color.atlair.*`, `color.puff` |
| `panel-dark` `--color-atlair-900/950` | `color.atlair-dark.900/950` |
| `--color-canvas`, `--color-canvas-subtle`, `--color-frame` and their dark values | `color.canvas`, `color.canvas-subtle`, `color.frame` (`light` and `dark`) |
| `--color-white` (and `--ui-bg` in dark) | `color.surface` |
| `.frame-chrome` `--color-white` | `color.frame-chrome` |
| `--ui-text` | `color.text.body` |
| `--color-slate-400/500` overrides, and the dark slate ramp | `color.slate`, `color.slate-dark` |
| `--color-status-live/active/attention` | `color.status.*` |
| `--ui-error` (`red-600`, dark `#f07a7a`) | `color.status.error.light/dark` |
| `--skeleton-base/shine` | `color.skeleton-track`, `color.skeleton-glint` (`light` and `dark`) |
| `--ui-radius` | `radius.base` |
| `AtlairSwitch` 5px track and 3px thumb | `radius.switch`, `radius.switch-thumb` |
| `.shell-panel` box-shadow | `shadow.shell` |
| `cubic-bezier(.2,0,0,1)`, `(0,0,.2,1)`, `(.4,0,1,1)`, `(.2,.8,.2,1)`, `ease`, `ease-in-out` | `easing.*` |
| Every duration in `page-transitions`, `view-transitions` and `loading` | `duration.*` |
| `--font-sans` | `font.sans` |

Slate steps the panel doesn't override (50, 100, 200, 300 and 600 to 950 in light) are Tailwind's defaults,
copied in so semantic tokens don't depend on Tailwind's palette.

## Added beyond the panel

- `color.scrim` has no panel value (Nuxt UI supplied it), so it is a new colour. The semantic `overlay` points at it.
- Semantic `bg-inset`, `bg-frame`, `fg-frame`, `skeleton`, `skeleton-shine` and `shadow.shell` go past the
  ticket's list. Each one is a panel surface that components would otherwise read from a primitive.
- `color.skeleton-glint.light` is `color-mix(slate-100 35%, white)` worked out to `#fafbfd`.

## Intentionally dropped

- **Nuxt UI aliases** (`--ui-primary`, `--ui-bg-*`, `--ui-text-*`, `--ui-border-*`): replaced by the semantic
  tokens.
- **Dark amber, red, emerald and violet ramps**: only existed to recolour Nuxt UI's soft badges and alerts.
  `success`, `warning` and `danger` cover them. The `red-600` step survives as `status.error`.
- **`.frame-gloss` gradients**: a gradient with an angle and a stop position isn't a DTCG token. It becomes a
  component recipe in `@atlair/vue`.
- **Keyframes** (`skeleton-sweep`, `panel-progress-glide`, `vt-*`) and the `prefers-reduced-motion` rules:
  behaviour, not values. Reduced motion is handled once in the CSS output.
- **`@font-face` rules and the woff2 files**: assets, shipped with the CSS output ticket.

## Outputs

`pnpm build` in `packages/tokens` runs Style Dictionary 4 and writes `dist/`:

| File | Content |
|---|---|
| `tokens.css` | Every token as `--a-*`. Light semantic values sit in `:root`, dark ones under `.dark` and `[data-theme=dark]`. A `prefers-reduced-motion` block zeroes every duration. |
| `theme.css` | Imports `tokens.css`, adds a `dark` variant for both selectors, and maps tokens to Tailwind 4 theme variables (`bg-atlair-950`, `text-fg-muted`, `shadow-shell`). Semantic names go in `@theme inline`, so utilities read `var(--a-*)` and follow the theme. |
| `fonts.css`, `fonts/` | Spline Sans in two woff2 subsets, with `OFL.txt`. |
| `tokens.ts` | Resolved primitive and semantic values, typed `as const`. |
| `tokens.json` | The same values in DTCG shape, for agents. |

The primitive names `skeleton-track`, `skeleton-glint`, `scrim` and `shadow.shell-light/dark` avoid a clash with
the semantic names once both files load into one tree.

## Contrast gate

The build fails when a pair is under 4.5:1 (text) or 3:1 (UI), in light and in dark. Pairs are listed in
`build/contrast.ts`. Left out on purpose:

- `border` on `bg`: hairlines are decorative, and the panel's `slate-200` is about 1.2:1 against white.
- `success` and `warning` on `bg`: they fill dots and badges that also carry text, so colour is never the only
  signal. `#58b98a` and `#f4c96b` are well under 3:1 on white.
- `scrim` and the shadows: they have alpha, and contrast needs an opaque pair.
