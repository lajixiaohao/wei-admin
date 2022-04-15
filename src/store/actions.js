export default {
  initData ({ commit }, data) {
    commit('INIT_DATA', data)
  },
  addView ({ commit }, view) {
    commit('ADD_TAG_VIEW', view)
    commit('ADD_CACHED_VIEW', view)
  },
  refreshView ({ commit }, name) {
    commit('REFRESH_VIEW', name)
  },
  deleteCachedView ({ commit }, index) {
    commit('DELETE_CACHED_VIEW', index)
  },
  deleteTagView ({ commit }, index) {
    commit('DELETE_TAG_VIEW', index)
  },
  deleteAllView ({ commit }) {
    commit('DELETE_ALL_VIEW')
  },
  deleteOtherView ({ commit }, tag) {
    commit('DELETE_OTHER_VIEW', tag)
  },
  updateAdminName ({ commit }, name) {
    commit('UPDATE_ADMIN_NAME', name)
  }
}
