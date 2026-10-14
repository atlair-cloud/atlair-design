import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'

type Builtin = keyof VNodeProps | keyof AllowedComponentProps

type PropName<T> = Exclude<keyof ComponentProps<T> & string, Builtin | `on${Capitalize<string>}`>

type Known<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : symbol extends K ? never : K]: T[K]
}

type SlotName<T> = keyof Known<ComponentSlots<T>> & string

type EventName<T> = {
  [K in Exclude<keyof ComponentProps<T> & `on${Capitalize<string>}`, keyof VNodeProps>]: K extends `on${infer E}`
    ? Uncapitalize<E>
    : never
}[Exclude<keyof ComponentProps<T> & `on${Capitalize<string>}`, keyof VNodeProps>]

type Described<K extends string> = [K] extends [never] ? Record<string, never> : { [P in K]: string }

export type Docs<T> = {
  summary: string
  props: { [K in PropName<T>]: string } & { class?: string }
  slots: Described<SlotName<T>>
  events: Described<EventName<T>>
  a11y: string[]
  dos: string[]
  donts: string[]
}

export const defineDocs = <T>(_component: T, docs: Docs<T>): Docs<T> => docs
