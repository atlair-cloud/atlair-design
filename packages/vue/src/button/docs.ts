import { defineDocs } from '../docs.ts'
import Button from './Button.vue'

export default defineDocs(Button, {
  summary: 'Starts an action. Use a link for navigation.',
  props: {
    as: 'The element or component to render. Defaults to button.',
    asChild: 'Merges the button onto its only child instead of rendering an element.',
    size: 'Height, padding and text size: sm, md or lg.',
    disabled: 'Stops interaction and sets data-disabled.',
  },
  slots: { default: 'The label.' },
  events: {},
  a11y: ['Icon-only buttons need an aria-label.'],
  dos: ['Use one solid button per view.'],
  donts: ['Do not use a button for navigation; render a link with as-child.'],
})
