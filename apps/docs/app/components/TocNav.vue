<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type Link = { id: string; text: string; depth: number; children?: Link[] }

const props = defineProps<{ links: Link[] }>()

const flat = computed(() => props.links.flatMap((link) => [link, ...(link.children ?? [])]))
const active = ref('')
let observer: IntersectionObserver | undefined

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) active.value = entry.target.id
    },
    { rootMargin: '-80px 0px -70% 0px' },
  )
  for (const link of flat.value) {
    const heading = document.getElementById(link.id)
    if (heading) observer.observe(heading)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav v-if="flat.length > 0" aria-label="On this page" class="text-sm">
    <h2 class="mb-2 text-xs font-medium uppercase tracking-wide text-fg-muted">On this page</h2>
    <ul class="flex flex-col gap-1.5">
      <li v-for="link in flat" :key="link.id" :class="link.depth > 2 && 'pl-3'">
        <a
          :href="`#${link.id}`"
          class="text-fg-muted hover:text-fg"
          :class="active === link.id && 'font-medium text-fg'"
          :aria-current="active === link.id ? 'location' : undefined"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
