import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, describe, it } from 'node:test'
import { ESLint } from 'eslint'
import { generate } from '../new-component.ts'

const root = new URL('../../', import.meta.url).pathname
const source = `${root}packages/vue`
let pkg = ''

const typecheck = () => {
  try {
    execFileSync(`${source}/node_modules/.bin/vue-tsc`, ['--noEmit', '-p', `${pkg}/tsconfig.json`], { stdio: 'pipe' })
    return ''
  } catch (error) {
    return String((error as { stdout: Buffer }).stdout)
  }
}

const docs = () => `${pkg}/src/sample/docs.ts`

before(async () => {
  pkg = await mkdtemp(join(tmpdir(), 'atlair-component-'))
  await cp(`${source}/src`, `${pkg}/src`, { recursive: true })
  await cp(`${source}/package.json`, `${pkg}/package.json`)
  await symlink(`${source}/node_modules`, `${pkg}/node_modules`)
  await writeFile(
    `${pkg}/tsconfig.json`,
    JSON.stringify({ extends: `${root}tsconfig.base.json`, compilerOptions: { types: ['node'] }, include: ['src'] }),
  )
  await generate(pkg, 'sample')
})

after(() => rm(pkg, { recursive: true, force: true }))

describe('new:component', () => {
  it('generates a component that typechecks and passes the no-comments check untouched', async () => {
    assert.equal(typecheck(), '')
    const eslint = new ESLint({ cwd: pkg, overrideConfigFile: `${root}eslint.config.mjs`, ignore: false })
    const results = await eslint.lintFiles([`${pkg}/src/sample`])
    assert.deepEqual(results.flatMap((result) => result.messages), [])
    execFileSync('node', [`${root}scripts/check-no-comments.ts`, `${pkg}/src/sample`], { stdio: 'pipe' })
    assert.match(await readFile(`${pkg}/src/entries.ts`, 'utf8'), /sample: \['ASample'\]/)
  })

  it('fails vue-tsc when a prop description is removed', async () => {
    const original = await readFile(docs(), 'utf8')
    await writeFile(docs(), original.replace(/\s+size: '.*',/, ''))
    assert.match(typecheck(), /sample\/docs\.ts/)
    await writeFile(docs(), original)
  })

  it('fails vue-tsc on a description for a prop that does not exist', async () => {
    const original = await readFile(docs(), 'utf8')
    await writeFile(docs(), original.replace("props: {", "props: {\n    nope: 'x',"))
    assert.match(typecheck(), /'nope' does not exist/)
    await writeFile(docs(), original)
  })
})
