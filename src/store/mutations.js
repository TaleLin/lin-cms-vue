import * as types from './mutation-types'

export default {
  [types.SET_LOGINED](state) {
    /* eslint no-param-reassign: 0 */
    state.logined = true
  },

  [types.REMOVE_LOGINED](state) {
    state.logined = false
    state.user = null
  },

  [types.SET_USER](state, payload) {
    state.user = payload
    // state.user.avatar = payload.avatar ? payload.avatar : ''
    // state.user.email = payload.email ? payload.email : ''
    // state.user.isSuper = payload.isSuper ? payload.isSuper : false
    // state.user.nickname = payload.nickname ? payload.nickname : '佚名'
    // state.user.groups = payload.groups ? payload.groups : []
    // state.user.permissions = payload.permissions ? payload.permissions : []
    // state.user.username = payload.username ? payload.username : ''
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

  [types.SET_USER_PERMISSIONS](state, permissions) {
    const _permissions = []
    for (let i = 0; i < permissions.length; i++) {
      for (const key in permissions[i]) {
        // console.log(i, state.user.permissions[i][key])
        for (let j = 0; j < permissions[i][key].length; j++) {
          _permissions.push(permissions[i][key][j].permission)
        }
      }
    }
    state.permissions = _permissions
  },

  [types.SET_REFERSH_OPTION](state, option) {
    state.refreshOptions = option
  },
}
