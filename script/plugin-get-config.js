const path = require('path')
const chalk = require('chalk')
const generatePluginConfig = require('./lib/generate-plugin-config')

const targetDir = path.resolve(__dirname, '../src/config/stage/plugin.js')

console.log(chalk.green('配置插件...'))

generatePluginConfig()

console.log(chalk.green(`插件配置完成: ${targetDir}\n`))
