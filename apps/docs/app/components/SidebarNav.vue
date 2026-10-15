<script setup lang="ts">
const { data: sections } = await useSections()
const route = useRoute()
</script>

<template>
  <nav aria-label="Documentation" class="flex flex-col gap-8 text-sm">
    <div v-for="section in sections" :key="section.title">
      <h2 class="eyebrow mb-3 px-3">{{ section.title }}</h2>
      <ul class="flex flex-col gap-px">
        <li v-for="item in section.items" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="group flex items-center gap-2.5 rounded-base px-3 py-1.5 text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
            :aria-current="route.path === item.path ? 'page' : undefined"
            :class="route.path === item.path && 'bg-bg-subtle font-medium text-fg'"
          >
            <span
              aria-hidden="true"
              class="size-1.5 shrink-0 rounded-full transition-colors"
              :class="route.path === item.path ? 'bg-success' : 'bg-border group-hover:bg-fg-muted'"
            />
            {{ item.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
