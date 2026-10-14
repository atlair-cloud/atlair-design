<script setup lang="ts">
import { AButton } from '@atlair/vue/button'
import { useTheme } from '@atlair/vue/theme'

const { preference, setTheme } = useTheme()
const order = ['system', 'light', 'dark'] as const

const next = () => setTheme(order[(order.indexOf(preference.value) + 1) % order.length]!)
</script>

<template>
  <ClientOnly>
    <AButton
      size="sm"
      class="border border-border bg-transparent text-fg hover:bg-bg-subtle"
      :aria-label="`Theme: ${preference}. Switch theme`"
      @click="next"
    >
      {{ preference }}
    </AButton>
    <template #fallback>
      <span class="inline-block h-8 w-16" />
    </template>
  </ClientOnly>
</template>
