import { defineDocs } from '../docs.ts'
import Form from './Form.vue'

export default defineDocs(Form, {
  summary: 'A form that shows an error map on its fields and moves focus to the first invalid one.',
  props: {
    as: 'The element or component to render. Defaults to form.',
    asChild: 'Merges onto its only child instead of rendering an element.',
    errors: 'A map of field name to message, from a server or from a validation library. Each message shows on the field with that name.',
  },
  slots: { default: 'The fields and the submit button.' },
  events: { submit: 'The native submit event. Call preventDefault, or use the prevent modifier, to handle it yourself.' },
  a11y: [
    'When the error map changes and is not empty, focus moves to the first invalid field.',
    'Native browser validation still runs on submit unless you set novalidate.',
  ],
  dos: ['Validate on submit, then pass the result as the error map.'],
  donts: ['Do not change the error map in place; pass a new object so the form notices.'],
})
