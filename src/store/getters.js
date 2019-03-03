import pluginViewConfig from '@/plugins/configs.json'

const pluginViewList = (() => {
  const list = []
  function deepLook(viewObj) {
    if (viewObj.type === 'view') {
      list.push(viewObj.path)
    } else {
      viewObj.children.forEach((item) => {
        deepLook(item)
      })
    }
  }
  Object.keys(pluginViewConfig).forEach((plugin) => {
    deepLook(pluginViewConfig[plugin])
  })
  return list
})()

function addPlugin(current) {
  console.log(current)
  Object.keys(pluginViewConfig).forEach((plugin) => {
    const sideBar = {
      children: [],
      meta: {
        title: plugin,
        icon: 'iconfont icon-demo',
      },
      path: `/${plugin}`,
      name: plugin,
    }
    pluginViewConfig[plugin].children.forEach((item) => {
      sideBar.children.push({
        path: item.path,
        name: item.name,
        meta: {
          title: item.title,
          icon: item.icon,
        },
      })
    })
    current.push(sideBar)
  })
}

export const logined = state => state.logined

export const user = state => state.user

export const tabs = state => state.tabs

export const menuTabs = state => state.menuTabs

export const readedMessages = state => state.readedMessages

export const unreadMessages = state => state.unreadMessages

export const defaultActive = state => state.defaultActive

export const sideBarList = (state) => {
  // const pluginList = []
  const pluginPath = {}
  pluginViewList.forEach((path) => {
    pluginPath[path] = true
  })
  return state.sideBarList.filter(item => !pluginPath[item.path])
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
      iconList[item.meta.title] = item.meta.icon || item.meta.src
    })
    return iconList
  }
  inherit(sideBarList)

  addPlugin(sideBarList)
  return iconList
}

export const stopTime = state => state.stopTime

export const auths = state => state.auths
