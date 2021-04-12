import * as types from './mutation-type'

export default {
  [types.SET_LOGGED_IN](state) {
    state.loggedIn = true
  },

  [types.REMOVE_LOGGED_IN](state) {
    state.loggedIn = false
    state.user = null
  },

  [types.SET_USER](state, payload) {
    state.user = payload
  },

  [types.MARK_READ_MESSAGE](state, payload) {
    state.alreadyReadMessages.push(payload)
  },

  [types.MARK_UNREAD_MESSAGE](state, payload) {
    // console.log('===:  ', payload)
    state.unreadMessages.push(payload)
  },

  [types.REMOVE_UNREAD_MESSAGE](state, payload) {
    // payload => message.id
    const { unreadMessages } = state
    const index = unreadMessages.findIndex(el => el.id === payload)
    unreadMessages.splice(index, 1)
  },

  [types.SET_USER_PERMISSIONS](state, permissions) {
    const _permissions = []
    for (let i = 0; i < permissions.length; i++) {
      for (const key in permissions[i]) {
        for (let j = 0; j < permissions[i][key].length; j++) {
          _permissions.push(permissions[i][key][j].permission)
        }
      }
    }
    state.permissions = _permissions
  },

  [types.SET_REFRESH_OPTION](state, option) {
    state.refreshOptions = option
  },
}
