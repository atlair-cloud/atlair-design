import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Basic from './examples/Basic.vue'
import ErrorExample from './examples/Error.vue'
import Field from './Field.vue'

const meta = { title: 'Field', component: Field } satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const BasicExample: Story = { render: () => ({ components: { Basic }, template: '<Basic />' }) }
export const ErrorState: Story = { render: () => ({ components: { ErrorExample }, template: '<ErrorExample />' }) }
