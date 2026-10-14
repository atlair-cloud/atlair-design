import { tv } from '../internal/tv.ts'

export const fieldRecipe = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-fg data-[disabled]:opacity-50',
    description: 'text-sm text-fg-muted',
    error: 'text-sm text-danger',
  },
})
