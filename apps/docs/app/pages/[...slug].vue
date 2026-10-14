<script setup lang="ts">
import { AButton } from '@atlair/vue/button'

const route = useRoute()

const { data: page } = await useAsyncData(
  () => `page-${route.path}`,
  () => queryCollection('docs').path(route.path).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(
  () => `surround-${route.path}`,
  () => queryCollectionItemSurroundings('docs', route.path, { fields: ['title', 'description'] }),
)

useSeoMeta({
  title: () => `${page.value?.title} | Atlair Design`,
  description: () => page.value?.description,
})

const links = computed(() => page.value?.body.toc?.links ?? [])
const previous = computed(() => surround.value?.[0])
const next = computed(() => surround.value?.[1])
</script>

<template>
  <div
    class="mx-auto grid max-w-[88rem] gap-10 px-4 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-6 xl:grid-cols-[14rem_minmax(0,1fr)_13rem]"
  >
    <aside class="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto py-8 lg:block">
      <SidebarNav />
    </aside>
    <main id="content" tabindex="-1" class="min-w-0 py-8 outline-none">
      <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-1.5 text-sm text-fg-muted">
        <NuxtLink to="/docs" class="hover:text-fg">Docs</NuxtLink>
        <template v-if="route.path !== '/docs'">
          <span aria-hidden="true">/</span>
          <span aria-current="page" class="text-fg">{{ page?.title }}</span>
        </template>
      </nav>
      <h1 class="text-3xl font-semibold tracking-tight text-accent">{{ page?.title }}</h1>
      <p v-if="page?.description" class="mt-2 text-lg text-fg-muted">{{ page.description }}</p>
      <article
        class="prose mt-8 max-w-none [--tw-prose-body:var(--a-fg)] [--tw-prose-bold:var(--a-fg)] [--tw-prose-bullets:var(--a-fg-muted)] [--tw-prose-code:var(--a-fg)] [--tw-prose-counters:var(--a-fg-muted)] [--tw-prose-headings:var(--a-fg)] [--tw-prose-hr:var(--a-border)] [--tw-prose-lead:var(--a-fg-muted)] [--tw-prose-links:var(--a-accent)] [--tw-prose-pre-bg:var(--a-bg-subtle)] [--tw-prose-pre-code:var(--a-fg)] [--tw-prose-quotes:var(--a-fg-muted)] [--tw-prose-td-borders:var(--a-border)] [--tw-prose-th-borders:var(--a-border)] prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border [&_:is(h2,h3,h4)_a]:text-inherit [&_:is(h2,h3,h4)_a]:no-underline [&_.shiki_span]:text-[var(--shiki-light)] dark:[&_.shiki_span]:text-[var(--shiki-dark)]"
      >
        <ContentRenderer v-if="page" :value="page" />
      </article>
      <div class="mt-12 flex items-center justify-between gap-4 border-t border-border pt-6">
        <AButton v-if="previous" as-child size="sm" variant="outline" color="neutral">
          <NuxtLink :to="previous.path">&larr; {{ previous.title }}</NuxtLink>
        </AButton>
        <span v-else />
        <AButton v-if="next" as-child size="sm" variant="outline" color="neutral">
          <NuxtLink :to="next.path">{{ next.title }} &rarr;</NuxtLink>
        </AButton>
      </div>
    </main>
    <aside class="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto py-8 xl:block">
      <TocNav :links="links" />
    </aside>
  </div>
</template>
