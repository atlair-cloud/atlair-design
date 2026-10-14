import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { after, describe, it } from 'node:test'
import { compile } from '@tailwindcss/node'
import { defaultSources, generate } from '../build/outputs.ts'

const files = await generate()

const scratch = fileURLToPath(new URL('../node_modules/.scratch/', import.meta.url))
await mkdir(scratch, { recursive: true })
after(() => rm(scratch, { recursive: true, force: true }))

const variableNames = (block: string) => [...block.matchAll(/^\s+(--a-[\w-]+):/gm)].map((match) => match[1]!)

const blocks = () => {
  const dark = files['tokens.css'].indexOf(".dark, [data-theme='dark'] {")
  return { light: files['tokens.css'].slice(0, dark), dark: files['tokens.css'].slice(dark) }
}

describe('outputs', () => {
  it('writes every file', () => {
    assert.deepEqual(Object.keys(files).sort(), ['fonts.css', 'theme.css', 'tokens.css', 'tokens.json', 'tokens.ts'])
  })

  it('has no comments in any output', () => {
    for (const [name, content] of Object.entries(files)) {
      assert.ok(!content.includes('/*'), `${name} has a comment`)
    }
  })

  it('prefixes variables with --a-', () => {
    for (const name of variableNames(files['tokens.css'])) assert.match(name, /^--a-/)
    assert.match(files['tokens.css'], /--a-color-atlair-950: #243041;/)
    assert.match(files['tokens.css'], /--a-bg: var\(--a-color-canvas-light\);/)
  })

  it('puts dark values under .dark and [data-theme=dark]', () => {
    assert.match(files['tokens.css'], /\.dark, \[data-theme='dark'\] \{/)
    assert.match(blocks().dark, /--a-bg: var\(--a-color-canvas-dark\);/)
  })

  it('redefines every semantic variable in dark', () => {
    const { light, dark } = blocks()
    const semantic = variableNames(light).filter((name) => /^--a-(?!color-)/.test(name) && !name.includes('-duration-') && !/^--a-(radius|easing|font|shadow-shell-)/.test(name))
    assert.ok(semantic.length >= 13)
    const darkNames = new Set(variableNames(dark))
    for (const name of semantic) assert.ok(darkNames.has(name), `${name} is not redefined in dark`)
  })

  it('zeroes every duration under prefers-reduced-motion', () => {
    const reduced = files['tokens.css'].match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/)?.[0] ?? ''
    const durations = variableNames(files['tokens.css']).filter((name) => name.startsWith('--a-duration-'))
    assert.ok(durations.length > 0)
    for (const name of new Set(durations)) assert.match(reduced, new RegExp(`${name}: 0ms;`))
  })

  it('keeps inset on the dark shell shadow', () => {
    assert.match(files['tokens.css'], /--a-shadow-shell-dark: [^;]*inset 0px 1px 0px 0px #ffffff0a/)
  })

  it('exports typed values and resolved json', () => {
    assert.match(files['tokens.ts'], /^export const tokens = \{/)
    assert.match(files['tokens.ts'], /\} as const\n/)
    const json = JSON.parse(files['tokens.json'])
    assert.equal(json.semantic.light.color.accent.$value, '#243041')
    assert.equal(json.semantic.dark.color.accent.$value, '#eef0f2')
    assert.deepEqual(json.primitive.easing.standard.$value, [0.2, 0, 0, 1])
  })

  it('declares both Spline Sans subsets', () => {
    assert.match(files['fonts.css'], /SplineSans-latin-ext\.woff2/)
    assert.match(files['fonts.css'], /SplineSans-latin\.woff2/)
  })
})

describe('Tailwind', () => {
  it('turns theme.css into utilities', async () => {
    const dir = await mkdtemp(join(scratch, 'tailwind-'))
    await writeFile(join(dir, 'tokens.css'), files['tokens.css'])
    await writeFile(join(dir, 'theme.css'), files['theme.css'])
    const input = `@import 'tailwindcss/utilities';\n@import './theme.css';\n@source inline('dark:bg-bg');`
    const compiler = await compile(input, { base: dir, onDependency: () => {} })
    const css = compiler.build([
      'bg-atlair-950',
      'text-fg-muted',
      'bg-bg',
      'border-border',
      'bg-accent',
      'shadow-shell',
      'rounded-switch',
      'ease-standard',
      'font-sans',
    ])
    assert.match(css, /\.bg-atlair-950 \{\s*background-color: var\(--color-atlair-950\);/)
    assert.match(css, /--color-atlair-950: #243041;/)
    assert.match(css, /\.text-fg-muted \{\s*color: var\(--a-fg-muted\);/)
    assert.match(css, /\.bg-bg \{\s*background-color: var\(--a-bg\);/)
    assert.match(css, /\.border-border \{\s*border-color: var\(--a-border\);/)
    assert.match(css, /\.rounded-switch \{\s*border-radius: var\(--radius-switch\);/)
    assert.match(css, /--radius-switch: 5px;/)
    assert.match(css, /\.shadow-shell \{\s*--tw-shadow: var\(--a-shadow-shell\);/)
    assert.match(css, /\.dark\\:bg-bg:where\(\.dark, \.dark \*, \[data-theme='dark'\], \[data-theme='dark'\] \*\)/)
    assert.match(css, /--a-fg-muted: var\(--a-color-slate-500\);/)
  })
})

describe('contrast gate', () => {
  it('fails the build when a token loses contrast', async () => {
    const dir = await mkdtemp(join(scratch, 'contrast-'))
    const source = JSON.parse(await readFile(defaultSources.dark, 'utf8'))
    source.color['fg-muted'].$value = '{color.slate-dark.100}'
    const dark = join(dir, 'semantic.dark.json')
    await writeFile(dark, JSON.stringify(source))
    await assert.rejects(generate({ ...defaultSources, dark }), /Contrast check failed[\s\S]*dark: fg-muted on bg /)
  })

  it('fails when a UI colour is below 3:1', async () => {
    const dir = await mkdtemp(join(scratch, 'contrast-'))
    const source = JSON.parse(await readFile(defaultSources.light, 'utf8'))
    source.color.ring.$value = '{color.canvas.light}'
    const light = join(dir, 'semantic.light.json')
    await writeFile(light, JSON.stringify(source))
    await assert.rejects(generate({ ...defaultSources, light }), /light: ring on bg /)
  })
})
