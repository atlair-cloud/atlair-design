<script setup lang="ts">
import { ToastProvider, ToastViewport, TooltipProvider } from 'reka-ui'
import { AConfigProvider } from '../config-provider/index.ts'
import type { ConfigProps } from '../config-provider/types.ts'
import { appRecipe } from './app.recipe.ts'

withDefaults(defineProps<ConfigProps>(), {
  dir: undefined,
  locale: 'en',
  reducedMotion: 'user',
  teleportTo: undefined,
  nonce: undefined,
})

const { viewport } = appRecipe()
</script>

<template>
  <AConfigProvider :dir="dir" :locale="locale" :reduced-motion="reducedMotion" :teleport-to="teleportTo" :nonce="nonce">
    <TooltipProvider>
      <ToastProvider>
        <slot />
        <ToastViewport :class="viewport()" />
      </ToastProvider>
    </TooltipProvider>
  </AConfigProvider>
</template>
