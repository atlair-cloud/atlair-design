import { tv } from '../internal/tv.ts'

export const iconButtonRecipe = tv({
  base: 'p-0',
  variants: { size: { sm: 'size-8', md: 'size-9', lg: 'size-10' } },
  defaultVariants: { size: 'md' },
})
