const fs = require('fs-extra')
const path = require('path')

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

const pluginsPath = path.resolve(__dirname, '../../src/plugins')
module.exports = getPlugins(pluginsPath)
