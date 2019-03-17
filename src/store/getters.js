// import pluginConfig from '@/plugins/configs.json'

// 返回 n 位的随机字符串
const getRandomStr = function getRandomStr(n) {
  let str = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  for (let i = 0; i < n; i += 1) {
    str += chars.charAt(Math.floor(Math.random() * 62))
  }
  return str
}


// function addPlugin(pluginViewConfig) {
//   // console.log(current)
//   const plluginSideBar = []
//   // debugger
//   Object.keys(pluginViewConfig).forEach((plugin) => {
//     const sideBar = {
//       children: [],
//       meta: {
//         title: pluginViewConfig[plugin].title,
//         icon: pluginViewConfig[plugin].icon,
//       },
//       path: getRandomStr(6),
//       name: pluginViewConfig[plugin].name,
//     }
//     pluginViewConfig[plugin].children.forEach((item) => {
//       if (!item.inSideNav) {
//         return
//       }

//       sideBar.children.push({
//         path: item.route,
//         name: item.name,
//         meta: {
//           title: item.title,
//           icon: item.icon,
//           auths: item.permission,
//         },
//       })
//     })
//     plluginSideBar.push(sideBar)
//   })
//   return plluginSideBar
// }

export const logined = state => state.logined

export const user = state => state.user

export const tabs = state => state.tabs

export const menuTabs = state => state.menuTabs

export const readedMessages = state => state.readedMessages

export const unreadMessages = state => state.unreadMessages

export const defaultActive = state => state.defaultActive

export const sideBarList = (state) => {
  const { stageConfig } = state

  function deepTravel(target, level = 2) {
    // 集合节点处理
    if (Array.isArray(target)) {
      const acc = target.map(item => deepTravel(item, (level - 1)))
      return acc.filter(item => (item !== null))
    }

    // 检测是否需要在导航中显示
    if (!target.inNav) {
      return null
    }

    if (target.type === 'folder') { // 处理 folder 模式
      const sideConfig = {}
      sideConfig.title = target.title
      sideConfig.icon = target.icon
      sideConfig.path = getRandomStr(6)
      sideConfig.children = target.children.map(item => deepTravel(item, (level - 1)))
      sideConfig.children = sideConfig.children.filter(item => (item !== null))
      return sideConfig
    }

    // 处理一级就是 view 的情况
    if (target.type === 'view') {
      const sideConfig = {}
      sideConfig.title = target.title
      sideConfig.icon = target.icon
      sideConfig.path = target.route
      return sideConfig
    }
    // 处理 appTab 情况
    if (target.type === 'tab') {
      const sideConfig = {}
      sideConfig.title = target.title
      sideConfig.icon = target.icon
      sideConfig.path = target.route
      return sideConfig
    }
    // 最后一层, 都当做子节点处理
    if (level <= 0) {
      const sideConfig = {}
      sideConfig.title = target.title
      sideConfig.icon = target.icon
      sideConfig.path = getRandomStr(6)
      if (target.children && target.children.length > 0 && target.children[0].route) {
        sideConfig.path = target.children[0].route
      }
      return sideConfig
    }
    console.log('xxxx')
    return null
  }

  const sideBar = deepTravel(stageConfig)
  return sideBar
}

export const tabIconList = (state) => {
  const iconList = {}
  // eslint-disable-next-line
  const { sideBarList } = state

  function inherit(data) {
    data.forEach((item) => {
      if (item.children) {
        inherit(item.children)
      }
      iconList[item.title] = item.icon
    })
    return iconList
  }
  if (sideBarList) {
    inherit(sideBarList)
  }

  // console.log(iconList)
  return iconList
}

export const stopTime = state => state.stopTime

export const auths = state => state.auths
