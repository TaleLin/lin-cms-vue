const chalk = require('chalk')
const yaml = require('js-yaml')
const fs = require('fs-extra')
const path = require('path')

const configRgx = /<!-- CONFIG([\s\S]*)CONFIG -->/
const viewNameRgx = /^[A-Z][A-Za-z0-9]*\.vue$/
const srcDir = path.resolve(__dirname, '../../src')

function getPathId(pathStr) {
  const pathArr = pathStr.split('/').filter(item => (item && item[0] !== ':'))
  return pathArr.join('_')
}

module.exports = (viewObj, pluginName = '') => {
  // console.log(pluginName)
  let configCtx = fs.readFileSync(viewObj.path, 'utf8').match(configRgx)
  // console.log(path.relative(srcDir, viewObj.path))

  const result = {
    filePath: path.relative(srcDir, viewObj.path),
    path: pluginName + path.relative(srcDir, viewObj.path).slice(5, -4).toLowerCase(),
    name: pluginName + viewObj.name.slice(0, -4),
    type: 'view',
    id: getPathId(path.relative(srcDir, viewObj.path).slice(5, -4).toLowerCase()),
  }

  if (!viewNameRgx.test(viewObj.name)) {
    if (viewObj.name !== 'index.vue') {
      // eslint-disable-next-line
      console.log(chalk.yellow(`WARNING: 页面不满足命名规范, 驼峰命名且首字母需大写:\npath: ${viewObj.path}\n`))
    }
  }

  if (!configCtx) {
    // 提示该页面未找到页面配置
    // eslint-disable-next-line
    console.log(chalk.yellow(`WARNING: 未找到页面配置:\npath: ${viewObj.path}\n`));
    // 返回默认
    return false
  }

  // eslint-disable-next-line
  configCtx = configCtx[1]

  try {
    configCtx = yaml.safeLoad(configCtx)
  } catch (e) {
    // eslint-disable-next-line
    console.log(chalk.red(`ERROR: 页面配置解析失败:\npath: ${viewObj.path}\n`))
    process.exit(1)
  }

  result.path = configCtx.path || result.path
  result.name = configCtx.name || result.name

  return Object.assign(configCtx, result)
}
