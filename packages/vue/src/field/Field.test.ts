import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { load } from '../internal/load.ts'

const clean = (html: string) => html.replace(/<!--[\[\]]-->/g, '')

it('links the label and the description to the control', async () => {
  const [AField, AFieldLabel, AFieldDescription, AFieldControl] = await Promise.all([
    load('field', 'AField'),
    load('field', 'AFieldLabel'),
    load('field', 'AFieldDescription'),
    load('field', 'AFieldControl'),
  ])
  const html = clean(await renderToString(
    createSSRApp({
      render: () =>
        h(AField, { name: 'email', required: true }, () => [
          h(AFieldLabel, null, () => 'Email'),
          h(AFieldDescription, null, () => 'Used for receipts'),
          h(AFieldControl),
        ]),
    }),
  ))
  const control = html.match(/<input[^>]*>/)?.[0] ?? ''
  const id = control.match(/\sid="([^"]+)"/)?.[1]
  assert.ok(id)
  assert.match(html, new RegExp(`<label[^>]*for="${id}"`))
  const describedBy = control.match(/aria-describedby="([^"]+)"/)?.[1]
  assert.ok(describedBy)
  assert.match(html, new RegExp(`<p[^>]*id="${describedBy}"[^>]*>Used for receipts`))
  assert.match(control, /name="email"/)
  assert.match(control, /\brequired\b/)
})
