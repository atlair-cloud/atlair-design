---
title: Installation
description: Add Atlair Design to a Vite or Nuxt app that uses Tailwind CSS 4.
---

The packages are not published to npm yet. These are the steps they will follow.

## Install

```bash
pnpm add @atlair/vue @atlair/tokens
```

`@atlair/vue` needs `vue` 3.5 or newer and `tailwindcss` 4 as peers.

## Import the styles

In your main CSS file, import Tailwind, the tokens, the font and the component styles:

```css
@import 'tailwindcss';
@import '@atlair/tokens/theme.css';
@import '@atlair/tokens/fonts.css';
@import '@atlair/vue/style.css';
```

`theme.css` defines the Tailwind theme, so classes such as `bg-atlair-950`, `text-fg-muted` and
`border-border` work in your own markup. `style.css` tells Tailwind to scan the components for the classes they
use, so you don't add an `@source` line yourself.

## Use a component

Import from the component's entry, so only what you use is bundled:

```vue
<script setup lang="ts">
import { AButton } from '@atlair/vue/button'
</script>

<template>
  <AButton>Save changes</AButton>
</template>
```

## Auto-import

With `unplugin-vue-components`, add the resolver and skip the imports:

```ts
import { AtlairResolver } from '@atlair/vue/resolver'
import Components from 'unplugin-vue-components/vite'

export default {
  plugins: [Components({ resolvers: [AtlairResolver()] })],
}
```
