import * as types from './mutation-type'

export default {
  setUserAndState({ commit }, user) {
    commit(types.SET_USER, user)
    commit(types.SET_LOGGED_IN, true)
  },

  loginOut({ commit }) {
    localStorage.clear()
    commit(types.REMOVE_LOGGED_IN, false)
  },

  readMessage({ commit }, message) {
    commit(types.REMOVE_UNREAD_MESSAGE, message.id)
    commit(types.MARK_READ_MESSAGE, message)
  },
}
