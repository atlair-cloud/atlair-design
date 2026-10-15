<script setup lang="ts">
import { AIconButton } from '@atlair/vue/icon-button'
import { useTheme } from '@atlair/vue/theme'

const { preference, setTheme } = useTheme()
const order = ['system', 'light', 'dark'] as const

const next = () => setTheme(order[(order.indexOf(preference.value) + 1) % order.length]!)
</script>

<template>
  <ClientOnly>
    <AIconButton :aria-label="`Theme: ${preference}. Switch theme`" @click="next">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-[18px]"
      >
        <path v-if="preference === 'dark'" d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        <template v-else-if="preference === 'light'">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </template>
        <template v-else>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </template>
      </svg>
    </AIconButton>
    <template #fallback>
      <span class="inline-block size-9" />
    </template>
  </ClientOnly>
</template>
