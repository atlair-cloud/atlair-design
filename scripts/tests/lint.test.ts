import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { ESLint } from 'eslint'

const root = new URL('../../', import.meta.url).pathname
const fixtures = `${root}scripts/tests/fixtures`
const checker = `${root}scripts/check-no-comments.ts`

const lint = async (dir: string) => {
  const eslint = new ESLint({ cwd: root, overrideConfigFile: `${root}eslint.config.mjs`, ignore: false })
  const results = await eslint.lintFiles([`${fixtures}/${dir}`])
  return results.flatMap((result) =>
    result.messages.filter((message) => message.ruleId === 'no-comments/disallowComments').map((message) => `${result.filePath.split('/').at(-1)}:${message.line}`),
  )
}

const check = (dir: string) => {
  try {
    execFileSync('node', [checker, `${fixtures}/${dir}`], { cwd: root, stdio: 'pipe' })
    return ''
  } catch (error) {
    return String((error as { stderr: Buffer }).stderr)
  }
}

describe('no-comments check', () => {
  it('passes a clean repo', async () => {
    assert.deepEqual(await lint('clean'), [])
    assert.equal(check('clean'), '')
  })

  it('fails every comment style in .ts and <script> with its file and line', async () => {
    assert.deepEqual((await lint('bad')).sort(), ['Script.vue:2', 'comments.ts:1', 'comments.ts:2', 'comments.ts:3', 'comments.ts:4'])
  })

  it('fails a template comment with its file and line', () => {
    assert.match(check('bad'), /Template\.vue:6:3 template comments are not allowed/)
  })
})
