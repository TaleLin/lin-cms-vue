import Util from '@/lin/utils/util'

let stageMap = {}

const deepTravel = (obj, fuc) => {
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      deepTravel(item, fuc)
    })
    return
  }
  if (obj && obj.children) {
    fuc(obj)
    deepTravel(obj.children, fuc)
    return
  }
  if (obj.name) {
    fuc(obj)
  }
}

export const logined = state => state.logined

export const user = state => state.user

export const readedMessages = state => state.readedMessages

export const unreadMessages = state => state.unreadMessages

function IterationDelateMenuChildren(arr) {
  if (arr.length) {
    for (const i in arr) {
      if (arr[i].children && !arr[i].children.length) {
        delete arr[i] // eslint-disable-line
      } else if (arr[i].children && !arr[i].children.length) {
        IterationDelateMenuChildren(arr[i].children)
      }
    }
  }
  return arr
}

function permissionShaking(stageConfig, auths, user) { // eslint-disable-line
  const shookConfig = stageConfig.filter((route) => {
    if (Util.hasPermission(auths, route, user)) {
      if (route.children && route.children.length) {
        route.children = permissionShaking(route.children, auths, user) // eslint-disable-line
      }
      return true
    }
    return false
  })
  return IterationDelateMenuChildren(shookConfig)
}

// 获取有权限的舞台配置
export const authStageConfig = (state) => {
  const { stageConfig, auths, user } = state // eslint-disable-line
  const tempStageConfig = Util.deepClone(stageConfig)
  const shookConfig = permissionShaking(tempStageConfig, auths, user)

  // 设置舞台缓存
  const list = {}
  deepTravel(shookConfig, (item) => {
    list[item.name] = (item)
  })
  stageMap = list
  return shookConfig
}

// 获取侧边栏配置
export const sideBarList = (state, getter) => {
  const { sideBarLevel } = state // eslint-disable-line
  const { authStageConfig } = getter // eslint-disable-line

  function deepGetSideBar(target, level = 3) {
    // 集合节点处理
    if (Array.isArray(target)) {
      const acc = target.map(item => deepGetSideBar(item, (level - 1)))
      return acc.filter(item => (item !== null))
    }

    // 检测是否需要在导航中显示
    if (!target.inNav) {
      return null
    }

    if (target.type === 'folder' && level !== 0) { // 处理 folder 模式
      const sideConfig = {}
      sideConfig.name = target.name
      sideConfig.title = target.title
      sideConfig.icon = target.icon
      sideConfig.path = target.route || Util.getRandomStr(6)
      sideConfig.children = target.children.map(item => deepGetSideBar(item, (level - 1)))
      sideConfig.children = sideConfig.children.filter(item => (item !== null))
      return sideConfig
    }

    // 处理一级就是 view 的情况
    if (target.type === 'view') {
      const sideConfig = {}
      sideConfig.name = target.name
      sideConfig.title = target.title
      sideConfig.icon = target.icon
      sideConfig.path = target.route
      return sideConfig
    }

    // 处理 appTab 情况
    if (target.type === 'tab') {
      const sideConfig = {}
      sideConfig.name = target.name
      sideConfig.title = target.title
      sideConfig.icon = target.icon
      sideConfig.path = target.route
      // 如果 Tab 没有设置默认打开的路由, 则设置为第一个子节点路由
      if (!sideConfig.path) {
        if (target.children && target.children.length > 0 && target.children[0].route) {
          sideConfig.path = target.children[0].route
        }
      }
      return sideConfig
    }
    // 最后一层, 都当做子节点处理
    if (level <= 0) {
      const sideConfig = {}
      sideConfig.name = target.name
      sideConfig.title = target.title
      sideConfig.icon = target.icon
      sideConfig.path = Util.getRandomStr(6)
      if (target.children && target.children.length > 0 && target.children[0].route) {
        sideConfig.path = target.children[0].route
      }
      return sideConfig
    }
    return null
  }

  const sideBar = deepGetSideBar(authStageConfig, sideBarLevel)
  return sideBar
}

// 获取有权限的所有节点配置对象
// eslint-disable-next-line
export const getStageByName = () => {
  return name => stageMap[name]
}

// 获取有权限的所有节点配置对象
// eslint-disable-next-line
export const getStageByRoute = () => {
  return (path) => {
    const result = Object.getOwnPropertySymbols(stageMap).find(key => (stageMap[key].route === path))
    return stageMap[result]
  }
}

export const stageList = () => stageMap

export const auths = state => state.auths

export const getStageInfo = (state) => {
  const { stageConfig } = state
  const cache = {}
  const findStage = (stages, name) => {
    let result
    if (Array.isArray(stages)) {
      for (let i = 0; i < stages.length; i += 1) {
        result = findStage(stages[i], name)
        if (result) {
          break
        }
      }
      return result
    }

    if (stages.children) {
      result = findStage(stages.children, name)
      if (result) {
        result.unshift(stages)
      }
      return result
    }

    if (stages.name === name) {
      return [stages]
    }
    return false
  }
  return (name) => {
    if (cache[name]) {
      return cache[name]
    }
    const stageInfo = findStage(stageConfig, name)
    if (stageInfo) {
      cache[name] = stageInfo
    }
    return stageInfo
  }
}
