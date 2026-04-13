const js = require('@eslint/js')
const globals = require('globals')
const pluginVue = require('eslint-plugin-vue')
const vueParser = require('vue-eslint-parser')

const appFiles = ['src/**/*.{js,vue}']
const browserScriptFiles = ['src/**/*.js']
const scriptFiles = [
  'script/**/*.js',
  'eslint.config.js',
  'postcss.config.js',
  '.prettierrc.js',
  'commitlint.config.cjs',
  'stylelint.config.cjs',
]
const configFiles = ['vite.config.mjs', 'vitest.config.mjs', 'vite.shared.mjs', 'playwright.config.mjs']
const testFiles = ['tests/**/*.js']
const browserGlobals = {
  ...globals.browser,
  ...globals.es2024,
}
const nodeGlobals = {
  ...globals.node,
  ...globals.es2024,
}
const testGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.vitest,
  ...globals.es2024,
}

module.exports = [
  {
    ignores: ['dist/**', 'public/**', 'node_modules/**', 'coverage/**', '.vite/**', 'script/.cache/**'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: browserScriptFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: browserGlobals,
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: browserGlobals,
    },
    rules: {
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['App'],
        },
      ],
      'vue/no-unused-components': 'error',
      'vue/no-v-html': 'error',
    },
  },
  {
    files: scriptFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: nodeGlobals,
    },
  },
  {
    files: configFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: nodeGlobals,
    },
  },
  {
    files: testFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: testGlobals,
    },
  },
  {
    files: [...appFiles, ...scriptFiles, ...configFiles],
    rules: {
      'arrow-parens': ['error', 'as-needed'],
      'comma-dangle': ['error', 'only-multiline'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-alert': 'error',
      'no-duplicate-imports': 'error',
      'no-param-reassign': ['error', { props: false }],
      'no-shadow': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^(?:_|_.*|e|err|from)$',
          caughtErrorsIgnorePattern: '^(?:_|_.*|e|err)$',
        },
      ],
      'no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
        },
      ],
      'no-useless-return': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      semi: ['error', 'never'],
    },
  },
  {
    files: [...browserScriptFiles, '**/*.vue', ...configFiles],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },
  {
    files: testFiles,
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'vue/no-v-html': 'error',
    },
  },
]
