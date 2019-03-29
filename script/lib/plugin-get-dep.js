const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

module.exports = (name) => {
  const result = {
    dependencies: {},
    devDependencies: {},
  }
  const pluginPath = path.resolve(__dirname, `../../src/plugins/${name}/package.json`)
  if (!fs.existsSync(pluginPath)) {
    console.log(chalk.green(`插件 ${name} 中不存在 package.json 文件`))
    return result
  }
  const packageConfig = JSON.parse(fs.readFileSync(pluginPath), 'utf8')
  result.dependencies = packageConfig.dependencies || {}
  result.devDependencies = packageConfig.devDependencies || {}
  return result
}
