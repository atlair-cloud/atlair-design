<script setup lang="ts">
import { AButton } from '@atlair/vue/button'
import { ref } from 'vue'

const command = 'pnpm add @atlair/vue'
const copied = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(command)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

useSeoMeta({ title: 'Atlair Design', description: "Atlair's open-source Vue 3 design system." })
</script>

<template>
  <main id="content" tabindex="-1" class="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center outline-none">
    <h1 class="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
      Accessible Vue components in Atlair's style
    </h1>
    <p class="mt-4 max-w-xl text-lg text-fg-muted">
      Design tokens and components built on Reka UI and Tailwind CSS 4, for people and for coding agents.
    </p>
    <div class="mt-8 flex items-center gap-3 rounded-base border border-border bg-bg-subtle py-2 pl-4 pr-2 font-mono text-sm">
      <code>{{ command }}</code>
      <ClientOnly>
        <AButton size="sm" class="border border-border bg-transparent text-fg hover:bg-bg" @click="copy">
          {{ copied ? 'Copied' : 'Copy' }}
        </AButton>
      </ClientOnly>
    </div>
    <p class="mt-3 text-sm text-fg-muted">Pre-release: not published to npm yet.</p>
    <div class="mt-8 flex gap-3">
      <AButton as-child>
        <NuxtLink to="/docs">Read the docs</NuxtLink>
      </AButton>
      <AButton as-child class="border border-border bg-transparent text-fg hover:bg-bg-subtle">
        <NuxtLink to="/tokens">Browse the tokens</NuxtLink>
      </AButton>
    </div>
  </main>
</template>
