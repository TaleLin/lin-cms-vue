module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: [
    'vue',
  ],
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': [0, 'error', 'windows'],
    'import/extensions': 0, // import不需要写文件扩展名
    'import/no-unresolved': 0,
    // 'import/no-duplicates': 0,
    'no-underscore-dangle': 0, // 无下划线
    camelcase: 0, // 变量可以用下划线
    semi: ['error', 'never'], // 无分号
    'no-plusplus': 0, // 禁止使用++，--
    // 'no-tabs': [o],
    'guard-for-in': 0,
    'max-len': ['error', { code: 200 }],
    'no-restricted-syntax': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['script/**/*.js'] }],
    'no-restricted-syntax': 0,
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
