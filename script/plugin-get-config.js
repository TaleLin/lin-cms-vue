const path = require('path')
const chalk = require('chalk')
const generatePluginConfig = require('./lib/generate-plugin-config')

const targetDir = path.resolve(__dirname, '../src/config/stage/plugin.js')

async function main() {
  console.log(chalk.green('配置插件...'))

  await generatePluginConfig()

  console.log(chalk.green(`插件配置完成: ${targetDir}\n`))
}

if (require.main === module) {
  main().catch(error => {
    console.log(chalk.red('插件配置失败'))
    console.error(error)
    process.exit(1)
  })
}

module.exports = main
