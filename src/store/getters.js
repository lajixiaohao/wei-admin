export default {
  adminName (state) {
    return state.userInfo.trueName ? state.userInfo.trueName : state.userInfo.account
  },
  menus (state) {
    return state.menus
  },
  tagViews (state) {
    return state.tagViews
  },
  cachedViews (state) {
    return state.cachedViews
  }
}
