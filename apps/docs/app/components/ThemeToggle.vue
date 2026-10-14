<script setup lang="ts">
import { AButton } from '@atlair/vue/button'

const colorMode = useColorMode()
const order = ['system', 'light', 'dark']

const next = () => {
  colorMode.preference = order[(order.indexOf(colorMode.preference) + 1) % order.length]!
}
</script>

<template>
  <ClientOnly>
    <AButton
      size="sm"
      class="border border-border bg-transparent text-fg hover:bg-bg-subtle"
      :aria-label="`Theme: ${colorMode.preference}. Switch theme`"
      @click="next"
    >
      {{ colorMode.preference }}
    </AButton>
    <template #fallback>
      <span class="inline-block h-8 w-16" />
    </template>
  </ClientOnly>
</template>
