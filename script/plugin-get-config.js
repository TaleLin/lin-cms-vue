const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const dirTree = require('directory-tree')
const getViewConfig = require('./lib/view-get-config')

function isPlugin(source) {
  return fs.lstatSync(source).isDirectory()
}

function getPlugins(source) {
  const folders = fs.readdirSync(source)
  const pluginsList = []

  folders.forEach((item) => {
    const itemPath = path.join(source, item)
    if (!isPlugin(itemPath)) {
      return
    }
    const config = {}
    config.name = item
    config.path = path.resolve(__dirname, `../src/plugins/${item}/`)
    config.package = JSON.parse(fs.readFileSync(path.resolve(itemPath, './package.json'), 'utf8'))
    pluginsList.push(config)
  })

  return pluginsList
}

function iteratTree(treeObj, pluginName) {
  let result
  if (treeObj.type === 'directory') {
    result = {
      type: 'directory',
      name: treeObj.name,
    }
    result.children = treeObj.children.map(item => iteratTree(item, pluginName))
      .filter(item => !!item)
  } else {
    result = getViewConfig(treeObj, pluginName)
  }
  return result
}

// eslint-disable-next-line
console.log(chalk.green('开始自动构建插件配置...\n'));

const targetDir = path.resolve(__dirname, '../src/plugins/configs.json')
const pluginsPath = path.resolve(__dirname, '../src/plugins')
const viewConfig = {}
const puginList = getPlugins(pluginsPath)

puginList.forEach((item) => {
  const viewPath = path.resolve(item.path, './views')
  const tree = dirTree(viewPath, {
    extensions: /\.vue$/,
  })
  viewConfig[item.name] = iteratTree(tree, item.name)
})

fs.writeFile(targetDir, JSON.stringify(viewConfig, null, 2))
// fs.outputFileSync(targetDir, JSON.stringify(pluginsConfig));
// eslint-disable-next-line
console.log(chalk.green(`插件配置完成: ${targetDir}`))
