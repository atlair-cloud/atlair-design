<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { nextTick, ref } from 'vue'
import { z } from 'zod'
import { AButton } from '../../button/index.ts'
import { AField, AFieldControl, AFieldError, AFieldLabel } from '../../field/index.ts'
import { AForm } from '../index.ts'

const schema = z.object({
  name: z.string().min(1, 'Enter your name.'),
  email: z.email('Enter a valid email address.'),
})

const form = useForm({
  defaultValues: { name: '', email: '' },
  validators: { onSubmit: schema },
  onSubmit: () => undefined,
})

const formEl = ref<InstanceType<typeof AForm>>()
const input =
  'h-9 w-full rounded-base border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-fg-muted focus-visible:ring-2 focus-visible:ring-ring data-[disabled]:opacity-50 data-[invalid]:border-danger'

const submit = async () => {
  await form.handleSubmit()
  await nextTick()
  formEl.value?.focusFirstInvalid()
}

const message = (errors: unknown[]) => {
  const first = errors[0] as { message?: string } | undefined
  return first?.message
}
</script>

<template>
  <AForm ref="formEl" novalidate class="flex max-w-sm flex-col gap-4" @submit.prevent="submit">
    <form.Field name="name">
      <template #default="{ field }">
        <AField name="name" :error="message(field.state.meta.errors)">
          <AFieldLabel>Name</AFieldLabel>
          <AFieldControl
            :value="field.state.value"
            :class="input"
            @input="field.handleChange(($event.target as HTMLInputElement).value)"
          />
          <AFieldError />
        </AField>
      </template>
    </form.Field>
    <form.Field name="email">
      <template #default="{ field }">
        <AField name="email" :error="message(field.state.meta.errors)">
          <AFieldLabel>Email</AFieldLabel>
          <AFieldControl
            type="email"
            :value="field.state.value"
            :class="input"
            @input="field.handleChange(($event.target as HTMLInputElement).value)"
          />
          <AFieldError />
        </AField>
      </template>
    </form.Field>
    <AButton type="submit">Create account</AButton>
  </AForm>
</template>
