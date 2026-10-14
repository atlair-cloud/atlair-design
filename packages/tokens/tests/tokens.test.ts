import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

type Json = { [key: string]: unknown }
type Leaf = { path: string; type: string; value: unknown }

const load = (name: string): Json =>
  JSON.parse(readFileSync(new URL(`../src/tokens/${name}.json`, import.meta.url), 'utf8'))

const primitive = load('primitive')
const light = load('semantic.light')
const dark = load('semantic.dark')

const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const collect = (node: Json, path: string[] = [], inherited?: string): Leaf[] => {
  const type = typeof node.$type === 'string' ? node.$type : inherited
  if ('$value' in node) {
    assert.ok(type, `${path.join('.')} has no $type`)
    return [{ path: path.join('.'), type, value: node.$value }]
  }
  return Object.entries(node).flatMap(([key, child]) => {
    if (key.startsWith('$')) return []
    assert.match(key, /^[^{}.$][^{}.]*$/, `invalid token or group name "${key}"`)
    assert.ok(isObject(child), `${[...path, key].join('.')} must be an object`)
    return collect(child, [...path, key], type)
  })
}

const referencePattern = /^\{([^{}]+)\}$/

const index = (leaves: Leaf[]) => new Map(leaves.map((leaf) => [leaf.path, leaf]))

const primitives = index(collect(primitive))

const resolve = (leaf: Leaf, seen: string[] = []): unknown => {
  if (typeof leaf.value !== 'string') return leaf.value
  const match = referencePattern.exec(leaf.value)
  if (!match) return leaf.value
  const target = primitives.get(match[1]!)
  assert.ok(target, `${leaf.path} references missing token ${leaf.value}`)
  assert.equal(target.type, leaf.type, `${leaf.path} references a token of another type`)
  assert.ok(!seen.includes(target.path), `circular reference at ${target.path}`)
  return resolve(target, [...seen, leaf.path])
}

const shadowKeys = ['color', 'offsetX', 'offsetY', 'blur', 'spread']

const validators: Record<string, (value: unknown) => boolean> = {
  color: (value) => typeof value === 'string' && /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(value),
  dimension: (value) => typeof value === 'string' && /^-?\d+(\.\d+)?(px|rem)$/.test(value),
  duration: (value) => typeof value === 'string' && /^\d+(\.\d+)?(ms|s)$/.test(value),
  cubicBezier: (value) => {
    if (!Array.isArray(value) || value.length !== 4) return false
    if (!value.every((n) => typeof n === 'number')) return false
    const [x1, , x2] = value as number[]
    return x1! >= 0 && x1! <= 1 && x2! >= 0 && x2! <= 1
  },
  fontFamily: (value) =>
    typeof value === 'string' || (Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === 'string')),
  shadow: (value) =>
    (Array.isArray(value) ? value : [value]).every(
      (layer) =>
        isObject(layer) &&
        shadowKeys.every((key) => typeof layer[key] === 'string') &&
        (layer.inset === undefined || typeof layer.inset === 'boolean') &&
        validators.color!(layer.color) &&
        ['offsetX', 'offsetY', 'blur', 'spread'].every((key) => validators.dimension!(layer[key])),
    ),
}

describe('DTCG format', () => {
  for (const [name, file] of [['primitive', primitive], ['semantic.light', light], ['semantic.dark', dark]] as const) {
    it(`${name} has valid names, types and values`, () => {
      const leaves = collect(file)
      assert.ok(leaves.length > 0)
      for (const leaf of leaves) {
        const validate = validators[leaf.type]
        assert.ok(validate, `${leaf.path} has unknown type ${leaf.type}`)
        const value = resolve(leaf)
        assert.ok(validate(value), `${leaf.path} has an invalid ${leaf.type} value`)
      }
    })
  }

  it('declares the DTCG schema', () => {
    for (const file of [primitive, light, dark]) {
      assert.match(String(file.$schema), /designtokens\.org/)
    }
  })
})

describe('semantic tokens', () => {
  const lightLeaves = collect(light)
  const darkLeaves = collect(dark)

  it('light and dark define the same tokens', () => {
    assert.deepEqual(lightLeaves.map((leaf) => leaf.path), darkLeaves.map((leaf) => leaf.path))
  })

  it('only reference primitives', () => {
    for (const leaf of [...lightLeaves, ...darkLeaves]) {
      assert.match(String(leaf.value), referencePattern, `${leaf.path} must be a reference`)
    }
  })

  it('cover the required set', () => {
    const required = [
      'bg', 'bg-subtle', 'fg', 'fg-muted', 'border', 'accent', 'accent-fg',
      'danger', 'success', 'warning', 'ring', 'surface-raised', 'overlay',
    ]
    const names = new Set(lightLeaves.map((leaf) => leaf.path))
    for (const name of required) assert.ok(names.has(`color.${name}`), `missing ${name}`)
  })
})

describe('values seeded from the panel', () => {
  const resolved = (file: Json, path: string) => resolve(index(collect(file)).get(path)!)

  it('light values match main.css', () => {
    assert.equal(resolved(light, 'color.bg'), '#ffffff')
    assert.equal(resolved(light, 'color.fg'), '#344256')
    assert.equal(resolved(light, 'color.accent'), '#243041')
    assert.equal(resolved(light, 'color.bg-frame'), '#e7e4df')
    assert.equal(resolved(light, 'color.bg-inset'), '#e6e3dc')
    assert.equal(resolved(light, 'color.fg-muted'), '#56657a')
  })

  it('dark values match panel-dark.css', () => {
    assert.equal(resolved(dark, 'color.bg'), '#111315')
    assert.equal(resolved(dark, 'color.bg-subtle'), '#1d2023')
    assert.equal(resolved(dark, 'color.bg-inset'), '#24272b')
    assert.equal(resolved(dark, 'color.bg-frame'), '#18191c')
    assert.equal(resolved(dark, 'color.fg'), '#cdd2d8')
    assert.equal(resolved(dark, 'color.fg-muted'), '#9aa3ad')
    assert.equal(resolved(dark, 'color.border'), '#2e3237')
    assert.equal(resolved(dark, 'color.accent'), '#eef0f2')
    assert.equal(resolved(dark, 'color.accent-fg'), '#1a1d20')
    assert.equal(resolved(dark, 'color.surface-raised'), '#1a1d20')
    assert.equal(resolved(dark, 'color.danger'), '#f07a7a')
    assert.equal(resolved(dark, 'color.skeleton'), '#202327')
    assert.equal(resolved(dark, 'color.skeleton-shine'), '#2c3035')
  })

  it('keeps the radius, easing and font values', () => {
    const get = (path: string) => primitives.get(path)!.value
    assert.equal(get('radius.base'), '0.25rem')
    assert.equal(get('radius.switch'), '5px')
    assert.equal(get('radius.switch-thumb'), '3px')
    assert.deepEqual(get('easing.standard'), [0.2, 0, 0, 1])
    assert.deepEqual(get('easing.enter'), [0, 0, 0.2, 1])
    assert.deepEqual(get('easing.exit'), [0.4, 0, 1, 1])
    assert.deepEqual(get('easing.glide'), [0.2, 0.8, 0.2, 1])
    assert.equal((get('font.sans') as string[])[0], 'Spline Sans')
  })
})
