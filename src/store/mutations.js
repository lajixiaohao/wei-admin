export default {
  INIT_DATA (state, data) {
    state.userInfo = data.userInfo
    state.menus = data.menus
  },
  ADD_TAG_VIEW (state, view) {
    let originiFullPath = ''
    let tag = {}
    const isExists = state.tagViews.some(v => {
      if (v.name === view.name) {
        originiFullPath = v.fullPath
        tag = v
        return true
      }
      return false
    })
    if (!isExists) {
      state.tagViews.push({
        title: view.meta.title || 'no-title',
        name: view.name,
        path: view.path,
        fullPath: view.fullPath,
        query: view.query
      })
    }
    if (isExists && originiFullPath !== view.fullPath) {
      const i = state.tagViews.indexOf(tag)
      if (i !== -1) {
        state.tagViews[i].query = view.query
        state.tagViews[i].fullPath = view.fullPath
      }
    }
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
  },
  DELETE_CACHED_VIEW (state, index) {
    state.cachedViews.splice(index, 1)
  },
  DELETE_TAG_VIEW (state, index) {
    state.tagViews.splice(index, 1)
  },
  DELETE_ALL_VIEW (state) {
    state.cachedViews = state.cachedViews.filter(v => {
      return v === 'Dashboard'
    })
    state.tagViews = state.tagViews.filter(v => {
      return v.name === 'Dashboard'
    })
  },
  DELETE_OTHER_VIEW (state, tag) {
    state.cachedViews = state.cachedViews.filter(v => {
      return v === 'Dashboard' || v === tag.name
    })
    state.tagViews = state.tagViews.filter(v => {
      return v.name === 'Dashboard' || v.path === tag.path
    })
  },
  UPDATE_ADMIN_NAME (state, name) {
    state.userInfo.trueName = name
  }
}
