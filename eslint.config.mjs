// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    stylistic: {
      quotes: 'single',
    },
  }),
  {
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'antfu/top-level-function': 'off',
      'comma-dangle': ['error', 'always-multiline'],
      'antfu/if-newline': 'off',
      'curly': ['error', 'multi'],
      'vue/valid-v-slot': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      'unused-imports/no-unused-imports': 'off', // tmp - https://github.com/antfu/eslint-config/issues/464#issuecomment-2084485771
      'antfu/curly': 'off',
      'ts/no-unsafe-function-type': 'off',
      'unused-imports/no-unused-vars': 'warn', // tmp - need to eventually remove the unused imports/vars
    },
  },
)
