<script setup lang="ts">
const links = [
  { label: 'Docs', to: '/docs' },
  { label: 'Tokens', to: '/tokens' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
    <div class="mx-auto flex h-14 max-w-[88rem] items-center gap-6 px-4 lg:px-6">
      <MobileNav />
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-accent">
        <span class="size-3 rounded-sm bg-accent" aria-hidden="true" />
        Atlair Design
      </NuxtLink>
      <nav aria-label="Main" class="flex items-center gap-4 text-sm">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-fg-muted hover:text-fg"
          active-class="text-fg"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <div class="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
