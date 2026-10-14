import noComments from 'eslint-plugin-no-comments'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const plugins = { 'no-comments': noComments }
const rules = { 'no-comments/disallowComments': ['error', { allow: ['(?!)'] }] }

export default [
  { ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', 'scripts/tests/fixtures/**'] },
  { linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'off' } },
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tseslint.parser },
    plugins,
    rules,
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser, sourceType: 'module' },
    },
    plugins,
    rules,
  },
]
