<script setup lang="ts">
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
const pager = computed(() =>
  [
    { label: 'Previous', item: surround.value?.[0], align: 'text-left' },
    { label: 'Next', item: surround.value?.[1], align: 'text-right sm:col-start-2' },
  ].filter((entry) => entry.item),
)
</script>

<template>
  <DocsShell>
    <nav aria-label="Breadcrumb" class="eyebrow flex items-center gap-2">
      <NuxtLink to="/docs" class="hover:text-fg">Docs</NuxtLink>
      <template v-if="route.path !== '/docs'">
        <span aria-hidden="true">/</span>
        <span aria-current="page" class="text-fg">{{ page?.title }}</span>
      </template>
    </nav>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight text-fg sm:text-[2.75rem]">{{ page?.title }}</h1>
    <p v-if="page?.description" class="mt-3 max-w-2xl text-lg text-fg-muted">{{ page.description }}</p>
    <article class="prose prose-atlair mt-10 max-w-3xl">
      <ContentRenderer v-if="page" :value="page" />
    </article>
    <nav aria-label="Pagination" class="mt-16 grid max-w-3xl gap-3 sm:grid-cols-2">
      <NuxtLink
        v-for="entry in pager"
        :key="entry.label"
        :to="entry.item!.path"
        class="group rounded-lg border border-border px-5 py-4 transition-colors hover:bg-bg-subtle"
        :class="entry.align"
      >
        <span class="eyebrow block">{{ entry.label }}</span>
        <span class="mt-1 block font-medium text-fg">
          {{ entry.label === 'Previous' ? `← ${entry.item!.title}` : `${entry.item!.title} →` }}
        </span>
      </NuxtLink>
    </nav>
    <template #aside>
      <TocNav :links="links" />
    </template>
  </DocsShell>
</template>
