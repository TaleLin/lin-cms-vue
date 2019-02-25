const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')
const chalk = require('chalk')

const questions = []

questions.push({
  type: 'input',
  name: 'name',
  message: '请输入插件名, 多个单词以 "-" 连接, 如: user-permission\n',
  validate(value) {
    const done = this.async()
    setTimeout(() => {
      if (!value) {
        done('不可为空')
        return
      }

      const regex = /^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)*/

      if (!regex.test(value)) {
        done('检测到格式错误, 多个单词以 "-" 连接, 如: user-permission')
        return
      }

      const filePath = path.resolve(__dirname, `../src/plugins/${value}`)
      if (fs.existsSync(filePath)) {
        done('项目中已存在该插件, 请更换其他插件名')
        return
      }
      done(null, true)
    })
  },
})

questions.push({
  type: 'input',
  name: 'version',
  message: '请输入版本号\n',
  default: '1.0.0',
})

questions.push({
  type: 'input',
  name: 'description',
  message: '简述插件处理的业务场景\n',
  default: '',
})

questions.push({
  type: 'input',
  name: 'author',
  message: '请输入作者\n',
  default: '',
})

inquirer.prompt(questions).then((answers) => {
  const result = answers
  result.camelCaseName = result.name.split('-').map(str => (str.charAt(0).toUpperCase() + str
    .slice(1))).join('')
  return result
}).then((answers) => {
  const config = { ...answers }
  // 创建缓存文件夹 .cache
  const cachePath = path.resolve(__dirname, './.cache')
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath)
  }
  // 清空 plugin 文件夹
  const cachePluginPath = path.resolve(__dirname, './.cache/plugin')
  if (fs.existsSync(cachePluginPath)) {
    fs.removeSync(cachePluginPath)
  }
  fs.mkdirSync(cachePluginPath)

  const structure = [{
    path: 'README.md',
  }, {
    path: 'generator.js',
  }, {
    path: 'package.json',
  }, {
    path: 'router.js',
  }, {
    path: 'generator.js',
  }, {
    path: 'views/TestView.vue',
  }, {
    path: 'components/Test.vue',
  }]

  structure.forEach((file) => {
    const template = fs.readFileSync(path.resolve(__dirname, `./template/plugin/${file.path}.ejs`), 'utf8')
    const result = ejs.render(template, config)
    const targetPath = path.resolve(__dirname, `./.cache/plugin/${file.path}`)
    fs.outputFileSync(targetPath, result)
  })

  return config
}).then((answers) => {
  // 复制 .cache 到 plugin
  const sourcePath = path.resolve(__dirname, './.cache/plugin')
  const targetPath = path.resolve(__dirname, `../src/plugins/${answers.camelCaseName}`)
  fs.copySync(sourcePath, targetPath)
  console.log(chalk.green(`创建插件${answers.name}: ${targetPath}`))
  // eslint-disable-next-line
}).catch((err) => {
  // eslint-disable-next-line
  console.log(chalk.red('创建插件失败'))
  console.error(err)
  process.exit(1)
})
