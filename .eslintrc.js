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
    'max-len': 0,
    camelcase: 0, // 变量可以用下划线
    'no-plusplus': 0, // 禁止使用++，--
    'guard-for-in': 0,
    'no-extra-semi': 0, // 和prettier冲突
    'import/extensions': 0, // import不需要写文件扩展名
    semi: ['error', 'never'], // 无分号
    'import/no-unresolved': 0,
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0, // 无下划线
    'no-restricted-syntax': 0,
    'consistent-return': 'off',
    'max-len': ['error', { code: 200 }],
    'no-use-before-define': 'off',
    'no-prototype-builtins': 'off',
    'class-methods-use-this': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'only-multiline'],
    'no-param-reassign': ['error', { props: false }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['script/**/*.js'] }],
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: 'never',
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
