// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/max-attributes-per-line': ['warn', { singleline: 5 }],
      '@stylistic/comma-dangle': ['warn', 'only-multiline'],
      '@stylistic/quote-props': ['warn', 'as-needed'],
      '@stylistic/arrow-parens': ['warn', 'as-needed'],
      '@stylistic/max-statements-per-line': ['warn', { max: 3, ignoredNodes: ['BreakStatement'] }],
      'vue/no-multiple-template-root': 'off',
      'vue/html-closing-bracket-newline': [
        'warn',
        {
          singleline: 'never',
          multiline: 'never',
          selfClosingTag: { singleline: 'never', multiline: 'never' },
        },
      ],
    },
  },
)
