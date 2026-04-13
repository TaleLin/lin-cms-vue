module.exports = {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['dist/**', 'coverage/**', 'node_modules/**', 'public/**', 'src/assets/style/fonts/**'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'alpha-value-notation': 'number',
    'color-function-alias-notation': 'with-alpha',
    'color-function-notation': 'legacy',
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'scss/dollar-variable-pattern': '^(?:--)?[a-z][a-z0-9-]*$',
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9-]*(?:__[a-zA-Z0-9-]+)?(?:--[a-zA-Z0-9-]+)?$',
      {
        resolveNestedSelectors: true,
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'selector-pseudo-element-colon-notation': 'single',
  },
}
