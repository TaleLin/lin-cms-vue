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
})


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [vuexLocal.plugin],
})
