<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { cn } from '../internal/cn.ts'
import { useField } from './context.ts'
import { fieldRecipe } from './field.recipe.ts'

const props = withDefaults(defineProps<{ as?: string; asChild?: boolean; class?: string }>(), {
  as: 'label',
  asChild: false,
  class: undefined,
})

const field = useField()
const { label } = fieldRecipe()
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :id="field?.labelId"
    :for="as === 'label' ? field?.controlId : undefined"
    :class="cn(label(), props.class)"
    :data-required="field?.required.value ? '' : undefined"
    :data-disabled="field?.disabled.value ? '' : undefined"
    :data-invalid="field?.invalid.value ? '' : undefined"
  >
    <slot />
    <span v-if="field?.required.value && !asChild" aria-hidden="true" class="ms-0.5 text-danger">*</span>
  </Primitive>
</template>
