<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { cn } from '../internal/cn.ts'
import { fieldsetRecipe } from './fieldset.recipe.ts'

const props = withDefaults(defineProps<{ as?: string; asChild?: boolean; class?: string }>(), {
  as: 'legend',
  asChild: false,
  class: undefined,
})

const { legend } = fieldsetRecipe()
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="cn(legend(), props.class)">
    <slot />
  </Primitive>
</template>
