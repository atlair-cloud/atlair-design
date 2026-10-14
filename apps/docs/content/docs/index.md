---
title: Introduction
description: What Atlair Design is, and where it stands today.
---

Atlair Design is an open-source Vue 3 design system. It turns the interface that Atlair's own products ship into
packages any Vue app can install.

## Packages

- **`@atlair/tokens`** holds the design tokens: colours, radius, shadows, motion and the Spline Sans font. They
  are written once as W3C Design Tokens and built into CSS variables, a Tailwind 4 theme, typed values and JSON.
- **`@atlair/vue`** holds the components, built on [Reka UI](https://reka-ui.com) and Tailwind CSS 4. Apps
  import from `@atlair/vue` only, never from Reka UI.

## Principles

- **Semantic tokens only.** Components read names like `bg`, `fg-muted` and `accent`, never a raw colour, so
  light and dark come from the tokens.
- **State lives in data attributes.** Components style from `data-*` attributes such as `data-disabled`, not
  from JavaScript class toggles.
- **Wrong use fails the type check.** Props are unions, and every prop, slot and event has a typed
  description.
- **Made for agents too.** The same descriptions feed a manifest that coding agents can read.

## Status

This is a pre-release. The tokens, the build, and the package layout are in place. The first components are
still being written, and nothing is published to npm yet. Browse the [tokens](/tokens) to see what exists today.
