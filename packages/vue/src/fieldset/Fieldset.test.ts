import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { load } from '../internal/load.ts'

const clean = (html: string) => html.replace(/<!--[\[\]]-->/g, '')

it('disables the fields inside a disabled fieldset', async () => {
  const [AFieldset, AFieldsetLegend, AField, AFieldControl] = await Promise.all([
    load('fieldset', 'AFieldset'),
    load('fieldset', 'AFieldsetLegend'),
    load('field', 'AField'),
    load('field', 'AFieldControl'),
  ])
  const html = clean(await renderToString(
    createSSRApp({
      render: () =>
        h(AFieldset, { disabled: true }, () => [
          h(AFieldsetLegend, null, () => 'Billing'),
          h(AField, null, () => h(AFieldControl)),
        ]),
    }),
  ))
  assert.match(html, /<fieldset[^>]*\sdisabled/)
  assert.match(html, /<legend[^>]*>Billing<\/legend>/)
  assert.match(html, /<input[^>]*\sdisabled/)
  assert.match(html, /<input[^>]*data-disabled/)
})
