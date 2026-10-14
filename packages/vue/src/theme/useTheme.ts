import { createSharedComposable, usePreferredDark, useStorage } from '@vueuse/core'
import { computed, watchEffect } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'

export type ResolvedTheme = 'light' | 'dark'

export const themeStorageKey = 'atlair-theme'

const isPreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

const create = () => {
  const preference = useStorage<ThemePreference>(themeStorageKey, 'system', undefined, {
    initOnMounted: true,
    serializer: { read: (value) => (isPreference(value) ? value : 'system'), write: (value) => value },
  })
  const prefersDark = usePreferredDark()

  const resolved = computed<ResolvedTheme>(() =>
    preference.value === 'dark' || (preference.value === 'system' && prefersDark.value) ? 'dark' : 'light',
  )

  watchEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = resolved.value
    document.documentElement.style.colorScheme = resolved.value
  })

  const setTheme = (theme: ThemePreference) => {
    preference.value = theme
  }

  return { preference, resolved, setTheme }
}

export const useTheme = createSharedComposable(create)
