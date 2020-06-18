import { createStore } from 'vuex'
import createLogger from 'vuex/dist/logger'
import VuexPersistence from 'vuex-persist'
import mutations from './mutation'
import state from './state'
import * as getters from './getter'
import actions from './action'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: stateData => ({
    // eslint-disable-line
    loggedIn: stateData.loggedIn,
    user: stateData.user,
    permissions: stateData.permissions,
  }),
})

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  plugins: debug ? [vuexLocal.plugin, createLogger()] : [vuexLocal.plugin],
  strict: debug,
})
