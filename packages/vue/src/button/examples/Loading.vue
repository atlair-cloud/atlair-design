<script setup lang="ts">
import { ref } from 'vue'
import { AButton } from '../index.ts'

const loading = ref(false)

const save = () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
</script>

<template>
  <AButton :loading="loading" @click="save">Save changes</AButton>
</template>
