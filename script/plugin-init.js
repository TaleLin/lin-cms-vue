// 手动添加完插件后执行此脚本进行初始化动作

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const child_process = require('child_process')
const shell = require('shelljs')
const inquirer = require('inquirer')
const getPluginDep = require('./lib/plugin-get-dep')
const pluginList = require('./lib/plugin-get-all')

let hasError = false
function exec (cmd) {
  try {
    return child_process.execSync(cmd).toString().trim()
  } catch (err) {
    console.log(chalk.red(`初始化插件依赖失败 ${cmd}, 请手动支持`))
    hasError = true
  }
}

// 安装插件
if (!shell.which('npm')) {
  console.log(chalk.red('请安装 npm'))
  process.exit(1)
}

async function handler() {
  let answer
  const questions = []
  if (!process.argv[2]) {
    questions.push({
      type: 'input',
      name: 'name',
      message: '未传入插件名, 如果需要初始化所有插件请回车, 如果需要初始化特定插件, 请输入插件名\n',
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
    console.log(chalk.green('初始化所有插件...'))
  } else {
    console.log(chalk.green(`初始化插件${answer}...`))
  }

  if (!answer) {
    pluginList.forEach((item) => {
      const itemPk = item.package
      Object.keys(itemPk.dependencies).forEach((item) => {
        exec(`npm install ${item}@${itemPk.dependencies[item]}`)
      })
      Object.keys(itemPk.devDependencies).forEach((item) => {
        exec(`npm install --save-dev ${item}@${itemPk.devDependencies[item]}`)
      })
    })
  } else {
    const plugindep = getPluginDep(answer)
    Object.keys(plugindep.dependencies).forEach((item) => {
      exec(`npm install ${item}@${plugindep.dependencies[item]}`)
    })
    Object.keys(plugindep.devDependencies).forEach((item) => {
      exec(`npm install --save-dev ${item}@${plugindep.devDependencies[item]}`)
    })
  }

  if (!hasError) {
    console.log(chalk.green('插件初始化完毕'))
  } else {
    console.log(chalk.yellow('插件初始化结束, 但存在问题, 请手动解决'))
  }
}
handler()
