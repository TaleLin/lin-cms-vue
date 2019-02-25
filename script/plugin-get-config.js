const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

function isDirectory(source) {
  return fs.lstatSync(source).isDirectory()
}

function isPlugin(source) {
  return isDirectory(source)
}

function getPlugins(source) {
  const srcPath = path.resolve(__dirname, '../src')
  const folders = fs.readdirSync(source)
  const pluginsConfig = [];

  folders.forEach((item) => {
    const itemPath = path.join(source, item)
    if (!isPlugin(itemPath)) {
      return
    }
    const config = {};
    config.name = item
    config.path = `@/plugins/${item}/`;
    config.package = JSON.parse(fs.readFileSync(path.resolve(itemPath, './package.json'), 'utf8'));
    pluginsConfig.push(config)
  })

  return pluginsConfig
}

const pluginsPath = path.resolve(__dirname, '../src/plugins')
const pluginsConfig = getPlugins(pluginsPath)
const targetDir = path.resolve(__dirname, '../src/plugins/configs.json')

fs.outputFileSync(targetDir, JSON.stringify(pluginsConfig));
// eslint-disable-next-line
console.log(chalk.green(`已获取插件配置: path: ${targetDir}`))
