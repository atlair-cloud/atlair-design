# AGENTS.md

Atlair Design is Atlair's open-source Vue 3 design system: `@atlair/tokens` and `@atlair/vue`, built on
Reka UI and Tailwind CSS 4. Read [docs/plan.md](docs/plan.md) before adding a package or a component.

## Rules

- **No comments in code**, including JSDoc and `<!-- -->` in templates. `pnpm lint` fails on any, through
  `eslint.config.mjs` and `scripts/check-no-comments.ts`; exceptions go in the ESLint config, never in
  `eslint-disable` comments. Names carry the meaning;
  descriptions of props, slots and events go in the component's `docs.ts`; the reason behind a
  non-obvious choice goes in `docs/decisions/` or the PR description.
- Apps never import `reka-ui`; only `@atlair/vue` does.
- Components style from semantic tokens and `data-*` state only; no hard-coded colours.
- Every component folder has `Component.vue`, `component.recipe.ts`, `docs.ts`, `examples/`,
  `Component.stories.ts` and `Component.test.ts`. Examples are the single source for Storybook, the docs
  site and the manifest. `pnpm new:component <name>` generates the folder, the `exports` entry and the
  resolver mapping; `docs.ts` is typed, so a missing or unknown prop, slot or event description fails
  `vue-tsc`.
- Shared prop names and values: `variant`, `size: 'sm' | 'md' | 'lg'`, `color`, `disabled`, `loading`,
  `ui`, `class`. Parts are named `A<Component><Part>`.
- Vue: `<script setup lang="ts">`, `defineModel`, `useId`; single quotes, no semicolons.
