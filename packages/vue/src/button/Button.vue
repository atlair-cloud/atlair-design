<script setup lang="ts">
import { Primitive, useForwardExpose } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '../internal/cn.ts'
import Spinner from '../internal/Spinner.vue'
import type { Size } from '../internal/tv.ts'
import { buttonRecipe } from './button.recipe.ts'
import type { ButtonColor, ButtonUi, ButtonVariant } from './types.ts'

const props = withDefaults(
  defineProps<{
    as?: string
    asChild?: boolean
    variant?: ButtonVariant
    color?: ButtonColor
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    block?: boolean
    ui?: ButtonUi
    class?: string
  }>(),
  {
    as: 'button',
    asChild: false,
    variant: 'solid',
    color: 'accent',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    block: false,
    ui: () => ({}),
    class: undefined,
  },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const { forwardRef } = useForwardExpose()

const isNative = computed(() => props.as === 'button')
const inert = computed(() => props.disabled || props.loading)

const slots = computed(() =>
  buttonRecipe({ variant: props.variant, color: props.color, size: props.size, block: props.block, loading: props.loading }),
)

const onClick = (event: MouseEvent) => {
  if (inert.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <Primitive
    :ref="forwardRef"
    :as="as"
    :as-child="asChild"
    :type="isNative ? type : undefined"
    :disabled="isNative && disabled ? true : undefined"
    :aria-disabled="!isNative && inert ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :tabindex="!isNative && disabled ? -1 : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :class="cn(slots.base(), ui.base, props.class)"
    @click="onClick"
  >
    <slot v-if="asChild" />
    <template v-else>
      <span v-if="$slots.leading" :class="cn(slots.leading(), ui.leading)">
        <slot name="leading" />
      </span>
      <span :class="cn(slots.label(), ui.label)">
        <slot />
      </span>
      <span v-if="$slots.trailing" :class="cn(slots.trailing(), ui.trailing)">
        <slot name="trailing" />
      </span>
      <span v-if="loading" :class="cn(slots.spinner(), ui.spinner)">
        <Spinner />
      </span>
    </template>
  </Primitive>
</template>
