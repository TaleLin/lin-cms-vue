const fs = require('fs-extra')
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')
const chalk = require('chalk')
const yaml = require('js-yaml')
const dirTree = require('directory-tree')
const validatePName = require('validate-npm-package-name')
const semver = require('semver')
// const came = require('./lib/util')

const came = str => `${str}`.replace(/-\D/g, match => match.charAt(1).toUpperCase())

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

      const filePath = path.resolve(__dirname, `../src/plugin/${value}`)
      if (fs.existsSync(filePath)) {
        done('项目中已存在该插件, 请更换其他插件名')
        return
      }

      const v = validatePName(`lc-plugin-${value}`)
      if (!v.validForNewPackages) {
        done(v.errors.join(', '))
        return
      }
      done(null, true)
    })
  },
})

questions.push({
  type: 'input',
  name: 'title',
  message: '请输入插件标题, 7个字内\n',
  default: '插件标题',
})

questions.push({
  type: 'input',
  name: 'version',
  message: '请输入版本号\n',
  default: '1.0.0',
  validate(value) {
    const done = this.async()
    if (!semver.valid(value)) {
      done('版本号不符合规范')
      return
    }
    done(null, true)
  },
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

const cachePath = path.resolve(__dirname, './.cache')
const cachePluginPath = path.resolve(__dirname, './.cache/plugin')
const pluginTmpPath = path.resolve(__dirname, './template/plugin')
const pluginViewsPath = path.resolve(__dirname, './template/plugin/view')
const pluginStrPos = __dirname.length + '/template/'.length
const pluginsPath = path.resolve(__dirname, '../src/plugin')

// 检测是否有插件文件夹
if (!fs.existsSync(pluginsPath)) {
  fs.mkdirSync(pluginsPath)
}

inquirer
  .prompt(questions)
  .then(answers => {
    const result = answers
    result.camelCaseName = came(result.name)
    return result
  })
  .then(answers => {
    const config = { ...answers }

    // 创建缓存文件夹 .cache
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath)
    }
    // 清空 plugin 文件夹
    if (fs.existsSync(cachePluginPath)) {
      fs.removeSync(cachePluginPath)
    }
    fs.mkdirSync(cachePluginPath)

    dirTree(pluginTmpPath, {}, item => {
      // 忽略隐藏文件
      if (item.extension === '' || item.name[0] === '.') {
        return
      }
      // 处理模板文件
      if (item.extension === '.ejs') {
        const template = fs.readFileSync(item.path, 'utf8')
        const fileConfig = { ...config }
        // 舞台 view 文件配置处理
        if (item.path.slice(pluginStrPos).split(path.sep)[1] === 'view' && item.name.slice(-8) === '.vue.ejs') {
          const viewConfig = {}
          viewConfig.icon = 'iconfont icon-demo'
          viewConfig.name = fileConfig.camelCaseName + item.name.slice(0, -8)
          viewConfig.route = path
            .join(config.name, path.relative(pluginViewsPath, item.path))
            .split(path.sep)
            .join('/')
          viewConfig.route = `/${viewConfig.route.slice(0, -8)}`
          viewConfig.order = null
          viewConfig.inNav = true
          viewConfig.title = '舞台页'
          viewConfig.type = 'view'
          viewConfig.auths = {
            role: null,
            permission: null,
          }
          viewConfig.needLogin = true
          fileConfig.configYml = yaml.safeDump(viewConfig)
        }
        const result = ejs.render(template, fileConfig)
        const targetPath1 = path.resolve(cachePluginPath, path.relative(pluginTmpPath, item.path).slice(0, -4))
        fs.outputFileSync(targetPath1, result)
        return
      }
      // 拷贝其他文件
      const targetPath1 = path.resolve(cachePluginPath, path.relative(pluginTmpPath, item.path))
      fs.copySync(item.path, targetPath1)
    })

    return config
  })
  .then(answers => {
    // 复制 .cache 到 plugin
    const sourcePath = path.resolve(__dirname, './.cache/plugin')
    const targetPath = path.resolve(__dirname, `../src/plugin/${answers.name}`)
    fs.copySync(sourcePath, targetPath)

    console.log(chalk.green(`创建插件 ${answers.name}: ${targetPath}`))
    // eslint-disable-next-line
  })
  .then(() => {
    // eslint-disable-next-line
    require('./plugin-get-config.js')
    // eslint-disable-next-line
  })
  .catch(err => {
    // eslint-disable-next-line
    console.log(chalk.red('创建插件失败'))
    console.error(err)
    process.exit(1)
  })
