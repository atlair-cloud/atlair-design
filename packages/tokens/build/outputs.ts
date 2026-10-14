import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import { formattedVariables } from 'style-dictionary/utils'
import type { Config, TransformedToken } from 'style-dictionary/types'
import { checkContrast, type Theme } from './contrast.ts'

type Tree = { [key: string]: Tree | { $type: string; $value: unknown } }

export type OutputName = 'tokens.css' | 'theme.css' | 'fonts.css' | 'tokens.json' | 'tokens.ts'

export type Sources = { primitive: string; light: string; dark: string }

const tokensDir = fileURLToPath(new URL('../src/tokens/', import.meta.url))

export const defaultSources: Sources = {
  primitive: `${tokensDir}primitive.json`,
  light: `${tokensDir}semantic.light.json`,
  dark: `${tokensDir}semantic.dark.json`,
}

const darkSelector = ".dark, [data-theme='dark']"
const schema = 'https://www.designtokens.org/schemas/2025.10/format.json'
const transforms = ['name/atlair', 'color/css', 'fontFamily/css', 'cubicBezier/css', 'shadow/atlair']

const isSemantic = (token: TransformedToken) => /semantic\.[a-z]+\.json$/.test(token.filePath)

const variableName = (path: string[]) => ['a', ...path].join('-')

StyleDictionary.registerTransform({
  name: 'name/atlair',
  type: 'name',
  transform: (token) =>
    variableName(isSemantic(token) && token.path[0] === 'color' ? token.path.slice(1) : token.path),
})

type ShadowLayer = { color: string; offsetX: string; offsetY: string; blur: string; spread: string; inset?: boolean }

StyleDictionary.registerTransform({
  name: 'shadow/atlair',
  type: 'value',
  filter: (token) => token.$type === 'shadow',
  transform: (token) =>
    (token.$value as ShadowLayer[])
      .map(({ inset, offsetX, offsetY, blur, spread, color }) =>
        [inset ? 'inset' : '', offsetX, offsetY, blur, spread, color].filter(Boolean).join(' '),
      )
      .join(', '),
})

StyleDictionary.registerFormat({
  name: 'atlair/css-variables',
  format: ({ dictionary, file }) =>
    `${file.options?.selector} {\n${formattedVariables({
      format: 'css',
      dictionary,
      outputReferences: true,
      usesDtcg: true,
    })}\n}\n`,
})

const primitiveThemeName = (path: string[]) => {
  const [group, ...rest] = path
  if (group === 'color') {
    const [name] = rest
    if (name === 'atlair' || name === 'slate') return `--color-${rest.join('-')}`
    if (name === 'puff') return '--color-puff'
    if (name === 'status' && rest.length === 2) return `--color-${rest.join('-')}`
    return undefined
  }
  if (group === 'radius') return `--radius-${rest.join('-')}`
  if (group === 'easing') return `--ease-${rest.join('-')}`
  if (group === 'font') return `--font-${rest.join('-')}`
  return undefined
}

StyleDictionary.registerFormat({
  name: 'atlair/tailwind-theme',
  format: ({ dictionary }) => {
    const primitives: string[] = []
    const semantics: string[] = []
    for (const token of dictionary.allTokens) {
      if (isSemantic(token)) {
        const [group, ...rest] = token.path
        const name = `--${group === 'color' ? 'color' : group}-${rest.join('-')}`
        semantics.push(`  ${name}: var(--${token.name});`)
      } else {
        const name = primitiveThemeName(token.path)
        if (name) primitives.push(`  ${name}: ${token.$value};`)
      }
    }
    return [
      "@import './tokens.css';",
      '',
      "@custom-variant dark (&:where(.dark, .dark *, [data-theme='dark'], [data-theme='dark'] *));",
      '',
      '@theme {',
      ...primitives,
      '}',
      '',
      '@theme inline {',
      ...semantics,
      '}',
      '',
    ].join('\n')
  },
})

const fontFaces = [
  {
    file: 'SplineSans-latin-ext.woff2',
    range:
      'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
  },
  {
    file: 'SplineSans-latin.woff2',
    range:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  },
]

const fontsCss = () =>
  fontFaces
    .map(
      ({ file, range }) => `@font-face {
  font-family: 'Spline Sans';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('./fonts/${file}') format('woff2');
  unicode-range: ${range};
}
`,
    )
    .join('\n')

const instance = (config: Config) =>
  new StyleDictionary({ usesDtcg: true, log: { verbosity: 'silent' }, ...config })

const cssFile = (destination: string, selector: string, source: boolean) => ({
  destination,
  format: 'atlair/css-variables',
  ...(source ? { filter: (token: TransformedToken) => token.isSource } : {}),
  options: { selector },
})

const tree = (tokens: TransformedToken[]) => {
  const root: Tree = {}
  for (const token of tokens) {
    let node = root
    for (const key of token.path.slice(0, -1)) {
      node = (node[key] ??= {}) as Tree
    }
    node[token.path.at(-1)!] = { $type: token.$type!, $value: token.$value }
  }
  return root
}

const values = (node: Tree): unknown =>
  Object.fromEntries(
    Object.entries(node).map(([key, child]) => [
      key,
      '$value' in child ? child.$value : values(child as Tree),
    ]),
  )

const colours = (tokens: TransformedToken[]): Theme =>
  Object.fromEntries(
    tokens
      .filter((token) => token.path[0] === 'color')
      .map((token) => [token.path.slice(1).join('-'), String(token.$value)]),
  )

const toTypeScript = (value: unknown) =>
  JSON.stringify(value, null, 2)
    .replace(/"([A-Za-z_]\w*)":/g, '$1:')
    .replace(/"/g, "'")

const reducedMotion = (tokens: TransformedToken[]) =>
  [
    '@media (prefers-reduced-motion: reduce) {',
    '  :root {',
    ...tokens
      .filter((token) => token.path[0] === 'duration')
      .map((token) => `    --${variableName(token.path)}: 0ms;`),
    '  }',
    '}',
    '',
  ].join('\n')

export const generate = async (sources: Sources = defaultSources): Promise<Record<OutputName, string>> => {
  const light = instance({
    source: [sources.primitive, sources.light],
    platforms: {
      css: { transforms, files: [cssFile('tokens.css', ':root', false)] },
      theme: { transforms, files: [{ destination: 'theme.css', format: 'atlair/tailwind-theme' }] },
      raw: { transforms: [], files: [] },
    },
  })
  const dark = instance({
    include: [sources.primitive],
    source: [sources.dark],
    platforms: {
      css: { transforms, files: [cssFile('dark.css', darkSelector, true)] },
      raw: { transforms: [], files: [] },
    },
  })

  const [[lightCss], [darkCss], [themeCss]] = await Promise.all([
    light.formatPlatform('css'),
    dark.formatPlatform('css'),
    light.formatPlatform('theme'),
  ])

  const lightTokens = (await light.getPlatformTokens('raw')).allTokens
  const darkTokens = (await dark.getPlatformTokens('raw')).allTokens.filter((token) => token.isSource)
  const primitiveTokens = lightTokens.filter((token) => !isSemantic(token))
  const lightSemantic = lightTokens.filter(isSemantic)

  const failures = [
    ...checkContrast('light', colours(lightSemantic)),
    ...checkContrast('dark', colours(darkTokens)),
  ]
  if (failures.length > 0) {
    throw new Error(`Contrast check failed:\n${failures.join('\n')}`)
  }

  const primitiveTree = tree(primitiveTokens)
  const lightTree = tree(lightSemantic)
  const darkTree = tree(darkTokens)

  return {
    'tokens.css': `${lightCss!.output as string}\n${reducedMotion(primitiveTokens)}\n${darkCss!.output as string}`,
    'theme.css': themeCss!.output as string,
    'fonts.css': fontsCss(),
    'tokens.json': `${JSON.stringify({ $schema: schema, primitive: primitiveTree, semantic: { light: lightTree, dark: darkTree } }, null, 2)}\n`,
    'tokens.ts': `export const tokens = ${toTypeScript({
      primitive: values(primitiveTree),
      semantic: { light: values(lightTree), dark: values(darkTree) },
    })} as const\n\nexport type Tokens = typeof tokens\nexport type ThemeName = keyof Tokens['semantic']\n`,
  }
}
