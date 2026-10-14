<script setup lang="ts">
import { AButton } from '../../button/index.ts'
import { AConfigProvider } from '../index.ts'
</script>

<template>
  <AConfigProvider dir="rtl">
    <div class="flex gap-2">
      <AButton>First</AButton>
      <AButton>Second</AButton>
    </div>
  </AConfigProvider>
</template>
