import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Basic from './examples/Basic.vue'
import IconButton from './IconButton.vue'

const meta = {
  title: 'IconButton',
  component: IconButton,
  args: { 'aria-label': 'Close' },
} satisfies Meta<typeof IconButton>

export default meta

export const BasicExample: StoryObj<typeof meta> = {
  render: () => ({ components: { Basic }, template: '<Basic />' }),
}
