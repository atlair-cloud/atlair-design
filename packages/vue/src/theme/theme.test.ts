import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const specifier = '@atlair/vue/theme'
const { createThemeScript } = await import(specifier)

const run = (storage: () => string | null, systemDark: boolean) => {
  const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> }
  const localStorage = { getItem: storage }
  const matchMedia = () => ({ matches: systemDark })
  new Function('document', 'localStorage', 'matchMedia', createThemeScript())({ documentElement: root }, localStorage, matchMedia)
  return root.dataset.theme
}

describe('theme script', () => {
  it('applies the stored theme before the app loads', () => {
    assert.equal(run(() => 'dark', false), 'dark')
    assert.equal(run(() => 'light', true), 'light')
    assert.equal(run(() => 'system', true), 'dark')
  })

  it('falls back to the system theme when the stored value is not a theme', () => {
    assert.equal(run(() => 'purple', true), 'dark')
    assert.equal(run(() => null, false), 'light')
  })

  it('does not throw when storage is blocked', () => {
    const blocked = () => {
      throw new Error('denied')
    }
    assert.equal(run(blocked, true), 'dark')
  })
})
