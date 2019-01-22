export const logined = state => state.logined

export const user = state => state.user

export const tabs = state => state.tabs

export const menuTabs = state => state.menuTabs

export const readedMessages = state => state.readedMessages

export const unreadMessages = state => state.unreadMessages

export const defaultActive = state => state.defaultActive

export const sideBarList = state => state.sideBarList

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
  return iconList
}

export const stopTime = state => state.stopTime

export const auths = state => state.auths
