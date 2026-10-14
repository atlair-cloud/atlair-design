# Atlair Design: plan

Atlair Design is the open-source Vue 3 component library behind Atlair's products. It starts from what
`atlair-mail`'s panel (`apps/web`) already ships, since that's the most complete Atlair UI today, and turns it
into packages any Vue app can install.

Research date: 2026-10-14. Versions below were read from the npm registry on that day.

## 1. Which primitives to build on

"Base UI" ([base-ui.com](https://base-ui.com), `@base-ui/react` 1.9.0, from the Radix/MUI/Floating UI
teams) is React-only. On Vue there are three options:

| Option | State (Oct 2026) | Verdict |
|---|---|---|
| **Reka UI** (`reka-ui` 2.11.0, formerly Radix Vue) | About 60 headless parts: everything Base UI has, plus Calendar, DatePicker, DateRangePicker, TimeField, Tree, Splitter, Stepper, TagsInput, Listbox, Pagination, ColorField/ColorArea, Editable and Rating. It runs Nuxt UI and shadcn-vue. | **Use it.** |
| `base-ui-vue` 0.5.0 (unofficial port, listed on Base UI's community page) | Pre-1.0. It has 18 roots (Accordion, Avatar, Checkbox, Collapsible, Field, Fieldset, Meter, NumberField, OtpField, Progress, Radio, ScrollArea, Slider, Switch, Tabs, Toolbar, Tooltip, plus Floating), but no Dialog, Menu, Popover, Select, Combobox or Toast yet. | Watch it, but don't build on it yet. |
| Ark UI (`@ark-ui/vue` 5.x, Zag.js state machines) | Mature, and it works in several frameworks. | Only worth it if Atlair also needs React or Solid. |

Why Reka:

1. **The panel already runs on it.** `atlair-mail/apps/web` uses Nuxt UI 4, and Nuxt UI is Reka plus
   Tailwind. Its `data-[state=checked]` styling in `AtlairSwitch.vue` is Reka's API. Moving the panel to
   Atlair Design keeps the same behaviour layer and only swaps the styling layer.
2. **It covers the full set.** Date and time inputs, Tree and Stepper are things an email product needs
   (scheduling, template folders, setup guides), and Base UI doesn't have them.
3. **It's stable** (v2, actively released) and accessible (WAI-ARIA patterns, focus management, RTL,
   i18n through `ConfigProvider`).

**From Base UI, we adopt the API style rather than the code.** Each item below is a rule for our styled
layer:

| Base UI idea | Atlair rule |
|---|---|
| `render` prop to swap the element | Every component accepts `as` / `asChild` (Reka's `Primitive`), so `<AButton as-child><RouterLink/></AButton>` works. |
| State as `data-*` attributes (`data-open`, `data-disabled`, `data-checked`) | Style only from data attributes, not from JS class toggles, so themes stay plain CSS. |
| CSS variables for floating parts (`--anchor-width`, `--available-height`, `--transform-origin`) | Popovers, menus and selects use Reka's `--reka-*-trigger-width` and similar variables, with aliases under `--a-*`. |
| `Field` / `Fieldset` / `Form` handle label, description, error and validity wiring | Build `AField` first. Every input reads its id, `aria-describedby` and `aria-invalid` from the nearest `AField`. |
| A small API per part, no prop explosion | Simple components take props. Complex ones expose their parts (`ADialog`, `ADialogTrigger`, `ADialogContent`, and so on) and also offer a shortcut with props, like Nuxt UI. |

To keep a later move to `base-ui-vue` possible, consuming apps must not import from `reka-ui`. Only
`@atlair/vue` does.

## 2. Packages

Atlair Design is a pnpm and Turborepo monorepo with the same tooling as `atlair-mail` (Node 24, pnpm 10,
TypeScript, Turborepo).

```
atlair-design/
  packages/
    tokens/        @atlair/tokens       design tokens (DTCG JSON) → CSS variables, Tailwind 4 @theme, TS
    vue/           @atlair/vue          components (Reka + Tailwind 4), one entry per component
    icons/         @atlair/icons        Iconoir subset and Atlair marks as Vue components (optional, later)
  apps/
    docs/          docs site (VitePress), live examples, the a11y notes for each component
    playground/    Vite app or Histoire stories for local work and visual tests
  .changeset/      versioning and changelogs
```

Package names: `@atlair/*` (the `@atlair` scope is currently free on npm; reserve it before going public).

### `@atlair/tokens`

- Source of truth is W3C Design Tokens (DTCG) JSON, built with Style Dictionary 4 into:
  - `tokens.css`: `:root { --a-color-... }`, with dark values under `.dark` **and**
    `[data-theme=dark]`, so it works with the panel's `html.panel-dark` toggle once that class is renamed.
  - `theme.css`: a Tailwind 4 `@theme` block, so `bg-atlair-950` and similar classes work in apps.
  - `tokens.ts`: typed values for charts and canvas code (`FlickeringGrid`).
- Seed it from `atlair-mail/apps/web/src/styles/main.css`:
  - Brand: the `atlair-50…950` navy ramp and `puff #5eb7e6`.
  - Surfaces: `canvas`, `canvas-subtle`, `frame`, and their dark versions from `panel-dark.css`.
  - Text: `#344256` body text and `slate-400/500`.
  - Status: `live #58b98a`, `active #5eb7e6`, `attention #f4c96b`, and an error red.
  - Font: Spline Sans (OFL, bundled as woff2 with a latin/latin-ext split, as the panel does).
  - Radius: `0.25rem` (`--ui-radius`), plus the 5px and 3px switch radii.
  - Shadows and the frame: `.shell-panel` and `.frame-gloss`.
  - Motion: the `cubic-bezier(.2,0,0,1)` easings and durations from `page-transitions.css`, with
    `prefers-reduced-motion` handled once here.
- Define tokens in two tiers: **primitive** (`atlair-700`) and **semantic** (`--a-bg`, `--a-fg-muted`,
  `--a-border`, `--a-accent`, `--a-danger`). Components use semantic tokens only.

### `@atlair/vue`

- Vue 3.5+ with `<script setup lang="ts">`, `defineModel` for every `v-model`, and `useId` for ids.
- Styling: Tailwind 4 classes are combined with a `tv()` (tailwind-variants) recipe per component, so
  every component has typed `variant` / `size` / `color` props and a `ui` / `class` override. This
  matches what the panel already does with Nuxt UI's `:ui`, so migration stays mechanical.
- Ships ESM only and `sideEffects: ["*.css"]`. It's built with Vite library mode, and `vue-tsc` or
  `unplugin-dts` emit the `.d.ts` files. `exports` has `"."` plus `"./button"` and so on for each
  component, so apps that don't auto-import still get tree-shaking. A `@atlair/vue/resolver` for
  `unplugin-vue-components`, and later a Nuxt module, provide auto-import.
- CSS: an app does `@import '@atlair/tokens/theme.css'; @import '@atlair/vue/style.css';`, and Tailwind
  scans `@atlair/vue` with `@source`.
- Peer dependencies: `vue`. Direct dependencies: `reka-ui`, `tailwind-variants`, `@vueuse/core`.
- Prefix: `A` (`AButton`, `ADialog`). It's short, can't clash with Nuxt UI's `U`, and lets both run side
  by side during migration.

## 3. Components

Priority comes from what the `atlair-mail` panel actually renders (`<UButton>` 51 times, `UInput` 19,
`UTooltip` 14, `USelect` 7, `UDropdownMenu` 6, `USlider` 4, plus its own shared components). Each wave
is shippable on its own.

### Wave 0: foundations

| Item | Notes |
|---|---|
| `@atlair/tokens` | Section 2 |
| `AConfigProvider` | Wraps Reka's `ConfigProvider`: direction, locale, reduced motion, teleport target, and `useId` SSR safety |
| `useTheme()` | light, dark or system. Persists, sets `data-theme`, and replaces `panel-theme.ts` |
| `AVisuallyHidden`, `APrimitive` | Re-exported for `as-child` |
| Focus ring, `cn()`, `tv()` presets | Shared internals |

### Wave 1: replaces Nuxt UI in the panel

| Component | Reka base | Panel use today |
|---|---|---|
| `AButton` (+ `ATextButton` variant `link`) | `Primitive` | `UButton` ×51, `TextButton` |
| `AIconButton` | `Primitive` | icon-only `UButton`. Makes `aria-label` required at the type level |
| `AInput`, `ATextarea` | native + `AField` | `UInput` ×19, `UTextarea` |
| `AField`, `AFieldset`, `AForm` | `Label` + context (from Base UI's `Field`) | form wiring across settings |
| `ASelect` | `Select` | `USelect` ×7 |
| `ASwitch` | `Switch` | `USwitch`, `AtlairSwitch` |
| `ACheckbox`, `ARadioGroup` | `Checkbox`, `RadioGroup` | `ChoiceCards` builds on `ARadioGroup` |
| `ASlider` | `Slider` | `USlider` ×4 |
| `ATooltip` | `Tooltip` | `UTooltip` ×14 |
| `ADropdownMenu` | `DropdownMenu` | `UDropdownMenu` ×6, `UserMenu`, `OrganizationSwitcher` |
| `ADialog`, `AAlertDialog` | `Dialog`, `AlertDialog` | `UModal`, `FramedModal`, `ConfirmModal`, `ModalActions` |
| `ADrawer` | `Drawer` | `USlideover` |
| `ACommandPalette` | `Combobox` + `Listbox` | `UCommandPalette`, `CommandMenu` |
| `AToast` | `Toast` | notifications |
| `ATabs` | `Tabs` | `SectionTabs`, `CodeTabs` |
| `ABadge`, `AStatusDot` | — | `EmailStatusBadge`, status colours |
| `AKbd`, `ASeparator`, `ASkeleton`, `ASpinner` | `Separator` | `PageSkeleton`, `loading.css` |
| `AApp` | `ConfigProvider`, `Toast` provider, tooltip provider | `UApp` |

### Wave 2: Atlair patterns

These come out of `apps/web/src/components/shared` and `components/data-table`, and are what make it
*Atlair* rather than another component kit.

| Component | From |
|---|---|
| `ACopyButton`, `ASecretReveal` | `CopyButton`, `SecretReveal` (API keys, webhook secrets) |
| `ACodeBlock` (+ tabs) | `CodeTabs`, playground snippets |
| `AEmptyState`, `AStatusScreen`, `ALoadErrorCard`, `ANotFound`, `ACrashScreen` | shared status screens |
| `APageHeader`, `ASettingsCard`, `AFactsRow`, `AAuditStamp` | page building blocks |
| `ADataTable` + `ATableSearch`, `ATableFilter`, `ATablePagination`, `useCursorPages` | `components/data-table`, built on TanStack Table (headless) |
| `AAvatar` (+ `AvatarFace`) | Reka `Avatar` |
| `AShell`, `AFrame`, `AGridBackdrop`, `AFlickeringGrid` | `ShellLayout`, `frame.css`, the backdrop |
| `ABreadcrumb`, `ATopbar` | `useBreadcrumb`, `AppTopbar` |
| `AProgress`, `AMeter` | `PanelProgress`, sending limits |
| `AStepper` | Reka `Stepper`, for `SetupGuide` |
| `APuff` (mascot moods) | `PuffMood` |

### Wave 3: the rest of the primitive set

`AAccordion`, `ACollapsible`, `APopover`, `AHoverCard`, `AContextMenu`, `AMenubar`, `ANavigationMenu`,
`ACombobox` / `AAutocomplete`, `ANumberField`, `APinInput` (OTP), `ATagsInput`, `AToggle` /
`AToggleGroup`, `AToolbar`, `AScrollArea`, `APagination`, `ASplitter`, `ATree`, `AListbox`.

### Wave 4: date, time and specialist parts

`ACalendar`, `ARangeCalendar`, `ADatePicker`, `ADateRangePicker`, `ATimeField` (scheduled sends,
analytics ranges), and `AColorField` / `AColorArea` (brand colours in templates). Charts stay outside the
library: give apps `@atlair/tokens` chart palettes instead.

`atlair-mail`'s TipTap template editor stays in the app. Atlair Design can supply `AToolbar` and the
bubble and floating menu surfaces, but not the editor itself.

## 4. Practices for every component

A component is done when it meets all of these. Put the list in the PR template.

- **API**
  - It has `v-model` through `defineModel`, plus a `default*` prop for uncontrolled use.
  - It forwards attributes and refs (`defineExpose` of the root element).
  - It supports `as` / `asChild` where it renders a single element.
  - Props are typed with literal unions, not `string`.
  - Events are emitted in Reka's `update:*` and `*-change` naming.
- **Accessibility**: it follows the WAI-ARIA APG pattern that Reka implements.
  - Keyboard use is covered by tests.
  - Focus is visible (a `:focus-visible` ring from tokens).
  - Contrast is at least 4.5:1 in both themes, checked by the token build.
  - Icon-only controls require `aria-label` at the type level.
  - It honours `prefers-reduced-motion`.
- **Styling**
  - Styles come only from semantic tokens and `data-*` state.
  - There are no hard-coded colours.
  - Dark mode comes from tokens, not `dark:` variants scattered through components.
  - The component accepts `class` and `ui` overrides.
- **SSR**: it is safe in Nuxt, with no `window` at setup and ids from `useId`.
- **Tests**
  - **Vitest** with `@vue/test-utils` in browser mode (Playwright Chromium, already in this environment)
    covers behaviour.
  - **vitest-axe** runs on every story or example.
  - **Playwright screenshot tests** cover light and dark themes in the playground.
- **Docs**: each component gets a page with examples, a props, slots and events table generated by
  `vue-component-meta`, and a keyboard and a11y section.
- **Code style**: the same as atlair-mail's web app, with single quotes, no semicolons and no comments in
  code. Reasons go in `docs/`.

## 5. Open-source setup

- **Licence: MIT.** This decision is still open. `atlair-mail` is AGPL-3.0, but under AGPL every app
  that bundles the library would be pulled into AGPL, which blocks most adoption of a UI kit. Nuxt UI,
  Reka and Base UI are all MIT. Keep Spline Sans under OFL, with its `OFL.txt` shipped beside it.
- **Release**:
  - Changesets handles versions and changelogs.
  - GitHub Actions publishes with npm provenance (`--provenance`) and trusted publishing.
  - Semver is strict, and the first release is `0.x` until Wave 1 has replaced Nuxt UI in the panel.
- **Repository files**: README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md, issue and PR templates, and
  an `AGENTS.md` that mirrors atlair-mail's rules.
- **CI on every PR**: `pnpm typecheck`, lint, unit, a11y and visual tests. It also runs a size limit
  (`size-limit` per entry) and a docs build preview.
- **Dogfooding**: `atlair-mail/apps/web` is the first consumer. It installs `@atlair/vue` like any other
  user would, with no workspace link to private code, as atlair-mail's AGENTS.md already requires for
  Atlair.

## 6. Order of work

1. Scaffold the monorepo (pnpm, Turborepo, TypeScript, Changesets, CI) and add `@atlair/tokens` seeded
   from the panel's CSS.
2. Build `@atlair/vue` with `AConfigProvider`, `AButton`, `AField`, `AInput`, the test and docs harness,
   and publish `0.1.0`.
3. Build the rest of Wave 1, then migrate `atlair-mail/apps/web` from `U*` to `A*` one feature folder at
   a time. Remove `@nuxt/ui` when nothing uses it.
4. Do Wave 2 by lifting the shared components out of the panel.
5. Do Waves 3 and 4 when a product needs them, and review `base-ui-vue` again when it reaches 1.0.

## Sources

- Base UI: https://base-ui.com and its community list, https://base-ui.com/react/overview/community
- Base UI v1 release: https://infoq.com/news/2026/02/baseui-v1-accessible/
- Unofficial Vue port: https://github.com/vuepont/base-ui-vue (npm `base-ui-vue`)
- Reka UI: https://reka-ui.com
- Ark UI: https://ark-ui.com
- Alternatives overview: https://designrevision.com/alternatives/base-ui
