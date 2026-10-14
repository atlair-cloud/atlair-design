<script setup lang="ts">
import { ref } from 'vue'
import { AButton } from '../../button/index.ts'
import { AField, AFieldControl, AFieldError, AFieldLabel } from '../../field/index.ts'
import { AForm } from '../index.ts'

const errors = ref<Record<string, string>>({})
const input =
  'h-9 w-full rounded-base border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-fg-muted focus-visible:ring-2 focus-visible:ring-ring data-[disabled]:opacity-50 data-[invalid]:border-danger'

const submit = () => {
  errors.value = { email: 'That email is already registered.', name: 'Enter your name.' }
}
</script>

<template>
  <AForm :errors="errors" class="flex max-w-sm flex-col gap-4" @submit.prevent="submit">
    <AField name="name">
      <AFieldLabel>Name</AFieldLabel>
      <AFieldControl :class="input" />
      <AFieldError />
    </AField>
    <AField name="email">
      <AFieldLabel>Email</AFieldLabel>
      <AFieldControl type="email" :class="input" />
      <AFieldError />
    </AField>
    <AButton type="submit">Create account</AButton>
  </AForm>
</template>
