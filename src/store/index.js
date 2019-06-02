import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import mutations from './mutations'
import state from './state'
import * as getters from './getters'
import actions from './actions'


Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({ // eslint-disable-line
    logined: state.logined,
    user: state.user,
    auths: state.auths,
  }),
})


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== 'production',
})
