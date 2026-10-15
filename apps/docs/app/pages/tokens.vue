<script setup lang="ts">
import { contrast } from '@atlair/tokens/contrast'
import tokens from '@atlair/tokens/tokens.json'

useSeoMeta({
  title: 'Tokens | Atlair Design',
  description: 'Every semantic and primitive token, with its value and contrast in light and dark.',
})

type Entry = { $value: unknown }

const themes = [
  { name: 'Light', values: tokens.semantic.light.color as Record<string, Entry> },
  { name: 'Dark', values: tokens.semantic.dark.color as Record<string, Entry> },
]

const names = Object.keys(tokens.semantic.light.color)

const ratio = (values: Record<string, Entry>, name: string) => {
  const value = String(values[name]!.$value)
  const background = String(values.bg!.$value)
  return /^#[0-9a-f]{6}$/i.test(value) ? contrast(value, background).toFixed(2) : null
}

const ramps = Object.entries(tokens.primitive.color)
  .filter(([name]) => ['atlair', 'slate', 'status'].includes(name))
  .map(([name, group]) => ({
    name,
    steps: Object.entries(group as Record<string, Entry>).filter(([, token]) => typeof token.$value === 'string'),
  }))

const other = [
  ['Radius', tokens.primitive.radius],
  ['Easing', tokens.primitive.easing],
  ['Duration', tokens.primitive.duration],
] as const

const links = [
  { id: 'semantic', text: 'Semantic colours', depth: 2 },
  { id: 'primitive', text: 'Primitive colours', depth: 2 },
  ...other.map(([title]) => ({ id: title.toLowerCase(), text: title, depth: 2 })),
]
</script>

<template>
  <DocsShell>
    <p class="eyebrow">Foundations</p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight text-fg sm:text-[2.75rem]">Tokens</h1>
    <p class="mt-3 max-w-2xl text-lg text-fg-muted">
      Components use the semantic tokens. The ratio is each colour against the background of its own theme.
    </p>

    <h2 id="semantic" class="mt-12 scroll-mt-6 border-t border-border pt-8 text-xl font-semibold text-fg">
      Semantic colours
    </h2>
    <div class="mt-5 grid gap-4 2xl:grid-cols-2">
      <section
        v-for="theme in themes"
        :key="theme.name"
        class="overflow-hidden rounded-lg"
        :style="{
          backgroundColor: String(theme.values.bg!.$value),
          color: String(theme.values.fg!.$value),
          boxShadow: `0 0 0 1px ${String(theme.values.border!.$value)}`,
        }"
      >
        <header
          class="flex items-center justify-between border-b px-5 py-3"
          :style="{ borderColor: String(theme.values.border!.$value) }"
        >
          <h3 class="font-semibold">{{ theme.name }}</h3>
          <span class="font-mono text-xs" :style="{ color: String(theme.values['fg-muted']!.$value) }">
            {{ names.length }} tokens
          </span>
        </header>
        <ul>
          <li
            v-for="name in names"
            :key="name"
            class="flex items-center gap-3 border-b px-5 py-2 text-sm last:border-b-0"
            :style="{ borderColor: String(theme.values.border!.$value) }"
          >
            <span
              class="size-6 shrink-0 rounded-[3px]"
              :style="{
                backgroundColor: String(theme.values[name]!.$value),
                boxShadow: `inset 0 0 0 1px ${String(theme.values.border!.$value)}`,
              }"
              aria-hidden="true"
            />
            <span class="w-32 font-medium">{{ name }}</span>
            <code class="truncate font-mono text-xs" :style="{ color: String(theme.values['fg-muted']!.$value) }">
              {{ theme.values[name]?.$value }}
            </code>
            <span
              v-if="ratio(theme.values, name)"
              class="ml-auto font-mono text-xs tabular-nums"
              :style="{ color: String(theme.values['fg-muted']!.$value) }"
            >
              {{ ratio(theme.values, name) }}:1
            </span>
          </li>
        </ul>
      </section>
    </div>

    <h2 id="primitive" class="mt-12 scroll-mt-6 border-t border-border pt-8 text-xl font-semibold text-fg">
      Primitive colours
    </h2>
    <section v-for="ramp in ramps" :key="ramp.name" class="mt-6">
      <h3 class="eyebrow mb-3">{{ ramp.name }}</h3>
      <ul class="grid grid-cols-3 gap-2 sm:grid-cols-6 xl:grid-cols-11">
        <li v-for="[step, token] in ramp.steps" :key="step" class="text-xs">
          <span
            class="block h-12 rounded-base shadow-[inset_0_0_0_1px_var(--a-border)]"
            :style="{ backgroundColor: String(token.$value) }"
            aria-hidden="true"
          />
          <span class="mt-1.5 block font-medium text-fg">{{ step }}</span>
          <code class="font-mono text-fg-muted">{{ token.$value }}</code>
        </li>
      </ul>
    </section>

    <section v-for="[title, group] in other" :key="title">
      <h2 :id="title.toLowerCase()" class="mt-12 scroll-mt-6 border-t border-border pt-8 text-xl font-semibold text-fg">
        {{ title }}
      </h2>
      <ul class="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
        <li v-for="(token, name) in group" :key="name" class="flex items-center gap-3 px-5 py-2.5 text-sm">
          <span class="w-40 font-medium text-fg">{{ name }}</span>
          <code class="truncate font-mono text-xs text-fg-muted">{{ (token as Entry).$value }}</code>
        </li>
      </ul>
    </section>

    <template #aside>
      <TocNav :links="links" />
    </template>
  </DocsShell>
</template>
