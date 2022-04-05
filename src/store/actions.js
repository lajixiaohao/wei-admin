export default {
  initData ({ commit }, data) {
    commit('INIT_DATA', data)
  },
  addView ({ dispatch }, view) {
    dispatch('addTagView', view)
    dispatch('addCachedView', view)
  },
  addTagView ({ commit }, view) {
    commit('ADD_TAG_VIEW', view)
  },
  addCachedView ({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  refreshView ({ commit }, name) {
    commit('REFRESH_VIEW', name)
  }
}
