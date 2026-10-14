import * as all from '@atlair/vue'
import { AButton, buttonRecipe, type ButtonVariants } from '@atlair/vue/button'
import { APrimitive, type APrimitiveProps } from '@atlair/vue/primitive'
import { AtlairResolver } from '@atlair/vue/resolver'
import { AVisuallyHidden, type AVisuallyHiddenProps } from '@atlair/vue/visually-hidden'

export const components = [AButton, APrimitive, AVisuallyHidden, all.AButton, all.APrimitive, all.AVisuallyHidden]
export const resolver = AtlairResolver().resolve
export const size: ButtonVariants['size'] = 'lg'
export const classes: string = buttonRecipe({ size })
export type PrimitiveProps = APrimitiveProps
export type HiddenProps = AVisuallyHiddenProps
