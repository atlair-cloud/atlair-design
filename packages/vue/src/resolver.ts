import type { ComponentResolverObject } from 'unplugin-vue-components'
import { componentEntries } from './entries.ts'

export const AtlairResolver = (): ComponentResolverObject => ({
  type: 'component',
  resolve: (name) => {
    const entry = componentEntries[name]
    return entry ? { name, from: `@atlair/vue/${entry}` } : undefined
  },
})
