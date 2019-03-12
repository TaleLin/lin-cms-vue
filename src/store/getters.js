// 返回 n 位的随机字符串
const getRandomStr = function getRandomStr(n) {
  let str = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  for (let i = 0; i < n; i += 1) {
    str += chars.charAt(Math.floor(Math.random() * 62))
  }
  return str
}

function addPlugin(pluginViewConfig) {
  // console.log(current)
  const plluginSideBar = []
  // debugger
  Object.keys(pluginViewConfig).forEach((plugin) => {
    const sideBar = {
      children: [],
      meta: {
        title: pluginViewConfig[plugin].title,
        icon: pluginViewConfig[plugin].icon,
      },
      path: getRandomStr(6),
      name: pluginViewConfig[plugin].name,
    }
    pluginViewConfig[plugin].children.forEach((item) => {
      if (!item.inSideNav) {
        return
      }
      console.log(item.title)
      sideBar.children.push({
        path: item.route,
        name: item.name,
        meta: {
          title: item.title,
          icon: item.icon,
        },
      })
    })
    plluginSideBar.push(sideBar)
  })
  return plluginSideBar
}

export const logined = state => state.logined

export const user = state => state.user

export const tabs = state => state.tabs

export const menuTabs = state => state.menuTabs

export const readedMessages = state => state.readedMessages

export const unreadMessages = state => state.unreadMessages

export const defaultActive = state => state.defaultActive

export const sideBarList = (state) => {
  const { plugin } = state
  return state.sideBarList.concat(addPlugin(plugin))
}

export const tabIconList = (state) => {
  const iconList = {}
  const { plugin } = state
  // eslint-disable-next-line
  const { sideBarList } = state

  function inherit(data) {
    data.forEach((item) => {
      if (item.children) {
        inherit(item.children)
      }
      if (item.meta) {
        iconList[item.meta.title] = item.meta.icon || item.meta.src
      } else if (item.title) {
        iconList[item.title] = item.icon
      }
    })
    return iconList
  }
  inherit(sideBarList)
  Object.keys(plugin).forEach((item) => {
    inherit(plugin[item].children)
  })

  // console.log(iconList)
  return iconList
}

export const stopTime = state => state.stopTime

export const auths = state => state.auths
