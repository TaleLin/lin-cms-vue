// 手动添加完插件后执行此脚本进行初始化动作
const fs = require('fs-extra')
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')
const chalk = require('chalk')
const shell = require('shelljs')
const inquirer = require('inquirer')
const getAllPlugin = require('./lib/plugin-get-all')
const semverValidate = require('./lib/semver-validate')
const installDep = require('./lib/install-dep')

const projectPackage = require('../package.json')

const pluginsPath = path.resolve(__dirname, '../src/plugin')
// 检测是否有插件文件夹
if (!fs.existsSync(pluginsPath)) {
  console.log(chalk.red('未找到插件文件夹目录, 请确认 src 文件夹中是否有 plugins 目录'))
  process.exit(1)
}

const pluginList = getAllPlugin(pluginsPath)

// 将数组 forEach 异步化
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line
    await callback(array[index], index, array)
  }
}

// 监测 npm 是否已安装
if (!shell.which('npm')) {
  console.log(chalk.red('检测到未安装 npm, 请先安装 npm 再重新执行, 查看: https://www.npmjs.com/get-npm'))
  process.exit(1)
}

async function handler() {
  const questions = [
    {
      type: 'checkbox',
      name: 'plugin',
      choices: pluginList.map(item => ({ name: item.name, value: item })),
      message: '请选择需要初始化的插件\n',
    },
  ]

  const { plugins } = await inquirer.prompt(questions)

  if (plugins.length === 0) {
    console.log('未选择需要初始化的插件')
    return
  }

  console.log(chalk.green(`开始初始化插件 ${plugins.map(item => item.name).join(', ')}`))

  await asyncForEach(plugins, async ({ name, packageCtx }) => {
    console.log(`* 插件 ${name}`)
    const keys = ['dependencies', 'devDependencies']
    let hasError = false

    await asyncForEach(keys, async key => {
      await asyncForEach(Object.keys(packageCtx[key]), async pkg => {
        const v1 = packageCtx[key][pkg]
        const v2 = projectPackage[key][pkg]
        if (v1 && v2) {
          if (!semverValidate(v1, v2)) {
            return
          }
        }
        try {
          await installDep(pkg, v1, projectPackage, key === 'devDependencies')
        } catch (e) {
          hasError = true
          console.log(chalk.red(e.message))
        }
        // const result = await installDep(pkg, v1, projectPackage, (key === 'devDependencies'))
        // if (result instanceof Error) {
        //   hasError = true
        //   console.log(chalk.red(result.message))
        // }
      })
    })

    if (hasError) {
      console.log(chalk.yellow('插件初始化结束, 但存在问题, 请手动解决'))
    }
  })
}

handler().then(() => {
  // eslint-disable-next-line
  require('./plugin-get-config')
})
