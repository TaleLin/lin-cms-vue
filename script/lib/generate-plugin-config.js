const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const prettier = require('prettier')
const getAllPlugin = require('./plugin-get-all')

const targetPath = path.resolve(__dirname, '../../src/config/stage/plugin.js')
const pluginsPath = path.resolve(__dirname, '../../src/plugin')
const templatePath = path.resolve(__dirname, '../template/plugin-stage-config.js.ejs')

async function renderPluginConfig(plugins) {
  const template = fs.readFileSync(templatePath, 'utf8')
  const result = ejs.render(template, { plugins })
  const prettierConfig = (await prettier.resolveConfig(targetPath)) || {}

  return prettier.format(result, {
    ...prettierConfig,
    filepath: targetPath,
  })
}

async function generatePluginConfig() {
  const plugins = getAllPlugin(pluginsPath)
  const result = await renderPluginConfig(plugins)

  fs.outputFileSync(targetPath, result)

  return {
    plugins,
    result,
    targetPath,
  }
}

module.exports = generatePluginConfig
module.exports.renderPluginConfig = renderPluginConfig
