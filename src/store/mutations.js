export default {
  INIT_DATA (state, data) {
    state.account = data.account
    state.menus = data.menus
  },
  ADD_TAG_VIEW (state, view) {
    if (state.tagViews.some(v => v.path === view.path)) return
    state.tagViews.push(Object.assign({}, view, { title: view.meta.title || 'no-title' }))
  },
  ADD_CACHED_VIEW (state, view) {
    if (state.cachedViews.includes(view.name)) return
    if (view.meta.cache) {
      state.cachedViews.push(view.name)
    }
  },
  REFRESH_VIEW (state, name) {
    state.cachedViews = state.cachedViews.filter(v => {
      return v !== name
    })
  }
}
