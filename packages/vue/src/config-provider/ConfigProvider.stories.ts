import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Basic from './examples/Basic.vue'
import ConfigProvider from './ConfigProvider.vue'

const meta = { title: 'ConfigProvider', component: ConfigProvider } satisfies Meta<typeof ConfigProvider>

export default meta

export const RightToLeft: StoryObj<typeof meta> = {
  render: () => ({ components: { Basic }, template: '<Basic />' }),
}
