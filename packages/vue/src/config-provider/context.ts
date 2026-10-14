import { usePreferredReducedMotion } from '@vueuse/core'
import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'

export const reducedMotionKey: InjectionKey<ComputedRef<boolean>> = Symbol('atlair-reduced-motion')

export const useReducedMotion = () => {
  const preferred = usePreferredReducedMotion()
  return inject(
    reducedMotionKey,
    computed(() => preferred.value === 'reduce'),
    true,
  )
}
