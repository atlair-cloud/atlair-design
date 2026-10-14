import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Basic from './examples/Basic.vue'
import Fieldset from './Fieldset.vue'

const meta = { title: 'Fieldset', component: Fieldset } satisfies Meta<typeof Fieldset>

export default meta

export const BasicExample: StoryObj<typeof meta> = {
  render: () => ({ components: { Basic }, template: '<Basic />' }),
}
