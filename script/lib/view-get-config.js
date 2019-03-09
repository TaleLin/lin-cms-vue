// const yaml = require('js-yaml')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const frontYaml = require('yaml-front-matter')

const viewNameRgx = /^[A-Z][A-Za-z0-9]*\.vue$/
const srcDir = path.resolve(__dirname, '../../src')
let vPath
let pName

function getId() {
  const list = vPath.slice(0, -4).split(path.sep)
  list[0] = 'p'
  return list.join('_').toLowerCase()
}

function getName(name) {
  if (name === 'index.vue') {
    const list = vPath.split(path.sep)
    return list[list.length - 2]
  }
  return pName + name.slice(0, -4)
}

function getRoute() {
  const list = vPath.slice(0, -4).split(path.sep)
  list[0] = ''
  list[1] = pName

  if (list[list.length - 1] === 'index') {
    list.pop()
  }
  return list.join('/')
}

function checkConfig(config) {
  if (Object.keys(config).length === 0) {
    console.log(chalk.yellow(`${vPath} 找不到配置部分`))
  }
}

module.exports = (viewObj, pluginName = '') => {
  const config = frontYaml.loadFront(fs.readFileSync(viewObj.path, 'utf8'))
  delete config.__content

  checkConfig(config)
  vPath = path.relative(srcDir, viewObj.path)
  pName = pluginName
  const result = {
    id: getId(),
    filePath: vPath,
    route: getRoute(),
    name: getName(viewObj.name),
    type: 'view',
  }

  if (!viewNameRgx.test(viewObj.name)) {
    if (viewObj.name !== 'index.vue') {
      // eslint-disable-next-line
      console.log(chalk.yellow(`WARNING: 页面不满足命名规范, 驼峰命名且首字母需大写:\npath: ${viewObj.path}\n`))
    }
  }

  return Object.assign(result, config)
}
