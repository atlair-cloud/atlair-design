import { defineDocs } from '../docs.ts'
import Field from './Field.vue'
import FieldControl from './FieldControl.vue'
import FieldDescription from './FieldDescription.vue'
import FieldError from './FieldError.vue'
import FieldLabel from './FieldLabel.vue'

const as = 'The element or component to render.'
const asChild = 'Merges onto its only child instead of rendering an element.'

export default {
  AField: defineDocs(Field, {
    summary: 'Wires a control to its label, description and error, so a screen reader announces all three.',
    props: {
      as,
      asChild,
      name: 'The field name. A form error map uses it to find this field, and it is set on the control.',
      invalid: 'Marks the field invalid. A message from error or from the form also marks it invalid.',
      error: 'The error message. It wins over the form error map.',
      required: 'Marks the control required and shows an asterisk on the label.',
      disabled: 'Disables the control. A disabled fieldset disables its fields too.',
    },
    slots: { default: 'The label, the control, the description and the error.' },
    events: {},
    a11y: [
      'The label is linked to the control with for and id.',
      'The description and the error are linked with aria-describedby, and the control gets aria-invalid.',
      'The description joins aria-describedby once it mounts, so on a server-rendered page it is added after hydration unless it comes before the control.',
    ],
    dos: ['Give every control a field with a visible label.'],
    donts: ['Do not use a placeholder as the label.'],
  }),
  AFieldLabel: defineDocs(FieldLabel, {
    summary: 'The visible label of the control.',
    props: { as, asChild },
    slots: { default: 'The label text.' },
    events: {},
    a11y: ['Clicking the label focuses the control.'],
    dos: ['Keep labels short and put detail in the description.'],
    donts: ['Do not hide the label; use AVisuallyHidden if the design has none.'],
  }),
  AFieldDescription: defineDocs(FieldDescription, {
    summary: 'Helper text that is read with the control.',
    props: { as, asChild },
    slots: { default: 'The helper text.' },
    events: {},
    a11y: ['It is added to the control aria-describedby.'],
    dos: ['Use it for format hints and constraints.'],
    donts: ['Do not repeat the label.'],
  }),
  AFieldError: defineDocs(FieldError, {
    summary: 'The error message. It renders only while the field is invalid.',
    props: { as, asChild },
    slots: { default: 'A custom message. Without it, the field error or the form error is shown.' },
    events: {},
    a11y: ['It is an alert, so a screen reader announces it when it appears, and it is added to aria-describedby.'],
    dos: ['Say what is wrong and how to fix it.'],
    donts: ['Do not rely on colour alone.'],
  }),
  AFieldControl: defineDocs(FieldControl, {
    summary: 'An input wired to its field: id, name, required, disabled, aria-invalid and aria-describedby.',
    props: { as, asChild },
    slots: { default: 'Content for non-input elements.' },
    events: {},
    a11y: ['Use as-child to wire your own control, such as a select or a custom input.'],
    dos: ['Use it for controls that do not have a field-aware component yet.'],
    donts: ['Do not set id on the control yourself; the field owns it.'],
  }),
}
