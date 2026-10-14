import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { load } from '../internal/load.ts'

it('renders the app with the toast viewport next to it', async () => {
  const AApp = await load('app', 'AApp')
  const html = await renderToString(createSSRApp({ render: () => h(AApp, null, () => h('main', 'Content')) }))
  assert.match(html, /<main>Content<\/main>/)
  assert.match(html, /Notifications/)
})
