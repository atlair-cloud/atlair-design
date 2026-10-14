<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { ConfigProvider } from 'reka-ui'
import { computed, provide, useId } from 'vue'
import { reducedMotionKey } from './context.ts'
import type { ConfigProps } from './types.ts'

const props = withDefaults(defineProps<ConfigProps>(), {
  dir: undefined,
  locale: 'en',
  reducedMotion: 'user',
  teleportTo: undefined,
  nonce: undefined,
})

const preferred = usePreferredReducedMotion()

provide(
  reducedMotionKey,
  computed(() => props.reducedMotion === 'always' || (props.reducedMotion === 'user' && preferred.value === 'reduce')),
)
</script>

<template>
  <div :dir="dir" class="contents">
    <ConfigProvider :dir="dir ?? 'ltr'" :locale="locale" :teleport-to="teleportTo" :nonce="nonce" :use-id="useId">
      <slot />
    </ConfigProvider>
  </div>
</template>
