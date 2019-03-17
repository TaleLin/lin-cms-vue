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

function compareOrder(a, b) {
  if (typeof a.order === 'number' && typeof b.order === 'number') {
    return (a.order - b.order)
  }

  if (typeof a.order === 'number') {
    return -1
  }

  if (typeof b.order === 'number') {
    return 1
  }

  return 0
}

function iteratTree(treeObj, plugin) {
  const pluginName = plugin.package.name.slice('lc-plugin-'.length)
  let result
  if (treeObj.type === 'directory') {
    result = {
      type: 'folder',
      name: treeObj.name,
      title: plugin.package.title,
      icon: plugin.package.linIcon,
      inNav: true,
      auths: {
        role: null,
        right: null,
      },
      order: plugin.package.linOrder || null,
    }
    result.children = treeObj.children.map(item => iteratTree(item, plugin))
      .filter(item => !!item)
    result.children.sort(compareOrder)
  } else {
    result = getViewConfig(treeObj, pluginName)
  }
  return result
}

// eslint-disable-next-line
console.log(chalk.green('开始自动构建插件配置...'));

const targetDir = path.resolve(__dirname, '../src/plugins/configs.json')
const pluginsPath = path.resolve(__dirname, '../src/plugins')
const viewConfig = {}
const puginList = getPlugins(pluginsPath)
puginList.forEach((item) => {
  const viewPath = path.resolve(item.path, './views')
  const tree = dirTree(viewPath, {
    extensions: /\.vue$/,
  })
  if (!item.package.linIcon) {
    console.log(chalk.yellow(`${item.name} 不符合 Lin-CMS 插件规范`))
    return
  }
  viewConfig[item.name] = iteratTree(tree, item)
  // 子文件夹自动找index页面, folderTitle, folderIcon, folderRoute
  viewConfig[item.name].children.forEach((subItem) => {
    if (subItem.type !== 'folder') {
      return
    }
    const indexView = subItem.children.find(view => (view.name.slice(-5) === 'index'))
    if (indexView) {
      // eslint-disable-next-line
      subItem.name = item.name + subItem.name
      // eslint-disable-next-line
      subItem.title = indexView.folderTitle || indexView.title
      // eslint-disable-next-line
      subItem.inNav = indexView.inNav
      // eslint-disable-next-line
      subItem.icon = indexView.folderIcon || indexView.icon
      // eslint-disable-next-line
      subItem.route = indexView.folderRoute || indexView.route
      // eslint-disable-next-line
      subItem.order = indexView.folderOrder || indexView.order
      // 如果有 index 文件夹, name认为该文件夹以 tab 方式展示
      // eslint-disable-next-line
      subItem.type = 'tab'
    }
  })
})

puginList.sort(compareOrder)

fs.writeFile(targetDir, JSON.stringify(viewConfig, null, 2))
// fs.outputFileSync(targetDir, JSON.stringify(pluginsConfig));
// eslint-disable-next-line
console.log(chalk.green(`插件配置完成: ${targetDir}\n`))
