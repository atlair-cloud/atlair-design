<script setup lang="ts">
import { ref } from 'vue'
import { AField, AFieldControl, AFieldLabel } from '../../field/index.ts'
import { AFieldset, AFieldsetLegend } from '../index.ts'

const locked = ref(true)
const input =
  'h-9 w-full rounded-base border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-fg-muted focus-visible:ring-2 focus-visible:ring-ring data-[disabled]:opacity-50 data-[invalid]:border-danger'
</script>

<template>
  <AFieldset :disabled="locked" class="max-w-sm">
    <AFieldsetLegend>Billing address</AFieldsetLegend>
    <AField name="street">
      <AFieldLabel>Street</AFieldLabel>
      <AFieldControl :class="input" />
    </AField>
    <AField name="city">
      <AFieldLabel>City</AFieldLabel>
      <AFieldControl :class="input" />
    </AField>
  </AFieldset>
  <label class="mt-4 flex items-center gap-2 text-sm">
    <input v-model="locked" type="checkbox" />
    Locked
  </label>
</template>
