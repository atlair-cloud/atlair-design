export type Theme = Record<string, string>

type Pair = { foreground: string; background: string; minimum: number }

const text = 4.5
const ui = 3

export const pairs: Pair[] = [
  { foreground: 'fg', background: 'bg', minimum: text },
  { foreground: 'fg', background: 'bg-subtle', minimum: text },
  { foreground: 'fg', background: 'bg-inset', minimum: text },
  { foreground: 'fg', background: 'surface-raised', minimum: text },
  { foreground: 'fg-muted', background: 'bg', minimum: text },
  { foreground: 'fg-muted', background: 'bg-subtle', minimum: text },
  { foreground: 'fg-muted', background: 'surface-raised', minimum: text },
  { foreground: 'fg-frame', background: 'bg-frame', minimum: text },
  { foreground: 'accent-fg', background: 'accent', minimum: text },
  { foreground: 'danger', background: 'bg', minimum: text },
  { foreground: 'danger', background: 'surface-raised', minimum: text },
  { foreground: 'accent', background: 'bg', minimum: ui },
  { foreground: 'accent', background: 'surface-raised', minimum: ui },
  { foreground: 'ring', background: 'bg', minimum: ui },
  { foreground: 'ring', background: 'surface-raised', minimum: ui },
]

const channel = (value: number) => {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export const luminance = (hex: string) => {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (!match) throw new Error(`Contrast needs an opaque 6-digit hex colour, got ${hex}`)
  const [r, g, b] = [match[1], match[2], match[3]].map((part) => channel(parseInt(part!, 16)))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

export const contrast = (a: string, b: string) => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (lighter! + 0.05) / (darker! + 0.05)
}

export const checkContrast = (name: string, theme: Theme) =>
  pairs.flatMap(({ foreground, background, minimum }) => {
    const fg = theme[foreground]
    const bg = theme[background]
    if (!fg || !bg) throw new Error(`${name} theme is missing ${foreground} or ${background}`)
    const ratio = contrast(fg, bg)
    return ratio < minimum
      ? [`${name}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1, needs ${minimum}:1`]
      : []
  })
