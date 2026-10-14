<script setup lang="ts">
const { data: sections } = await useSections()
const route = useRoute()
</script>

<template>
  <nav aria-label="Documentation" class="flex flex-col gap-6 text-sm">
    <div v-for="section in sections" :key="section.title">
      <h2 class="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-fg-muted">{{ section.title }}</h2>
      <ul class="flex flex-col gap-0.5">
        <li v-for="item in section.items" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="block rounded-base px-2 py-1.5 text-fg-muted hover:bg-bg-subtle hover:text-fg"
            :aria-current="route.path === item.path ? 'page' : undefined"
            :class="route.path === item.path && 'bg-bg-subtle font-medium text-fg'"
          >
            {{ item.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
