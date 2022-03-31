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
    name: 'Dashboard'
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
    meta: {
      title: '个人资料',
      cache: true,
      breadcrumb: [{
        path: '',
        title: '个人资料'
      }]
    }
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

router.beforeEach((to, from, next) => {
  if (getToken('access_token')) {
    if (to.path === '/login') {
      return next('/')
    } else {
      if (!store.state.account) {
        initialize().then(res => {
          store.state.account = res.data.account
          store.state.menus = res.data.menus
          _generateRoute(res.data.menus)
        })
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      const redirect = to.fullPath ? '?redirect=' + to.fullPath : ''
      return next('/login' + redirect)
    }
  }
})

// 不需要缓存的组件
const noCacheComponents = ['Login', 'Redirect', 'PageNotFount']

router.afterEach((to, from) => {
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
})

const _generateRoute = (menus) => {
  menus.forEach(v1 => {
    if (!v1.children.length) {
      _addRoute(v1, [{
        path: '',
        title: v1.title
      }])
    } else {
      v1.children.forEach(v2 => {
        _addRoute(v2, [{
          path: '',
          title: v1.title
        }, {
          path: '',
          title: v2.title
        }])

        if (v2.children.length) {
          v2.children.forEach(v3 => {
            _addRoute(v3, [{
              path: '',
              title: v1.title
            }, {
              path: v2.path + '/index',
              title: v2.title
            }, {
              path: '',
              title: v3.title
            }])
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

const _addRoute = (a, b) => {
  router.addRoute({
    path: a.path,
    component: Layout,
    redirect: a.path + '/index',
    children: [{
      path: 'index',
      component: () => import('@/views/' + a.component_path),
      name: a.component_name,
      meta: {
        title: a.title,
        cache: a.is_cache,
        breadcrumb: b
      }
    }]
  })
}

export default router
