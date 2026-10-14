import { defineDocs } from '../docs.ts'
import IconButton from './IconButton.vue'

export default defineDocs(IconButton, {
  summary: 'A square button that holds only an icon. It needs an accessible name.',
  props: {
    'aria-label': 'The accessible name, such as Close or Open menu. Required, because the button has no visible text.',
    as: 'The element or component to render. Defaults to button.',
    asChild: 'Merges the styles and behaviour onto its only child, such as a router link.',
    variant: 'Visual weight: solid, outline, ghost or link. Defaults to ghost.',
    color: 'accent, neutral or danger. Defaults to neutral.',
    size: 'Width and height: sm, md or lg.',
    loading: 'Shows a spinner in place of the icon, sets aria-busy and ignores clicks.',
    disabled: 'Stops interaction and removes the button from the tab order.',
    ui: 'Extra classes for the parts of the button: base, leading, label, trailing and spinner.',
  },
  slots: { default: 'The icon.' },
  events: { click: 'Not emitted while disabled or loading.' },
  a11y: [
    'The aria-label is required in the prop types, and a warning appears in development when it is empty.',
    'Describe the action, not the icon: Close, not X.',
  ],
  dos: ['Use it for toolbar actions and for closing things.'],
  donts: ['Do not rely on the icon alone to explain a destructive action; add a tooltip or a label.'],
})
