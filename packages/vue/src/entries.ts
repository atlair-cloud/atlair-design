export const entries = {
  app: ['AApp'],
  button: ['AButton'],
  'config-provider': ['AConfigProvider'],
  primitive: ['APrimitive'],
  theme: [],
  'visually-hidden': ['AVisuallyHidden'],
} as const

export type EntryName = keyof typeof entries

export const componentEntries: Record<string, EntryName> = Object.fromEntries(
  Object.entries(entries).flatMap(([entry, names]) => names.map((name) => [name, entry as EntryName])),
)
