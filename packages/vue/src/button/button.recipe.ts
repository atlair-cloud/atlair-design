import type { VariantProps } from 'tailwind-variants'
import { focusRing, sizes, tv } from '../internal/tv.ts'

export const buttonRecipe = tv({
  slots: {
    base: [
      'relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-base font-medium',
      'transition-colors motion-reduce:transition-none',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      focusRing,
    ],
    leading: 'inline-flex shrink-0',
    label: 'inline-flex items-center',
    trailing: 'inline-flex shrink-0',
    spinner: 'absolute inset-0 flex items-center justify-center',
  },
  variants: {
    variant: { solid: '', outline: 'border', ghost: '', link: 'underline-offset-4 hover:underline' },
    color: { neutral: '', accent: '', danger: '' },
    size: sizes,
    block: { true: { base: 'w-full' } },
    loading: { true: { leading: 'invisible', label: 'invisible', trailing: 'invisible' } },
  },
  compoundVariants: [
    { variant: 'solid', color: 'accent', class: { base: 'bg-accent text-accent-fg hover:bg-accent/90' } },
    { variant: 'solid', color: 'neutral', class: { base: 'bg-fg text-bg hover:bg-fg/90' } },
    { variant: 'solid', color: 'danger', class: { base: 'bg-danger text-accent-fg hover:bg-danger/90' } },
    { variant: 'outline', color: 'accent', class: { base: 'border-accent text-accent hover:bg-bg-subtle' } },
    { variant: 'outline', color: 'neutral', class: { base: 'border-border text-fg hover:bg-bg-subtle' } },
    { variant: 'outline', color: 'danger', class: { base: 'border-danger text-danger hover:bg-bg-subtle' } },
    { variant: 'ghost', color: 'accent', class: { base: 'text-accent hover:bg-bg-subtle' } },
    { variant: 'ghost', color: 'neutral', class: { base: 'text-fg hover:bg-bg-subtle' } },
    { variant: 'ghost', color: 'danger', class: { base: 'text-danger hover:bg-bg-subtle' } },
    { variant: 'link', color: 'accent', class: { base: 'h-auto px-0 text-accent' } },
    { variant: 'link', color: 'neutral', class: { base: 'h-auto px-0 text-fg' } },
    { variant: 'link', color: 'danger', class: { base: 'h-auto px-0 text-danger' } },
  ],
  defaultVariants: { variant: 'solid', color: 'accent', size: 'md' },
})

export type ButtonVariants = VariantProps<typeof buttonRecipe>
