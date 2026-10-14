import { copyFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { componentEntries } from '../src/entries.ts'

const root = fileURLToPath(new URL('../', import.meta.url))

await copyFile(`${root}src/style.css`, `${root}dist/style.css`)

const components = Object.entries(componentEntries).map(([name, entry]) => ({ name, entry: `@atlair/vue/${entry}` }))
await writeFile(`${root}dist/manifest.json`, `${JSON.stringify({ components }, null, 2)}\n`)
