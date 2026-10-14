import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Basic from './examples/Basic.vue'
import App from './App.vue'

const meta = { title: 'App', component: App } satisfies Meta<typeof App>

export default meta

export const BasicExample: StoryObj<typeof meta> = {
  render: () => ({ components: { Basic }, template: '<Basic />' }),
}
