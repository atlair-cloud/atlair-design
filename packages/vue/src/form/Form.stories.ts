import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ServerErrors from './examples/ServerErrors.vue'
import TanStack from './examples/TanStack.vue'
import Valibot from './examples/Valibot.vue'
import Zod from './examples/Zod.vue'
import Form from './Form.vue'

const meta = { title: 'Form', component: Form } satisfies Meta<typeof Form>

export default meta

type Story = StoryObj<typeof meta>

export const ServerErrorMap: Story = { render: () => ({ components: { ServerErrors }, template: '<ServerErrors />' }) }
export const WithZod: Story = { render: () => ({ components: { Zod }, template: '<Zod />' }) }
export const WithValibot: Story = { render: () => ({ components: { Valibot }, template: '<Valibot />' }) }
export const WithTanStackForm: Story = { render: () => ({ components: { TanStack }, template: '<TanStack />' }) }
