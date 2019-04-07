// 手动添加完插件后执行此脚本进行初始化动作

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const child_process = require('child_process')
const shell = require('shelljs')
const inquirer = require('inquirer')
const semver = require('semver')
const getPluginDep = require('./lib/plugin-get-dep')
const getAllPlugin = require('./lib/plugin-get-all')

let hasError = false
const projectPackage = require('../package.json')

const pluginsPath = path.resolve(__dirname, '../src/plugins')
const puginList = getAllPlugin(pluginsPath)

// 执行命令
function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (error, stdout) => {
      if (error && error.code !== 1) {
        hasError = true
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
}

// 将数组 forEach 异步化
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line
    await callback(array[index], index, array);
  }
}

// 监测 npm 是否已安装
if (!shell.which('npm')) {
  console.log(chalk.red('检测到未安装 npm, 请先安装 npm 再重新执行, 查看: https://www.npmjs.com/get-npm'))
  process.exit(1)
}

async function handler() {
  let answer
  if (!process.argv[2]) { // 是否已使用命令行传入参数
    const questions = []
    questions.push({
      type: 'list',
      name: 'name',
      choices: puginList.map(item => item.name),
      message: '请选择需要初始化的插件\n',
    })
    answer = await inquirer.prompt(questions)
    answer = answer.name
  } else {
    // eslint-disable-next-line
    answer = process.argv[2]
    const filePath = path.resolve(__dirname, `../src/plugins/${answer}`)
    if (!fs.existsSync(filePath)) {
      console.log(chalk.red('项目中不存在该插件', answer))
      process.exit(1)
      return
    }
  }

  // 判断支持所有插件还是特定插件
  if (answer === 'ALL') {
    console.log(chalk.green('开始初始化所有插件'))
  } else {
    console.log(chalk.green(`开始初始化插件${answer}`))
  }

  if (answer === 'ALL') {
    await asyncForEach(puginList, async (item) => {
      console.log(`- 初始化插件 ${item.name}...`)
      const itemPk = item.package
      await asyncForEach(Object.keys(itemPk.dependencies), async (plugin) => {
        // prod
        const lsPackage = JSON.parse(await exec(`npm ls ${plugin} --json --depth=0 --prod`))
        let v = false
        let ifInstall = true

        if (lsPackage.dependencies) {
          v = lsPackage.dependencies[plugin].version
        }

        if (v) {
          ifInstall = !semver.satisfies(v, itemPk.dependencies[plugin])
        }

        if (ifInstall) {
          console.log(chalk.yellow(`安装依赖 ${plugin}@${itemPk.dependencies[plugin]}`))
          await exec(`npm install ${plugin}@${itemPk.dependencies[plugin]}`)
        } else {
          console.log(`当前已存在依赖 ${plugin}@${v}`)
        }
      })
      await asyncForEach(Object.keys(itemPk.devDependencies), async (plugin) => {
        // dev
        const lsPackage = JSON.parse(await exec(`npm ls ${plugin} --json --depth=0 --dev`))
        let v = false
        let ifInstall = true

        if (lsPackage.dependencies) {
          v = lsPackage.dependencies[plugin].version
        }

        if (v) {
          ifInstall = !semver.satisfies(v, itemPk.devDependencies[plugin])
        }

        if (ifInstall) {
          console.log(chalk.yellow(`安装依赖 ${plugin}@${itemPk.devDependencies[plugin]}`))
          await exec(`npm install --save-dev ${plugin}@${itemPk.devDependencies[plugin]}`)
        } else {
          console.log(`当前已存在依赖 ${plugin}@${v}`)
        }
      })
    })
  } else {
    const itemPk = getPluginDep(answer)
    await asyncForEach(Object.keys(itemPk.dependencies), async (plugin) => {
      // prod
      const lsPackage = JSON.parse(await exec(`npm ls ${plugin} --json --depth=0 --prod`))
      let v = false
      let ifInstall = true

      if (lsPackage.dependencies) {
        v = lsPackage.dependencies[plugin].version
      }

      if (v) {
        ifInstall = !semver.satisfies(v, itemPk.dependencies[plugin])
      }

      if (ifInstall) {
        console.log(chalk.yellow(`安装依赖 ${plugin}@${itemPk.dependencies[plugin]}`))
        try {
          await exec(`npm install ${plugin}@${itemPk.dependencies[plugin]}`)
          const v2 = (JSON.parse(await exec(`npm ls ${plugin} --json --depth=0 --prod`)).dependencies[plugin].version)
          if (!semver.satisfies(v2, projectPackage.dependencies[plugin])) {
            console.log(chalk.red(`检查到插件 ${answer} 依赖 ${plugin} 有冲突, 请手动解决`))
            await exec(`npm install ${plugin}@${projectPackage.dependencies[plugin]}`)
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        console.log(`当前已存在依赖 ${plugin}@${v}`)
      }
    })
    await asyncForEach(Object.keys(itemPk.devDependencies), async (plugin) => {
      // dev
      const lsPackage = JSON.parse(await exec(`npm ls ${plugin} --json --depth=0 --dev`))
      let v = false
      let ifInstall = true

      if (lsPackage.dependencies) {
        v = lsPackage.dependencies[plugin].version
      }

      if (v) {
        ifInstall = !semver.satisfies(v, itemPk.devDependencies[plugin])
      }

      if (ifInstall) {
        console.log(chalk.yellow(`安装依赖 ${plugin}@${itemPk.devDependencies[plugin]}`))
        try {
          await exec(`npm install --save-dev ${plugin}@${itemPk.devDependencies[plugin]}`)
          const v2 = (JSON.parse(await exec(`npm ls ${plugin} --json --depth=0 --dev`)).dependencies[plugin].version)
          if (!semver.satisfies(v2, projectPackage.devDependencies[plugin])) {
            console.log(chalk.red(`检查到插件 ${answer} 依赖 ${plugin} 有冲突, 请手动解决`))
            await exec(`npm install ${plugin}@${projectPackage.devDependencies[plugin]}`)
          }
        } catch (err) {}
      } else {
        console.log(`当前已存在依赖 ${plugin}@${v}`)
      }
    })
  }

  if (!hasError) {
    console.log(chalk.green('插件初始化完毕'))
  } else {
    console.log(chalk.yellow('插件初始化结束, 但存在问题, 请手动解决'))
  }
}

handler()
