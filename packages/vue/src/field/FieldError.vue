<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { cn } from '../internal/cn.ts'
import { useField } from './context.ts'
import { fieldRecipe } from './field.recipe.ts'

const props = withDefaults(defineProps<{ as?: string; asChild?: boolean; class?: string }>(), {
  as: 'p',
  asChild: false,
  class: undefined,
})

const field = useField()
const { error } = fieldRecipe()
</script>

<template>
  <Primitive
    v-if="field?.invalid.value && ($slots.default || field.message.value)"
    :as="as"
    :as-child="asChild"
    :id="field.errorId"
    role="alert"
    :class="cn(error(), props.class)"
  >
    <slot>{{ field.message.value }}</slot>
  </Primitive>
</template>
