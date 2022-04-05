import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

Vue.use(Vuex)

const state = {
  account: '',
  menus: [],
  tagViews: [],
  cachedViews: []
  // tagViews: [{ title: '首页', name: 'Dashboard', path: '/dashboard', fullPath: '/dashboard', query: {} }],
  // cachedViews: ['Dashboard']
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {}
})
