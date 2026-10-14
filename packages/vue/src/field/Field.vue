<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject, provide, ref, useId } from 'vue'
import { cn } from '../internal/cn.ts'
import { fieldKey, fieldsetKey, formKey } from './context.ts'
import { fieldRecipe } from './field.recipe.ts'

const props = withDefaults(
  defineProps<{
    as?: string
    asChild?: boolean
    name?: string
    invalid?: boolean
    error?: string
    required?: boolean
    disabled?: boolean
    class?: string
  }>(),
  {
    as: 'div',
    asChild: false,
    name: undefined,
    invalid: false,
    error: undefined,
    required: false,
    disabled: false,
    class: undefined,
  },
)

const id = useId()
const fieldsetDisabled = inject(fieldsetKey, undefined)
const form = inject(formKey, undefined)

const message = computed(() => props.error ?? (props.name ? form?.errors.value[props.name] : undefined))
const invalid = computed(() => props.invalid || Boolean(message.value))
const disabled = computed(() => props.disabled || Boolean(fieldsetDisabled?.value))
const descriptions = ref(0)

const ids = {
  controlId: `${id}-control`,
  labelId: `${id}-label`,
  descriptionId: `${id}-description`,
  errorId: `${id}-error`,
}

provide(fieldKey, {
  ...ids,
  name: computed(() => props.name),
  invalid,
  required: computed(() => props.required),
  disabled,
  message,
  describedBy: computed(
    () =>
      [descriptions.value > 0 && ids.descriptionId, invalid.value && message.value && ids.errorId]
        .filter(Boolean)
        .join(' ') || undefined,
  ),
  registerDescription: () => {
    descriptions.value += 1
    return () => {
      descriptions.value -= 1
    }
  },
})

const { root } = fieldRecipe()
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(root(), props.class)"
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-required="required ? '' : undefined"
  >
    <slot />
  </Primitive>
</template>
