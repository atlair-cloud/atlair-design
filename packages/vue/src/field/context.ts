import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'

export type FormErrors = Record<string, string>

export type FieldContext = {
  controlId: string
  labelId: string
  descriptionId: string
  errorId: string
  name: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  message: ComputedRef<string | undefined>
  describedBy: ComputedRef<string | undefined>
  registerDescription: () => () => void
}

export const fieldKey: InjectionKey<FieldContext> = Symbol('atlair-field')

export const fieldsetKey: InjectionKey<ComputedRef<boolean>> = Symbol('atlair-fieldset')

export const formKey: InjectionKey<{ errors: ComputedRef<FormErrors> }> = Symbol('atlair-form')

export const useField = () => inject(fieldKey, null)

export const useFieldControl = () => {
  const field = useField()
  return computed(() =>
    field
      ? {
          id: field.controlId,
          name: field.name.value,
          required: field.required.value || undefined,
          disabled: field.disabled.value || undefined,
          'aria-invalid': field.invalid.value ? ('true' as const) : undefined,
          'aria-describedby': field.describedBy.value,
          'data-invalid': field.invalid.value ? '' : undefined,
          'data-disabled': field.disabled.value ? '' : undefined,
        }
      : {},
  )
}
