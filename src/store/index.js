import { createStore, createLogger } from 'vuex'
import VuexPersistence from 'vuex-persist'

import mutations from './mutation'
import state from './state'
import * as getters from './getter'
import actions from './action'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: stateData => ({
    user: stateData.user,
    loggedIn: stateData.loggedIn,
    permissions: stateData.permissions,
  }),
})

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
  plugins: debug ? [vuexLocal.plugin, createLogger()] : [vuexLocal.plugin],
})
