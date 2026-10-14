import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, it } from 'node:test'

const root = new URL('../', import.meta.url).pathname
const output = join(root, '.output/public')

const sources = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return sources(path)
      return /\.(vue|ts)$/.test(entry.name) ? [path] : []
    }),
  )
  return nested.flat()
}

describe('docs site', () => {
  it('prerenders a docs page with the skip link, sidebar and "On this page"', async () => {
    const html = await readFile(join(output, 'docs/installation/index.html'), 'utf8')
    assert.match(html, /Skip to content/)
    assert.match(html, /aria-label="Documentation"/)
    assert.match(html, /aria-label="On this page"/)
    assert.match(html, /<h1[^>]*>Installation<\/h1>/)
  })

  it('never imports reka-ui or another UI kit in its own code', async () => {
    for (const file of await sources(join(root, 'app'))) {
      const code = await readFile(file, 'utf8')
      assert.doesNotMatch(code, /from ['"](reka-ui|@nuxt\/ui|vuetify|element-plus|primevue)/, `${file} imports a UI kit`)
    }
  })

  it('serves a 404 page and does not generate pages that have no content', () => {
    assert.ok(existsSync(join(output, '404.html')))
    assert.ok(!existsSync(join(output, 'docs/does-not-exist/index.html')))
  })
})
