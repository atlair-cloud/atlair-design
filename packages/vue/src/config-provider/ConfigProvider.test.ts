import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { load } from '../internal/load.ts'

it('renders its children inside an element that carries the direction', async () => {
  const AConfigProvider = await load('config-provider', 'AConfigProvider')
  const html = await renderToString(
    createSSRApp({ render: () => h(AConfigProvider, { dir: 'rtl' }, () => h('p', 'مرحبا')) }),
  )
  assert.match(html, /<div dir="rtl" class="contents">/)
  assert.match(html, /<p>مرحبا<\/p>/)
})
