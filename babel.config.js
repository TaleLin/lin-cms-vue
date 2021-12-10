module.exports = {
  presets: [['@vue/cli-plugin-babel/preset']],
  plugins: [
    //去除element babel 新版直接手动导入即可
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
}
