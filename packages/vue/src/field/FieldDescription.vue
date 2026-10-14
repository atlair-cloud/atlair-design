<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { onBeforeUnmount } from 'vue'
import { cn } from '../internal/cn.ts'
import { useField } from './context.ts'
import { fieldRecipe } from './field.recipe.ts'

const props = withDefaults(defineProps<{ as?: string; asChild?: boolean; class?: string }>(), {
  as: 'p',
  asChild: false,
  class: undefined,
})

const field = useField()
const unregister = field?.registerDescription()
onBeforeUnmount(() => unregister?.())

const { description } = fieldRecipe()
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :id="field?.descriptionId" :class="cn(description(), props.class)">
    <slot />
  </Primitive>
</template>
