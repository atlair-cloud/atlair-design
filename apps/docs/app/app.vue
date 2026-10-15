<script setup lang="ts">
import { AApp } from '@atlair/vue/app'
</script>

<template>
  <AApp>
    <div class="flex min-h-screen flex-col bg-bg-frame bg-dots font-sans text-fg antialiased">
      <a
        href="#content"
        class="sr-only rounded-base bg-accent px-3 py-2 text-accent-fg focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div class="flex flex-1 flex-col px-2 pb-2 sm:px-4 sm:pb-4">
        <div class="flex-1 rounded-xl bg-bg shadow-shell sm:rounded-2xl">
          <NuxtPage />
        </div>
      </div>
    </div>
  </AApp>
</template>
