import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { load } from '../internal/load.ts'

it('warns in development when the aria-label is empty', async () => {
  const AIconButton = await load('icon-button', 'AIconButton')
  const warnings: string[] = []
  const app = createSSRApp({ render: () => h(AIconButton, { ariaLabel: '  ' }, () => 'x') })
  app.config.warnHandler = (message) => warnings.push(message)
  await renderToString(app)
  assert.ok(warnings.some((message) => message.includes('non-empty aria-label')))
})
