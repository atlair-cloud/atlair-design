<script setup lang="ts">
import { computed, warn, watchEffect } from 'vue'
import Button from '../button/Button.vue'
import type { ButtonColor, ButtonUi, ButtonVariant } from '../button/types.ts'
import { cn } from '../internal/cn.ts'
import type { Size } from '../internal/tv.ts'
import { iconButtonRecipe } from './icon-button.recipe.ts'

const props = withDefaults(
  defineProps<{
    'aria-label': string
    as?: string
    asChild?: boolean
    variant?: ButtonVariant
    color?: ButtonColor
    size?: Size
    loading?: boolean
    disabled?: boolean
    ui?: ButtonUi
    class?: string
  }>(),
  {
    as: 'button',
    asChild: false,
    variant: 'ghost',
    color: 'neutral',
    size: 'md',
    loading: false,
    disabled: false,
    ui: () => ({}),
    class: undefined,
  },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const classes = computed(() => cn(iconButtonRecipe({ size: props.size }), props.class))

const label = computed(() => (props as unknown as { ariaLabel?: string }).ariaLabel ?? '')

watchEffect(() => {
  if (!label.value.trim()) warn('AIconButton needs a non-empty aria-label, because it has no visible text.')
})
</script>

<template>
  <Button
    :as="as"
    :as-child="asChild"
    :variant="variant"
    :color="color"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :ui="ui"
    :class="classes"
    :aria-label="label"
    @click="emit('click', $event)"
  >
    <slot />
  </Button>
</template>
