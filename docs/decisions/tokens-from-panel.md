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
| `--skeleton-base/shine` | `color.skeleton.base/shine` |
| `--ui-radius` | `radius.base` |
| `AtlairSwitch` 5px track and 3px thumb | `radius.switch`, `radius.switch-thumb` |
| `.shell-panel` box-shadow | `shadow.shell` |
| `cubic-bezier(.2,0,0,1)`, `(0,0,.2,1)`, `(.4,0,1,1)`, `(.2,.8,.2,1)`, `ease`, `ease-in-out` | `easing.*` |
| Every duration in `page-transitions`, `view-transitions` and `loading` | `duration.*` |
| `--font-sans` | `font.sans` |

Slate steps the panel doesn't override (50, 100, 200, 300 and 600 to 950 in light) are Tailwind's defaults,
copied in so semantic tokens don't depend on Tailwind's palette.

## Added beyond the panel

- `color.overlay` has no panel value (Nuxt UI supplied it), so it is a new scrim.
- Semantic `bg-inset`, `bg-frame`, `fg-frame`, `skeleton`, `skeleton-shine` and `shadow.shell` go past the
  ticket's list. Each one is a panel surface that components would otherwise read from a primitive.
- `color.skeleton.shine.light` is `color-mix(slate-100 35%, white)` worked out to `#fafbfd`.

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
