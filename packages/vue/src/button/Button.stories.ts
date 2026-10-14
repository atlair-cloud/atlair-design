import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AsLink from './examples/AsLink.vue'
import Basic from './examples/Basic.vue'
import IconOnly from './examples/IconOnly.vue'
import Loading from './examples/Loading.vue'
import Variants from './examples/Variants.vue'
import Button from './Button.vue'

const meta = {
  title: 'Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost', 'link'] },
    color: { control: 'select', options: ['neutral', 'accent', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const BasicExample: Story = { render: () => ({ components: { Basic }, template: '<Basic />' }) }
export const VariantsExample: Story = { render: () => ({ components: { Variants }, template: '<Variants />' }) }
export const LoadingExample: Story = { render: () => ({ components: { Loading }, template: '<Loading />' }) }
export const AsLinkExample: Story = { render: () => ({ components: { AsLink }, template: '<AsLink />' }) }
export const IconOnlyExample: Story = { render: () => ({ components: { IconOnly }, template: '<IconOnly />' }) }
