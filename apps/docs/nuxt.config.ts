import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-14',
  modules: ['@nuxt/content', '@nuxtjs/color-mode'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  colorMode: { classSuffix: '', dataValue: 'theme', preference: 'system', fallback: 'light' },
  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: { theme: { default: 'github-light', dark: 'github-dark' }, langs: ['bash', 'css', 'ts', 'vue', 'json'] },
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Atlair Design',
      link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }],
      meta: [{ name: 'description', content: "Atlair's open-source Vue 3 design system." }],
    },
  },
  nitro: { prerender: { crawlLinks: true, routes: ['/', '/docs'] } },
  devtools: { enabled: false },
  telemetry: false,
})
