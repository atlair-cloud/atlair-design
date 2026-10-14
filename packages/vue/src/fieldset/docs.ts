import { defineDocs } from '../docs.ts'
import Fieldset from './Fieldset.vue'
import FieldsetLegend from './FieldsetLegend.vue'

export default {
  AFieldset: defineDocs(Fieldset, {
    summary: 'Groups related fields under a legend and disables them together.',
    props: {
      as: 'The element or component to render. Defaults to fieldset.',
      asChild: 'Merges onto its only child instead of rendering an element.',
      disabled: 'Disables every field inside it.',
    },
    slots: { default: 'A legend and the fields.' },
    events: {},
    a11y: ['A fieldset with a legend is announced as a group, which suits radio buttons and related inputs.'],
    dos: ['Group radio buttons and checkboxes that answer one question.'],
    donts: ['Do not nest fieldsets.'],
  }),
  AFieldsetLegend: defineDocs(FieldsetLegend, {
    summary: 'The caption of a fieldset.',
    props: {
      as: 'The element or component to render. Defaults to legend.',
      asChild: 'Merges onto its only child instead of rendering an element.',
    },
    slots: { default: 'The caption.' },
    events: {},
    a11y: ['Screen readers read it before each field inside the group.'],
    dos: ['Make it the first child of the fieldset.'],
    donts: ['Do not use it for a page heading.'],
  }),
}
