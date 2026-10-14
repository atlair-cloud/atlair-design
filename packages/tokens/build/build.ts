import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { generate } from './outputs.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = `${root}dist/`

const files = await generate()

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await Promise.all(Object.entries(files).map(([name, content]) => writeFile(`${dist}${name}`, content)))
await cp(`${root}fonts`, `${dist}fonts`, { recursive: true })
