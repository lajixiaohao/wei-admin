import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  getToken
} from '@/common/utils/auth'
import Layout from '@/views/layout/index'
import store from '@/store'
import {
  initialize
} from '@/common/api/initialize'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login')
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    component: () => import('@/views/home'),
    name: 'Dashboard',
    meta: { title: '首页', cache: true }
  }]
},
{
  path: '/profile',
  component: Layout,
  redirect: '/profile/index',
  children: [{
    path: 'index',
    component: () => import('@/views/profile/index'),
    name: 'Profile',
    meta: { title: '个人资料', cache: true }
  }]
},
{
  path: '/redirect',
  component: Layout,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index'),
    name: 'Redirect'
  }]
}
]

const router = new VueRouter({
  routes
})

// 白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  if (getToken('access_token')) {
    if (to.path === '/login') {
      return next({ path: '/' })
    } else {
      if (store.state.account.length === 0) {
        const res = await initialize()
        store.dispatch('initData', res.data)
        _generateRoute(res.data.menus)
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login?redirect=' + to.fullPath)
    }
  }
})

// 不需要缓存的组件
// const noCacheComponents = ['Login', 'Redirect', 'PageNotFount']

/* router.afterEach((to, from) => {
  if (noCacheComponents.indexOf(to.name) === -1) {
    let currentFullPath = to.fullPath
    let tag = {}
    const res = store.state.navTabs.some(v => {
      if (v.name === to.name) {
        currentFullPath = v.fullPath
        tag = v
        return true
      }
    })

    if (Object.keys(to.meta).length && to.meta.cache && store.state.cachedViews.indexOf(to.name) === -1) {
      store.state.cachedViews.push(to.name)
    }

    if (!res && to.name) {
      store.state.navTabs.push({
        title: to.meta.title,
        name: to.name,
        path: to.path,
        query: to.query,
        fullPath: to.fullPath
      })
    }

    if (res && to.fullPath !== currentFullPath) {
      const i = store.state.navTabs.indexOf(tag)
      store.state.navTabs[i].query = to.query
      store.state.navTabs[i].fullPath = to.fullPath
    }
  }
}) */

// 最多支持2级菜单
const _generateRoute = (menus) => {
  menus.forEach(v1 => {
    if (v1.children.length === 0) {
      _addRoute(v1)
    } else {
      v1.children.forEach(v2 => {
        _addRoute(v2)
        if (v2.children.length > 0) {
          v2.children.forEach(v3 => {
            _addRoute(v3)
          })
        }
      })
    }
  })

  router.addRoute({
    path: '*',
    name: 'PageNotFount',
    component: () => import('@/views/error/404')
  })
}

const _addRoute = (a) => {
  router.addRoute({
    path: a.path,
    component: Layout,
    redirect: a.path + '/index',
    children: [{
      path: 'index',
      component: () => import('@/views/' + a.component_path),
      name: a.component_name,
      meta: { title: a.title, cache: a.is_cache }
    }]
  })
}

export default router
