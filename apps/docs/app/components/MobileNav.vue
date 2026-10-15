<script setup lang="ts">
import { AIconButton } from '@atlair/vue/icon-button'
import { ref, watch } from 'vue'

const dialog = ref<HTMLDialogElement>()
const route = useRoute()

watch(() => route.path, () => dialog.value?.close())
</script>

<template>
  <div class="lg:hidden">
    <AIconButton aria-label="Open navigation" class="-ml-2" @click="dialog?.showModal()">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        aria-hidden="true"
        class="size-[18px]"
      >
        <path d="M4 7h16M4 12h16M4 17h10" />
      </svg>
    </AIconButton>
    <dialog
      ref="dialog"
      aria-label="Navigation"
      class="m-0 h-full max-h-none w-72 max-w-[85vw] bg-bg-frame bg-dots p-2 text-fg backdrop:bg-overlay"
      @click="(event) => event.target === dialog && dialog?.close()"
    >
      <div class="flex h-full flex-col rounded-xl bg-bg shadow-shell">
        <div class="flex items-center justify-between border-b border-border px-4 py-3">
          <span class="eyebrow">Menu</span>
          <AIconButton aria-label="Close navigation" size="sm" @click="dialog?.close()">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              aria-hidden="true"
              class="size-4"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </AIconButton>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <SidebarNav />
        </div>
      </div>
    </dialog>
  </div>
</template>
