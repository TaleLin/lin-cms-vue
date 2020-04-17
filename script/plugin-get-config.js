const fs = require('fs-extra')
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')
const chalk = require('chalk')
const ejs = require('ejs')
const getAllPlugin = require('./lib/plugin-get-all')

const targetDir = path.resolve(__dirname, '../src/config/stage/plugin.js')
const pluginsPath = path.resolve(__dirname, '../src/plugin')
const templatePath = path.resolve(__dirname, './template/plugin-stage-config.js.ejs')

// eslint-disable-next-line
console.log(chalk.green('配置插件...'))

const template = fs.readFileSync(templatePath, 'utf8')
const puginList = getAllPlugin(pluginsPath)
const result = ejs.render(template, { plugins: puginList })

fs.writeFile(targetDir, result)

// eslint-disable-next-line
console.log(chalk.green(`插件配置完成: ${targetDir}\n`))
