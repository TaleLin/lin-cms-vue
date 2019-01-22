import * as types from './mutation-types'

export default {
  [types.SET_LOGINED](state) {
    /* eslint no-param-reassign: 0 */
    state.logined = true
  },

  [types.REMOVE_LOGINED](state) {
    state.logined = false
  },

  [types.SET_USER](state, payload) {
    state.user = payload
  },

  async [types.ADD_TAB](state, payload) {
    if (!(payload instanceof Array)) {
      const { tabs } = state
      const flag = await tabs.find(el => el.path === payload.path)
      if (!flag) {
        state.tabs = [payload, ...tabs]
      }
    } else {
      state.tabs = []
    }
  },

  [types.ADD_MENU_TAB](state, tabs) {
    state.menuTabs = tabs
  },

  [types.REMOVE_TAB](state, payload) {
    state.tabs.splice(payload, 1)
  },

  [types.SET_DEFAULT_ACTIVE_TAB](state, payload) {
    state.defaultActive = payload
  },

  [types.ADD_READED_MESSAGE](state, payload) {
    state.readedMessages.push(payload)
  },

  [types.ADD_UNREAD_MESSAGE](state, payload) {
    // console.log('===:  ', payload)
    state.unreadMessages.push(payload)
  },

  [types.REMOVE_UNREAD_MESSAGE](state, payload) {
    // payload => message.id
    const { unreadMessages } = state
    const index = unreadMessages.findIndex(el => el.id === payload)
    unreadMessages.splice(index, 1)
  },

  [types.SET_SIDEBAR_LIST](state, payload) {
    state.sideBarList = payload
  },

  [types.SET_STOP_TIME](state, currentTime) {
    state.stopTime = currentTime
  },

  [types.SET_USER_AUTHS](state, auths) {
    const _auths = []
    for (let i = 0; i < auths.length; i++) {
      for (const key in auths[i]) {
        // console.log(i, state.user.auths[i][key])
        for (let j = 0; j < auths[i][key].length; j++) {
          _auths.push(auths[i][key][j].auth)
        }
      }
    }
    state.auths = _auths
  },
}
