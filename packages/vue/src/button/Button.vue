<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '../internal/cn.ts'
import type { Size } from '../internal/tv.ts'
import { buttonRecipe } from './button.recipe.ts'

const props = withDefaults(
  defineProps<{
    as?: string
    asChild?: boolean
    size?: Size
    disabled?: boolean
    class?: string
  }>(),
  { as: 'button', asChild: false, size: 'md', disabled: false, class: undefined },
)

const classes = computed(() => cn(buttonRecipe({ size: props.size }), props.class))
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="classes"
    :disabled="disabled || undefined"
    :data-disabled="disabled ? '' : undefined"
  >
    <slot />
  </Primitive>
</template>
