const chalk = require('chalk')
const semver = require('semver')
const exec = require('./exec-promise')

// 获取当前安装包版本
const getLocalVersion = async (pkg, isDev) => {
  let lsInfo
  try {
    lsInfo = JSON.parse(await exec(`npm ls ${pkg} --json --depth=0 ${isDev ? '--dev' : '--prod'}`))
    if (lsInfo.dependencies) {
      lsInfo = lsInfo.dependencies[pkg].version
    }
  } catch (e) {
    lsInfo = false
  }
  return lsInfo
}

// pkg: 需要安装的包名, isDev: 是否安装到 dev 依赖, pPackage: 项目的 package 文件
const installFuc = async (pkg, version, pPackage = {}, isDev = false) => {
  if (!pkg) {
    throw new Error('未传入需要安装的包名')
  }

  // 参数兼容性处理
  const originPkg = {}
  originPkg.dependencies = pPackage.dependencies || {}
  originPkg.devDependencies = pPackage.devDependencies || {}

  const key = isDev ? 'devDependencies' : 'dependencies'

  // 获取当前安装包版本
  let v = await getLocalVersion(pkg, isDev)

  // 如果未检测到安装包版本, 属于异常, 则本地先安装一下
  if (v) {
    // 检测当前已安装版本是否符合要求
    if (semver.satisfies(v, version)) {
      console.log(`当前已存在依赖 ${pkg}@${v}`)
      return true
    }
  } else {
    console.log(chalk.yellow(`安装依赖 ${pkg}@${version}`))
    await exec(`npm install ${isDev ? '--save-dev' : ''} ${pkg}@${version}`)
    v = await getLocalVersion(pkg, isDev)
  }

  // 本地项目本身无该包
  if (!originPkg[key][pkg]) {
    return true
  }

  // 检测当前已安装版本是否符合要求
  if (semver.satisfies(v, originPkg[key][pkg])) {
    console.log(`当前已存在依赖 ${pkg}@${v}`)
    return true
  }

  // 不符合要求则按照项目要求回滚
  await exec(`npm install ${isDev ? '--save-dev' : ''} ${pkg}@${originPkg[key][pkg]}`)

  // 检测回滚后能否符合要求
  v = await getLocalVersion(pkg, isDev)
  if (semver.satisfies(v, version)) {
    console.log(`已更新依赖 ${pkg}@${v}`)
    return true
  }

  // 回滚后还是不符合, 说明两版本要求冲突
  throw new Error(`依赖包 ${pkg} 与本地版本有冲突, 版本要求是 ${version}, 本地项目要求是 ${originPkg[key][pkg]}`)
}

module.exports = installFuc
