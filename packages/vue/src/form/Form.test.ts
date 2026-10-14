import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { load } from '../internal/load.ts'

const clean = (html: string) => html.replace(/<!--[\[\]]-->/g, '')

it('shows an error on the matching field only and announces it', async () => {
  const [AForm, AField, AFieldControl, AFieldError, AFieldLabel] = await Promise.all([
    load('form', 'AForm'),
    load('field', 'AField'),
    load('field', 'AFieldControl'),
    load('field', 'AFieldError'),
    load('field', 'AFieldLabel'),
  ])
  const field = (name: string) =>
    h(AField, { name }, () => [h(AFieldLabel, null, () => name), h(AFieldControl), h(AFieldError)])
  const html = clean(await renderToString(
    createSSRApp({
      render: () => h(AForm, { errors: { email: 'Already taken.' } }, () => [field('name'), field('email')]),
    }),
  ))
  const [name, email] = html.split('<div').filter((part) => part.includes('<input'))
  assert.doesNotMatch(name ?? '', /aria-invalid|role="alert"/)
  assert.match(email ?? '', /aria-invalid="true"/)
  assert.match(email ?? '', /role="alert"[^>]*>Already taken\./)
  const errorId = email?.match(/<p[^>]*id="([^"]+)"[^>]*role="alert"/)?.[1] ?? email?.match(/id="([^"]+)"[^>]*role="alert"/)?.[1]
  assert.ok(errorId)
  assert.match(email ?? '', new RegExp(`aria-describedby="[^"]*${errorId}`))
})
