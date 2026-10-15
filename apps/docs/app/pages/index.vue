<script setup lang="ts">
import { contrast } from '@atlair/tokens/contrast'
import tokens from '@atlair/tokens/tokens.json'
import { AButton } from '@atlair/vue/button'
import manifest from '@atlair/vue/manifest.json'
import { ref } from 'vue'

const command = 'pnpm add @atlair/vue @atlair/tokens'
const copied = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(command)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

useSeoMeta({ title: 'Atlair Design', description: "Atlair's open-source Vue 3 design system." })

const highlights = ['Built on Reka UI', 'Tailwind CSS 4 tokens', 'Light and dark', 'Typed docs for agents']

const entries = Object.entries(
  manifest.components.reduce<Record<string, string[]>>((groups, component) => {
    ;(groups[component.entry] ??= []).push(component.name)
    return groups
  }, {}),
).map(([entry, names]) => ({ entry, name: entry.replace('@atlair/vue/', ''), names }))

type Entry = { $value: unknown }

const light = tokens.semantic.light.color as Record<string, Entry>
const dark = tokens.semantic.dark.color as Record<string, Entry>
const semantic = Object.keys(light)
const swatches = semantic.filter((name) => /^#[0-9a-f]{6}$/i.test(String(light[name]!.$value)))

const ratio = (values: Record<string, Entry>) => contrast(String(values.fg!.$value), String(values.bg!.$value)).toFixed(1)

const outputs = [
  { file: 'theme.css', detail: 'Tailwind 4 @theme' },
  { file: 'tokens.css', detail: 'CSS variables' },
  { file: 'fonts.css', detail: 'Spline Sans' },
  { file: 'tokens.json', detail: 'Typed values' },
]

const { data: guides } = await useAsyncData('home-guides', () =>
  queryCollection('docs').select('title', 'description', 'path').all(),
)
</script>

<template>
  <main id="content" tabindex="-1" class="outline-none">
    <section class="mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-20 text-center sm:pt-28">
      <span class="rounded-base border border-border px-3 py-1 font-mono text-xs text-fg">
        Atlair Design &middot; Pre-release
      </span>
      <h1
        class="mt-8 font-display text-[clamp(3.25rem,10vw,7.5rem)] leading-[0.92] tracking-[-0.02em] text-fg"
      >
        The parts Atlair is built from.
      </h1>
      <p class="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted sm:text-xl">
        Accessible Vue 3 components and design tokens, taken from Atlair&rsquo;s own products. For people and for
        coding agents.
      </p>
      <AButton as-child size="lg" variant="solid" color="neutral" class="mt-10 px-6">
        <NuxtLink to="/docs/installation">
          Start building
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="ml-2 size-4"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </NuxtLink>
      </AButton>
      <div
        class="mt-5 flex max-w-full items-center gap-3 rounded-base border border-border py-1 pl-3 pr-1 font-mono text-sm text-fg-muted"
      >
        <code class="truncate">{{ command }}</code>
        <ClientOnly>
          <button
            type="button"
            class="rounded-base border border-border px-1.5 py-0.5 text-xs transition-colors hover:bg-bg-subtle hover:text-fg"
            @click="copy"
          >
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </ClientOnly>
      </div>
      <ul class="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-fg-muted">
        <li v-for="item in highlights" :key="item" class="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-4 text-success"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          {{ item }}
        </li>
      </ul>
    </section>

    <section aria-labelledby="overview" class="border-t border-border bg-bg-frame/40 px-5 py-16 sm:px-10">
      <div class="mx-auto max-w-6xl">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="eyebrow">Overview</p>
            <h2 id="overview" class="mt-2 text-3xl font-semibold tracking-tight text-fg">What ships today</h2>
            <p class="mt-2 flex flex-wrap items-center gap-x-2 font-mono text-sm text-fg-muted">
              <span class="flex items-center gap-2 text-fg">
                <span aria-hidden="true" class="size-2 rounded-full bg-success" />
                Pre-release
              </span>
              <span aria-hidden="true">/</span>
              <span>{{ manifest.components.length }} components</span>
              <span aria-hidden="true">/</span>
              <span>{{ semantic.length }} semantic tokens</span>
            </p>
          </div>
          <AButton as-child variant="outline" color="neutral">
            <NuxtLink to="/tokens">Browse the tokens</NuxtLink>
          </AButton>
        </div>

        <dl
          class="mt-8 grid divide-y divide-border rounded-lg border border-border bg-bg md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          <div class="p-6">
            <dt class="eyebrow">Components &middot; Vue</dt>
            <dd class="mt-3 font-mono text-3xl text-fg">{{ manifest.components.length }}</dd>
            <dd class="mt-1 text-sm text-fg-muted">across {{ entries.length }} entry points</dd>
          </div>
          <div class="p-6">
            <dt class="eyebrow">Semantic colours</dt>
            <dd class="mt-3 flex gap-1" aria-hidden="true">
              <span
                v-for="name in swatches"
                :key="name"
                class="h-8 flex-1 rounded-[3px] shadow-[inset_0_0_0_1px_var(--a-border)]"
                :style="{ backgroundColor: String(light[name]!.$value) }"
              />
            </dd>
            <dd class="mt-2 text-sm text-fg-muted">{{ semantic.length }} names, each with a light and dark value</dd>
          </div>
          <div class="p-6">
            <dt class="eyebrow">Contrast &middot; fg on bg</dt>
            <dd class="mt-3 font-mono text-3xl text-fg">{{ ratio(light) }}:1</dd>
            <dd class="mt-1 text-sm text-fg-muted">light, and {{ ratio(dark) }}:1 in dark</dd>
          </div>
        </dl>

        <div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <h3 class="eyebrow mb-4">Packages</h3>
            <div class="grid gap-4 md:grid-cols-2">
              <article class="overflow-hidden rounded-lg border border-border bg-bg">
                <header class="flex items-center justify-between border-b border-border px-5 py-4">
                  <h4 class="font-semibold text-fg">@atlair/vue</h4>
                  <span class="font-mono text-xs text-fg-muted">{{ entries.length }} entries</span>
                </header>
                <ul class="divide-y divide-border">
                  <li v-for="entry in entries" :key="entry.entry" class="px-5 py-3">
                    <div class="flex items-center gap-3">
                      <span aria-hidden="true" class="size-2 shrink-0 rounded-full bg-success" />
                      <span class="whitespace-nowrap font-medium text-fg">{{ entry.name }}</span>
                      <span class="ml-auto whitespace-nowrap font-mono text-xs text-fg-muted">
                        &times;{{ entry.names.length }}
                      </span>
                    </div>
                    <p class="mt-1 truncate pl-5 font-mono text-xs text-fg-muted">{{ entry.names.join(' · ') }}</p>
                  </li>
                </ul>
              </article>
              <article class="self-start overflow-hidden rounded-lg border border-border bg-bg">
                <header class="flex items-center justify-between border-b border-border px-5 py-4">
                  <h4 class="font-semibold text-fg">@atlair/tokens</h4>
                  <span class="font-mono text-xs text-fg-muted">{{ outputs.length }} outputs</span>
                </header>
                <ul class="divide-y divide-border">
                  <li v-for="output in outputs" :key="output.file" class="flex items-center gap-3 px-5 py-3">
                    <span aria-hidden="true" class="size-2 shrink-0 rounded-full bg-success" />
                    <code class="font-mono text-sm text-fg">{{ output.file }}</code>
                    <span class="ml-auto text-sm text-fg-muted">{{ output.detail }}</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
          <div>
            <h3 class="eyebrow mb-4">Guides</h3>
            <ul class="divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg">
              <li v-for="guide in guides" :key="guide.path">
                <NuxtLink :to="guide.path" class="flex gap-3 px-5 py-4 transition-colors hover:bg-bg-subtle">
                  <span aria-hidden="true" class="mt-2 size-2 shrink-0 rounded-full bg-success" />
                  <span class="min-w-0">
                    <span class="flex items-center gap-1.5 font-medium text-fg">
                      {{ guide.path === '/docs' ? 'Introduction' : guide.title }}
                      <span aria-hidden="true" class="text-fg-muted">&rarr;</span>
                    </span>
                    <span class="mt-0.5 block text-sm text-fg-muted">{{ guide.description }}</span>
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
