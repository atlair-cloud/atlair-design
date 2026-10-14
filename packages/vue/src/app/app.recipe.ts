import { tv } from '../internal/tv.ts'

export const appRecipe = tv({
  slots: {
    viewport: 'fixed bottom-4 end-4 z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none',
  },
})
