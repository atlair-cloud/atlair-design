<script setup lang="ts">
import { ref } from 'vue'
import { AField, AFieldControl, AFieldDescription, AFieldLabel } from '../index.ts'

const email = ref('')
const input =
  'h-9 w-full rounded-base border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-fg-muted focus-visible:ring-2 focus-visible:ring-ring data-[disabled]:opacity-50 data-[invalid]:border-danger'
</script>

<template>
  <AField name="email" required class="max-w-sm">
    <AFieldLabel>Email</AFieldLabel>
    <AFieldDescription>We only use it to send receipts.</AFieldDescription>
    <AFieldControl as-child>
      <input v-model="email" type="email" :class="input" />
    </AFieldControl>
  </AField>
</template>
