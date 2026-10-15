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
    <h2 class="eyebrow mb-3">On this page</h2>
    <ul class="flex flex-col border-l border-border">
      <li v-for="link in flat" :key="link.id">
        <a
          :href="`#${link.id}`"
          class="-ml-px block border-l py-1 pr-2 text-fg-muted transition-colors hover:text-fg"
          :class="[
            link.depth > 2 ? 'pl-6' : 'pl-3',
            active === link.id ? 'border-fg font-medium text-fg' : 'border-transparent',
          ]"
          :aria-current="active === link.id ? 'location' : undefined"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
