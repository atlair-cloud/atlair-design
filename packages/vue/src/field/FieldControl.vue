<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useFieldControl } from './context.ts'

const props = withDefaults(defineProps<{ as?: string; asChild?: boolean; class?: string }>(), {
  as: 'input',
  asChild: false,
  class: undefined,
})

const control = useFieldControl()
</script>

<template>
  <Primitive :as="as" :as-child="asChild" v-bind="control" :class="props.class">
    <slot />
  </Primitive>
</template>
