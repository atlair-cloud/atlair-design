---
title: Theming
description: Light and dark mode, and how to override the tokens.
---

Every colour a component uses is a semantic token, and each one has a light and a dark value.

## Dark mode

Dark values apply under the `dark` class or the `data-theme="dark"` attribute, on the root element or on any
part of the page. Set either one from your own theme switch:

```ts
document.documentElement.dataset.theme = 'dark'
```

Both selectors also switch Tailwind's `dark:` variant, which `theme.css` defines for you.

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
