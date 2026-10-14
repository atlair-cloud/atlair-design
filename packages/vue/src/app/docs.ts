import { defineDocs } from '../docs.ts'
import App from './App.vue'

export default defineDocs(App, {
  summary: 'The app-level wrapper: AConfigProvider plus the tooltip provider and the toast viewport.',
  props: {
    dir: 'Reading direction, ltr or rtl. Flips layout and is inherited by every component inside.',
    locale: 'Locale used by components that format dates, numbers and lists. Defaults to en.',
    reducedMotion: 'user follows the operating system setting, always turns motion off, never keeps it on.',
    teleportTo: 'Where dialogs, popovers and tooltips render. A CSS selector, or leave empty for the body.',
    nonce: 'A CSP nonce applied to the style tags that components inject.',
  },
  slots: { default: 'The whole app.' },
  events: {},
  a11y: ['The toast viewport is a labelled region, so screen readers can reach notifications with a shortcut.'],
  dos: ['Mount it once, at the root of the app.'],
  donts: ['Do not nest AApp; nest AConfigProvider to change a setting for one section.'],
})
