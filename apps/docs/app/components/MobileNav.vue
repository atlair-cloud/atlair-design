<script setup lang="ts">
import { AButton } from '@atlair/vue/button'
import { ref, watch } from 'vue'

const dialog = ref<HTMLDialogElement>()
const route = useRoute()

watch(() => route.path, () => dialog.value?.close())
</script>

<template>
  <div class="lg:hidden">
    <AButton
      size="sm"
      variant="outline" color="neutral"
      aria-label="Open navigation"
      @click="dialog?.showModal()"
    >
      Menu
    </AButton>
    <dialog
      ref="dialog"
      aria-label="Navigation"
      class="m-0 h-full max-h-none w-72 max-w-[85vw] border-r border-border bg-bg p-4 text-fg backdrop:bg-overlay"
      @click="(event) => event.target === dialog && dialog?.close()"
    >
      <div class="mb-4 flex justify-end">
        <AButton
          size="sm"
          variant="outline" color="neutral"
          @click="dialog?.close()"
        >
          Close
        </AButton>
      </div>
      <SidebarNav />
    </dialog>
  </div>
</template>
