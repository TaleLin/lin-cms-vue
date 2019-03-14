// 手动添加完插件后执行此脚本进行初始化动作

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const child_process = require('child_process')
const shell = require('shelljs')
const inquirer = require('inquirer')
const semver = require('semver')
const getPluginDep = require('./lib/plugin-get-dep')
const pluginList = require('./lib/plugin-get-all')

let hasError = false
const projectPackage = require('../package.json')

function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (error, stdout) => {
      if (error) {
        hasError = true
        reject(error)
      }
      resolve(stdout)
    })
  })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line
    await callback(array[index], index, array);
  }
}

// 安装插件
if (!shell.which('npm')) {
  console.log(chalk.red('检测到未安装 npm, 请先安装 npm 再重新执行, 查看: https://www.npmjs.com/get-npm'))
  process.exit(1)
}

async function handler() {
  let answer
  const questions = []
  if (!process.argv[2]) {
    questions.push({
      type: 'input',
      name: 'name',
      message: '如需要初始化特定插件, 请输入插件名, 如需初始化所有插件请直接回车\n',
      validate(value) {
        const done = this.async()
        setTimeout(() => {
          if (!value) {
            done(null, true)
            return
          }

          const filePath = path.resolve(__dirname, `../src/plugins/${value}`)
          if (!fs.existsSync(filePath)) {
            done('项目中不存在该插件, 请输入项目中已有插件名')
            return
          }
          done(null, true)
        })
      },
    })
    answer = await inquirer.prompt(questions)
    answer = answer.name
  } else {
    // eslint-disable-next-line
    answer = process.argv[2]
  }

  if (!answer) {
    console.log(chalk.green('开始初始化所有插件'))
  } else {
    console.log(chalk.green(`开始初始化插件${answer}`))
  }

  if (!answer) {
    await asyncForEach(pluginList, async (item) => {
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
        } catch(err) {}
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
