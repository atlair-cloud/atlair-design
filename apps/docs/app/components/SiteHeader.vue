<script setup lang="ts">
import { AButton } from '@atlair/vue/button'
import { AIconButton } from '@atlair/vue/icon-button'

const links = [
  { label: 'Introduction', to: '/docs' },
  { label: 'Installation', to: '/docs/installation' },
  { label: 'Theming', to: '/docs/theming' },
  { label: 'Tokens', to: '/tokens' },
]

const route = useRoute()
</script>

<template>
  <header class="sticky top-0 z-40 bg-bg-frame bg-dots text-fg-frame">
    <div class="mx-auto flex h-16 max-w-[88rem] items-center gap-3 px-4 sm:px-6">
      <MobileNav />
      <NuxtLink to="/" class="flex items-center gap-2.5 rounded-base">
        <img src="/logo.png" alt="" width="28" height="28" class="size-7" />
        <span class="text-lg font-semibold tracking-tight">Atlair</span>
        <span aria-hidden="true" class="text-fg-muted">/</span>
        <span class="font-medium text-fg-muted">Design</span>
      </NuxtLink>
      <nav aria-label="Main" class="mx-auto hidden items-center text-sm md:flex">
        <template v-for="(link, index) in links" :key="link.to">
          <span v-if="index > 0" aria-hidden="true" class="mx-1 h-4 w-px bg-fg-frame/15" />
          <NuxtLink
            :to="link.to"
            class="rounded-base px-3 py-1.5 text-fg-muted transition-colors hover:text-fg-frame"
            :class="route.path === link.to && 'text-fg-frame'"
            :aria-current="route.path === link.to ? 'page' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </nav>
      <div class="ml-auto flex items-center gap-1 md:ml-0">
        <AIconButton as-child aria-label="Atlair Design on GitHub">
          <a href="https://github.com/atlair-cloud/atlair-design" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-[18px]">
              <path
                d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
              />
            </svg>
          </a>
        </AIconButton>
        <ThemeToggle />
        <AButton as-child variant="solid" color="neutral" class="ml-2 hidden sm:inline-flex">
          <NuxtLink to="/docs/installation">Get started</NuxtLink>
        </AButton>
      </div>
    </div>
  </header>
</template>
