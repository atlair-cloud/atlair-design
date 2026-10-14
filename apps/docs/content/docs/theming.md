---
title: Theming
description: Light and dark mode, and how to override the tokens.
---

Every colour a component uses is a semantic token, and each one has a light and a dark value.

## Dark mode

Dark values apply under the `dark` class or the `data-theme="dark"` attribute, on the root element or on any
part of the page.

`useTheme()` manages it for the whole app. It remembers the choice, sets `data-theme` on `<html>`, and in
`system` mode follows the operating system live:

```vue
<script setup lang="ts">
import { useTheme } from '@atlair/vue/theme'

const { preference, resolved, setTheme } = useTheme()
</script>

<template>
  <button @click="setTheme(resolved === 'dark' ? 'light' : 'dark')">Theme: {{ preference }}</button>
</template>
```

Both selectors also switch Tailwind's `dark:` variant, which `theme.css` defines for you.

### No flash on reload

The saved choice is only known in the browser, so a server-rendered page would paint in the wrong theme until the
app starts. Put this tiny script in `<head>` and the theme is set before the first paint. It does not need the
app's JavaScript.

In Nuxt, in `nuxt.config.ts`:

```ts
import { createThemeScript } from '@atlair/vue/theme'

export default defineNuxtConfig({
  app: { head: { script: [{ innerHTML: createThemeScript(), tagPosition: 'head' }] } },
})
```

In a Vite app, in `vite.config.ts`:

```ts
import { createThemeScript } from '@atlair/vue/theme'

const themeScript = {
  name: 'atlair-theme-script',
  transformIndexHtml: () => [{ tag: 'script', children: createThemeScript(), injectTo: 'head-prepend' }],
}
```

## RTL, locale and reduced motion

Wrap the app in `AApp`, or in `AConfigProvider` if you don't want the tooltip and toast providers. It sets the
reading direction, locale and teleport target for everything inside:

```vue
<AApp dir="rtl" locale="ar">
  <RouterView />
</AApp>
```

## Semantic tokens

| Token | Used for |
| --- | --- |
| `bg`, `bg-subtle`, `bg-inset`, `bg-frame` | Page and surface backgrounds |
| `fg`, `fg-muted` | Text |
| `border`, `ring` | Borders and the focus ring |
| `accent`, `accent-fg` | The main action and the text on it |
| `danger`, `success`, `warning` | Status colours |

The [tokens page](/tokens) lists every value and its contrast ratio in both themes.

## Overriding

Tokens are CSS variables with the `--a-` prefix, so an override is a plain CSS rule:

```css
:root {
  --a-accent: #1f6feb;
  --a-radius-base: 0.5rem;
}
```

The build checks contrast for the shipped tokens, but not for your overrides, so check them yourself.
