import type { VariantProps } from 'tailwind-variants'
import { focusRing, sizes, tv } from '../internal/tv.ts'

export const buttonRecipe = tv({
  base: [
    'inline-flex items-center justify-center rounded-base bg-accent font-medium text-accent-fg transition-colors',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    focusRing,
  ],
  variants: { size: sizes },
  defaultVariants: { size: 'md' },
})

export type ButtonVariants = VariantProps<typeof buttonRecipe>
