import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

export const names = (input: string) => {
  if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(input)) {
    throw new Error(`"${input}" is not a valid component name`)
  }
  const kebab = input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  const pascal = kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return { kebab, pascal, camel: pascal.charAt(0).toLowerCase() + pascal.slice(1) }
}

const templates = ({ kebab, pascal, camel }: ReturnType<typeof names>): Record<string, string> => ({
  [`${pascal}.vue`]: `<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '../internal/cn.ts'
import type { Size } from '../internal/tv.ts'
import { ${camel}Recipe } from './${kebab}.recipe.ts'

const props = withDefaults(
  defineProps<{
    as?: string
    asChild?: boolean
    size?: Size
    class?: string
  }>(),
  { as: 'div', asChild: false, size: 'md', class: undefined },
)

const classes = computed(() => cn(${camel}Recipe({ size: props.size }), props.class))
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="classes">
    <slot />
  </Primitive>
</template>
`,
  [`${kebab}.recipe.ts`]: `import type { VariantProps } from 'tailwind-variants'
import { focusRing, sizes, tv } from '../internal/tv.ts'

export const ${camel}Recipe = tv({
  base: ['rounded-base', focusRing],
  variants: { size: sizes },
  defaultVariants: { size: 'md' },
})

export type ${pascal}Variants = VariantProps<typeof ${camel}Recipe>
`,
  'index.ts': `export { default as A${pascal} } from './${pascal}.vue'
export { ${camel}Recipe } from './${kebab}.recipe.ts'
export type { ${pascal}Variants } from './${kebab}.recipe.ts'
`,
  'docs.ts': `import { defineDocs } from '../docs.ts'
import ${pascal} from './${pascal}.vue'

export default defineDocs(${pascal}, {
  summary: 'Describe what A${pascal} is for in one sentence.',
  props: {
    as: 'The element or component to render.',
    asChild: 'Merges onto its only child instead of rendering an element.',
    size: 'Height, padding and text size: sm, md or lg.',
  },
  slots: { default: 'The content.' },
  events: {},
  a11y: ['Describe the keyboard and screen reader behaviour.'],
  dos: ['Describe when to use it.'],
  donts: ['Describe when not to use it.'],
})
`,
  'examples/Basic.vue': `<script setup lang="ts">
import { A${pascal} } from '../index.ts'
</script>

<template>
  <A${pascal}>${pascal}</A${pascal}>
</template>
`,
  [`${pascal}.stories.ts`]: `import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Basic from './examples/Basic.vue'
import ${pascal} from './${pascal}.vue'

const meta = { title: '${pascal}', component: ${pascal} } satisfies Meta<typeof ${pascal}>

export default meta

export const BasicExample: StoryObj<typeof meta> = {
  render: () => ({ components: { Basic }, template: '<Basic />' }),
}
`,
  [`${pascal}.test.ts`]: `import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { load } from '../internal/load.ts'

it('renders A${pascal} with its label', async () => {
  const A${pascal} = await load('${kebab}', 'A${pascal}')
  const html = await renderToString(createSSRApp({ render: () => h(A${pascal}, null, () => 'Label') }))
  assert.match(html, /Label/)
})
`,
})

const exists = (path: string) =>
  access(path).then(
    () => true,
    () => false,
  )

export const generate = async (packageDir: string, input: string) => {
  const parts = names(input)
  const folder = join(packageDir, 'src', parts.kebab)
  if (await exists(folder)) throw new Error(`${parts.kebab} already exists`)

  const created = Object.entries(templates(parts))
  for (const [file, content] of created) {
    await mkdir(dirname(join(folder, file)), { recursive: true })
    await writeFile(join(folder, file), content)
  }

  const entriesPath = join(packageDir, 'src', 'entries.ts')
  const entries = await readFile(entriesPath, 'utf8')
  const key = parts.kebab.includes('-') ? `'${parts.kebab}'` : parts.kebab
  await writeFile(entriesPath, entries.replace('} as const', `  ${key}: ['A${parts.pascal}'],\n} as const`))

  const indexPath = join(packageDir, 'src', 'index.ts')
  await writeFile(indexPath, `${await readFile(indexPath, 'utf8')}export * from './${parts.kebab}/index.ts'\n`)

  const packagePath = join(packageDir, 'package.json')
  const pkg = JSON.parse(await readFile(packagePath, 'utf8'))
  const exports: Record<string, unknown> = {}
  for (const [name, value] of Object.entries(pkg.exports)) {
    if (name === './resolver') {
      exports[`./${parts.kebab}`] = {
        types: `./dist/types/${parts.kebab}/index.d.ts`,
        import: `./dist/${parts.kebab}.js`,
      }
    }
    exports[name] = value
  }
  pkg.exports = exports
  await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)

  return created.map(([file]) => join('src', parts.kebab, file))
}

if (import.meta.main) {
  const args = process.argv.slice(2)
  const flag = args.indexOf('--package')
  const packageDir = flag === -1 ? resolve(import.meta.dirname, '../packages/vue') : resolve(args.splice(flag, 2)[1]!)
  const input = args[0]
  if (!input) {
    console.error('usage: pnpm new:component <name>')
    process.exit(1)
  }
  try {
    for (const file of await generate(packageDir, input)) console.log(`created ${file}`)
  } catch (error) {
    console.error((error as Error).message)
    process.exit(1)
  }
}
