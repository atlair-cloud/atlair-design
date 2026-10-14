import { readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { parse } from '@vue/compiler-sfc'

type Node = { type: number; loc: { start: { line: number; column: number } }; children?: unknown[] }

const commentNode = 3
const skipped = new Set(['node_modules', 'dist', '.turbo', '.nuxt', '.output'])
const root = resolve(import.meta.dirname, '..')

export const findTemplateComments = (source: string, filename: string) => {
  const ast = parse(source, { filename }).descriptor.template?.ast
  const hits: { line: number; column: number }[] = []
  const walk = (node: Node) => {
    if (node.type === commentNode) hits.push({ line: node.loc.start.line, column: node.loc.start.column })
    for (const child of node.children ?? []) {
      if (typeof child === 'object' && child !== null) walk(child as Node)
    }
  }
  if (ast) walk(ast as unknown as Node)
  return hits
}

const vueFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  const nested = await Promise.all(
    entries
      .filter((entry) => !skipped.has(entry.name))
      .map((entry) => {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) return vueFiles(path)
        return entry.name.endsWith('.vue') ? [path] : []
      }),
  )
  return nested.flat()
}

if (import.meta.main) {
  const dirs = process.argv.length > 2 ? process.argv.slice(2).map((dir) => resolve(dir)) : [join(root, 'packages'), join(root, 'apps')]
  const files = (await Promise.all(dirs.map(vueFiles))).flat()
  const failures: string[] = []
  for (const file of files) {
    const hits = findTemplateComments(await readFile(file, 'utf8'), file)
    for (const { line, column } of hits) {
      failures.push(`${relative(process.cwd(), file)}:${line}:${column} template comments are not allowed`)
    }
  }
  if (failures.length > 0) {
    console.error(failures.join('\n'))
    process.exit(1)
  }
}
