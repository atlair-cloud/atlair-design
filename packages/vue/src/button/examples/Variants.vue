<script setup lang="ts">
import { AButton } from '../index.ts'

const variants = ['solid', 'outline', 'ghost', 'link'] as const
const colors = ['accent', 'neutral', 'danger'] as const
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-3">
      <AButton v-for="color in colors" :key="color" :variant="variant" :color="color">{{ variant }} {{ color }}</AButton>
    </div>
  </div>
</template>
