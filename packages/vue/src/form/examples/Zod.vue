<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { AButton } from '../../button/index.ts'
import { AField, AFieldControl, AFieldError, AFieldLabel } from '../../field/index.ts'
import { AForm } from '../index.ts'

const schema = z.object({
  name: z.string().min(1, 'Enter your name.'),
  email: z.email('Enter a valid email address.'),
})

const values = reactive({ name: '', email: '' })
const errors = ref<Record<string, string>>({})
const input =
  'h-9 w-full rounded-base border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-fg-muted focus-visible:ring-2 focus-visible:ring-ring data-[disabled]:opacity-50 data-[invalid]:border-danger'

const submit = () => {
  const result = schema.safeParse(values)
  errors.value = result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message]).reverse())
}
</script>

<template>
  <AForm :errors="errors" novalidate class="flex max-w-sm flex-col gap-4" @submit.prevent="submit">
    <AField name="name">
      <AFieldLabel>Name</AFieldLabel>
      <AFieldControl as-child>
        <input v-model="values.name" :class="input" />
      </AFieldControl>
      <AFieldError />
    </AField>
    <AField name="email">
      <AFieldLabel>Email</AFieldLabel>
      <AFieldControl as-child>
        <input v-model="values.email" type="email" :class="input" />
      </AFieldControl>
      <AFieldError />
    </AField>
    <AButton type="submit">Create account</AButton>
  </AForm>
</template>
