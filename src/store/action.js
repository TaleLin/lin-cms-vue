import * as types from './mutation-type'

const APP_STORAGE_KEYS = ['access_token', 'refresh_token']

export default {
  setUserAndState({ commit }, user) {
    commit(types.SET_USER, user)
    commit(types.SET_LOGGED_IN, true)
  },

  loginOut({ commit }) {
    APP_STORAGE_KEYS.forEach(key => localStorage.removeItem(key))
    // 清理 vuex-persist 存储的键
    localStorage.removeItem('vuex')
    commit(types.REMOVE_LOGGED_IN, false)
  },

  readMessage({ commit }, message) {
    commit(types.REMOVE_UNREAD_MESSAGE, message.id)
    commit(types.MARK_READ_MESSAGE, message)
  },
}
