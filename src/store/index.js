import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

Vue.use(Vuex)

const state = {
  userInfo: [],
  menus: [],
  tagViews: [{ title: '首页', path: '/dashboard', fullPath: '/dashboard', name: 'Dashboard' }],
  cachedViews: ['Dashboard']
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions,
  getters,
  modules: {}
})
