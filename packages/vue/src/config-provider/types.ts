export type Direction = 'ltr' | 'rtl'

export type ReducedMotion = 'user' | 'always' | 'never'

export type ConfigProps = {
  dir?: Direction
  locale?: string
  reducedMotion?: ReducedMotion
  teleportTo?: string
  nonce?: string
}
