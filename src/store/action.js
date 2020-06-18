import * as types from './mutation-type'
import { removeToken } from '@/lin/util/token'

export default {
  setUserAndState({ commit }, user) {
    commit(types.SET_USER, user)
    commit(types.SET_LOGGED_IN, true)
  },

  loginOut({ commit }) {
    removeToken()
    commit(types.REMOVE_LOGGED_IN, false)
  },

  readMessage({ commit }, message) {
    commit(types.REMOVE_UNREAD_MESSAGE, message.id)
    commit(types.ADD_READED_MESSAGE, message)
  },
}
