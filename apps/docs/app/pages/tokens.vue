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
</script>

<template>
  <main id="content" tabindex="-1" class="mx-auto max-w-[88rem] px-4 py-8 outline-none lg:px-6">
    <h1 class="text-3xl font-semibold tracking-tight text-accent">Tokens</h1>
    <p class="mt-2 max-w-2xl text-lg text-fg-muted">
      Components use the semantic tokens. The ratio is each colour against the background of its own theme.
    </p>

    <h2 class="mt-10 text-xl font-semibold">Semantic colours</h2>
    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      <section
        v-for="theme in themes"
        :key="theme.name"
        class="rounded-base border p-4"
        :style="{
          backgroundColor: String(theme.values.bg!.$value),
          color: String(theme.values.fg!.$value),
          borderColor: String(theme.values.border!.$value),
        }"
      >
        <h3 class="mb-3 text-sm font-medium" :style="{ color: String(theme.values['fg-muted']!.$value) }">
          {{ theme.name }}
        </h3>
        <ul class="flex flex-col gap-2">
          <li v-for="name in names" :key="name" class="flex items-center gap-3 text-sm">
            <span
              class="size-8 shrink-0 rounded-base border"
              :style="{
                backgroundColor: String(theme.values[name]!.$value),
                borderColor: String(theme.values.border!.$value),
              }"
              aria-hidden="true"
            />
            <span class="w-36 font-medium">{{ name }}</span>
            <code :style="{ color: String(theme.values['fg-muted']!.$value) }">{{ theme.values[name]?.$value }}</code>
            <span
              v-if="ratio(theme.values, name)"
              class="ml-auto tabular-nums"
              :style="{ color: String(theme.values['fg-muted']!.$value) }"
            >
              {{ ratio(theme.values, name) }}:1
            </span>
          </li>
        </ul>
      </section>
    </div>

    <h2 class="mt-10 text-xl font-semibold">Primitive colours</h2>
    <section v-for="ramp in ramps" :key="ramp.name" class="mt-4">
      <h3 class="mb-2 text-sm font-medium text-fg-muted">{{ ramp.name }}</h3>
      <ul class="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
        <li v-for="[step, token] in ramp.steps" :key="step" class="text-xs">
          <span
            class="block h-10 rounded-base border border-border"
            :style="{ backgroundColor: String(token.$value) }"
            aria-hidden="true"
          />
          <span class="mt-1 block font-medium">{{ step }}</span>
          <code class="text-fg-muted">{{ token.$value }}</code>
        </li>
      </ul>
    </section>

    <section v-for="[title, group] in other" :key="title" class="mt-10">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
      <ul class="mt-3 flex flex-col gap-1 text-sm">
        <li v-for="(token, name) in group" :key="name" class="flex gap-3">
          <span class="w-40 font-medium">{{ name }}</span>
          <code class="text-fg-muted">{{ (token as Entry).$value }}</code>
        </li>
      </ul>
    </section>
  </main>
</template>
