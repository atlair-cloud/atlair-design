import { defineDocs } from '../docs.ts'
import Button from './Button.vue'

export default defineDocs(Button, {
  summary: 'Starts an action. Use a link for navigation.',
  props: {
    as: 'The element or component to render. Defaults to button.',
    asChild: 'Merges the styles and behaviour onto its only child, such as a router link. Leading, trailing and loading content are not rendered.',
    variant: 'Visual weight: solid for the main action on a page, outline or ghost for the rest, link for inline text.',
    color: 'accent for the main action, neutral for everything else, danger for destructive actions.',
    size: 'Height, padding and text size: sm, md or lg.',
    type: 'The button type. Defaults to button, so it never submits a form by accident.',
    loading: 'Shows a spinner, sets aria-busy, ignores clicks and keeps the width of the button.',
    disabled: 'Stops interaction and removes the button from the tab order.',
    block: 'Stretches the button to the full width of its container.',
    ui: 'Extra classes for the parts of the button: base, leading, label, trailing and spinner.',
  },
  slots: {
    default: 'The label.',
    leading: 'An icon before the label.',
    trailing: 'An icon after the label.',
  },
  events: { click: 'Not emitted while disabled or loading.' },
  a11y: [
    'Enter and Space activate the button. Neither does anything while it is disabled or loading.',
    'A loading button stays focusable and announces aria-busy.',
    'Icon-only buttons should use AIconButton, which requires an aria-label.',
  ],
  dos: ['Use one solid accent button per view.', 'Use color danger only for actions that destroy data.'],
  donts: ['Do not use a button for navigation; render a link with as-child.'],
})
