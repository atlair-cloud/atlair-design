<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, nextTick, provide, ref, watch } from 'vue'
import { formKey, type FormErrors } from '../field/context.ts'

const props = withDefaults(
  defineProps<{ as?: string; asChild?: boolean; errors?: FormErrors; class?: string }>(),
  { as: 'form', asChild: false, errors: () => ({}), class: undefined },
)

const emit = defineEmits<{ submit: [event: SubmitEvent] }>()

const root = ref<{ $el: HTMLElement }>()

provide(formKey, { errors: computed(() => props.errors) })

const focusFirstInvalid = () => {
  const invalid = root.value?.$el.querySelector<HTMLElement>('[aria-invalid="true"]')
  invalid?.focus()
  return invalid
}

watch(
  () => props.errors,
  async (errors) => {
    if (Object.keys(errors).length === 0) return
    await nextTick()
    focusFirstInvalid()
  },
)

defineExpose({ focusFirstInvalid })
</script>

<template>
  <Primitive ref="root" :as="as" :as-child="asChild" :class="props.class" @submit="emit('submit', $event as SubmitEvent)">
    <slot />
  </Primitive>
</template>
