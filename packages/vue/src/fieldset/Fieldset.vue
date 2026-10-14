<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, provide } from 'vue'
import { cn } from '../internal/cn.ts'
import { fieldsetKey } from '../field/context.ts'
import { fieldsetRecipe } from './fieldset.recipe.ts'

const props = withDefaults(defineProps<{ as?: string; asChild?: boolean; disabled?: boolean; class?: string }>(), {
  as: 'fieldset',
  asChild: false,
  disabled: false,
  class: undefined,
})

provide(
  fieldsetKey,
  computed(() => props.disabled),
)

const { root } = fieldsetRecipe()
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :disabled="as === 'fieldset' && disabled ? true : undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="cn(root(), props.class)"
  >
    <slot />
  </Primitive>
</template>
