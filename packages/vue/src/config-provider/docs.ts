import { defineDocs } from '../docs.ts'
import ConfigProvider from './ConfigProvider.vue'

export default defineDocs(ConfigProvider, {
  summary: 'Sets direction, locale, reduced motion and the teleport target for everything inside it.',
  props: {
    dir: 'Reading direction, ltr or rtl. Flips layout and is inherited by every component inside.',
    locale: 'Locale used by components that format dates, numbers and lists. Defaults to en.',
    reducedMotion: 'user follows the operating system setting, always turns motion off, never keeps it on.',
    teleportTo: 'Where dialogs, popovers and tooltips render. A CSS selector, or leave empty for the body.',
    nonce: 'A CSP nonce applied to the style tags that components inject.',
  },
  slots: { default: 'The part of the app that should use these settings.' },
  events: {},
  a11y: ['Set dir to rtl for right-to-left languages so focus order and arrow keys follow the reading direction.'],
  dos: ['Wrap the whole app once, or use AApp.', 'Nest a second provider to give one section another direction.'],
  donts: ['Do not set dir on individual components; set it here.'],
})
