module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  plugins: ['vue'],
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': 0, // import不需要写文件扩展名
    'import/no-unresolved': 0,
    // 'import/no-duplicates': 0,
    'no-underscore-dangle': 0, // 无下划线
    camelcase: 0, // 变量可以用下划线
    semi: ['error', 'never'], // 无分号
    'no-extra-semi': 0, // 和prettier冲突
    'no-plusplus': 0, // 禁止使用++，--
    // 'no-tabs': [o],
    'guard-for-in': 0,
    'max-len': ['error', { code: 200 }],
    'no-restricted-syntax': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['script/**/*.js'] }],
    'no-restricted-syntax': 0,
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-prototype-builtins': 'off',
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: 'never',
      },
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'no-param-reassign': ['error', { props: false }],
    'max-len': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
