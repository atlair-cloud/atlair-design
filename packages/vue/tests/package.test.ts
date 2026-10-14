import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'node:test'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { build, type Rollup } from 'vite'
import pkg from '../package.json' with { type: 'json' }
import { componentEntries } from '../src/entries.ts'
import { AtlairResolver } from '../src/resolver.ts'

const root = fileURLToPath(new URL('../', import.meta.url))

const targets = (value: unknown): string[] =>
  typeof value === 'string' ? [value] : Object.values(value as Record<string, unknown>).flatMap(targets)

describe('package', () => {
  it('declares ESM only with css side effects', () => {
    assert.equal(pkg.type, 'module')
    assert.deepEqual(pkg.sideEffects, ['*.css'])
  })

  it('exposes the entry points from the ticket', () => {
    const keys = Object.keys(pkg.exports)
    for (const key of ['.', './button', './style.css', './manifest.json', './resolver']) {
      assert.ok(keys.includes(key), `missing export ${key}`)
    }
  })

  it('points every export at a built file', () => {
    for (const target of targets(pkg.exports)) {
      assert.ok(existsSync(`${root}${target}`), `${target} does not exist`)
    }
  })

  it('lists vue as the only peer besides tailwindcss and reka-ui as a dependency', () => {
    assert.deepEqual(Object.keys(pkg.peerDependencies).sort(), ['tailwindcss', 'vue'])
    for (const name of ['reka-ui', 'tailwind-variants', '@vueuse/core']) {
      assert.ok(name in pkg.dependencies, `${name} is not a dependency`)
    }
  })

  it('exports the re-exported primitives so apps never import reka-ui', async () => {
    const specifier = '@atlair/vue'
    const mod: Record<string, unknown> = await import(specifier)
    for (const name of ['AButton', 'APrimitive', 'AVisuallyHidden']) {
      assert.ok(name in mod, `${name} is not exported`)
    }
  })
})

describe('types', () => {
  it('resolve for every entry point', () => {
    const tsc = `${root}node_modules/.bin/vue-tsc`
    execFileSync(tsc, ['--noEmit', '-p', `${root}tests/fixtures/types/tsconfig.json`], { stdio: 'pipe' })
  })
})

describe('resolver', () => {
  const { resolve } = AtlairResolver()

  it('maps A components to their entry', () => {
    assert.deepEqual(resolve('AButton'), { name: 'AButton', from: '@atlair/vue/button' })
    assert.deepEqual(resolve('AVisuallyHidden'), { name: 'AVisuallyHidden', from: '@atlair/vue/visually-hidden' })
  })

  it('ignores everything else', () => {
    assert.equal(resolve('UButton'), undefined)
    assert.equal(resolve('Button'), undefined)
  })
})

describe('sample Vite app', async () => {
  const appRoot = `${root}tests/fixtures/app`
  const result = (await build({
    root: appRoot,
    configFile: false,
    logLevel: 'silent',
    plugins: [vue(), tailwindcss()],
    build: { write: false, rollupOptions: { input: `${appRoot}/main.ts` } },
  })) as Rollup.RollupOutput

  const js = result.output
    .flatMap((item) => (item.type === 'chunk' ? [item.code] : []))
    .join('\n')
  const css = result.output
    .flatMap((item) => (item.type === 'asset' && item.fileName.endsWith('.css') ? [String(item.source)] : []))
    .join('\n')

  it('bundles the button and tree-shakes the other entries away', () => {
    assert.match(js, /bg-accent/)
    assert.ok(!js.includes('VisuallyHidden'), 'AVisuallyHidden leaked into the bundle')
    assert.ok(!js.includes('visually-hidden'), 'the visually-hidden entry leaked into the bundle')
  })

  it('generates the utilities the button uses without an app-level @source', () => {
    assert.match(css, /\.bg-accent\s*\{/)
    assert.match(css, /\.text-accent-fg\s*\{/)
    assert.match(css, /--a-accent:\s*var\(--a-color-atlair-950\)/)
  })

  it('keeps the source of truth for the build output', async () => {
    const manifest = JSON.parse(await readFile(`${root}dist/manifest.json`, 'utf8'))
    assert.deepEqual(manifest.components.map((c: { name: string }) => c.name).sort(), Object.keys(componentEntries).sort())
  })
})
