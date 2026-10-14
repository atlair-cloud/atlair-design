import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { load } from '../internal/load.ts'

const render = async (props: Record<string, unknown>, child: () => unknown = () => 'Save') => {
  const AButton = await load('button', 'AButton')
  return renderToString(createSSRApp({ render: () => h(AButton, props, child) }))
}

it('renders a plain button, and a single link with as-child', async () => {
  assert.match(await render({}), /<button type="button"[^>]*>[\s\S]*Save[\s\S]*<\/button>/)
  const html = await render({ asChild: true }, () => h('a', { href: '/x' }, 'Go'))
  assert.match(html, /^<a [^>]*href="\/x"/)
  assert.doesNotMatch(html, /<button/)
})

it('marks a disabled and a loading button so neither can be activated', async () => {
  const disabled = await render({ disabled: true })
  assert.match(disabled, /\bdisabled\b/)
  assert.match(disabled, /data-disabled/)
  const loading = await render({ loading: true })
  assert.match(loading, /aria-busy="true"/)
  assert.match(loading, /data-loading/)
  assert.match(loading, /animate-spin/)
  assert.doesNotMatch(loading, /\sdisabled\b/)
})
