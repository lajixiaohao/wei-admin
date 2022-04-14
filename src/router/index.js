import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/common/utils/auth'
import Layout from '@/views/layout/index'
import store from '@/store'
import { initialize } from '@/common/api/initialize'

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
    meta: { title: '个人资料', cache: true, breadcrumb: [{ path: '', title: '个人资料' }] }
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
      if (store.state.account.length === 0) {
        initialize().then(res => {
          store.dispatch('initData', res.data)
          _generateRoute(res.data.menus)
        })
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

// TODU:需要再优化
const _generateRoute = (menus) => {
  menus.forEach(v1 => {
    if (v1.children.length === 0) {
      _addRoute(v1, [{ path: '', title: v1.title }])
      if (v1.pageMenu.length) {
        v1.pageMenu.forEach(p1 => {
          _addRoute(p1, [{ path: v1.path + '/index', title: v1.title }, { path: '', title: p1.title }])
        })
      }
    } else {
      v1.children.forEach(v2 => {
        if (v2.children.length === 0) {
          _addRoute(v2, [{ path: '', title: v1.title }, { path: '', title: v2.title }])
          if (v2.pageMenu.length) {
            v2.pageMenu.forEach(p2 => {
              _addRoute(p2, [{ path: '', title: v1.title }, { path: v2.path + '/index', title: v2.title }, { path: '', title: p2.title }])
            })
          }
        } else {
          v2.children.forEach(v3 => {
            _addRoute(v3, [{ path: '', title: v1.title }, { path: '', title: v2.title }, { path: '', title: v3.title }])
            if (v3.pageMenu.length) {
              v3.pageMenu.forEach(p3 => {
                _addRoute(p3, [{ path: '', title: v1.title }, { path: '', title: v2.title }, { path: v3.path + '/index', title: v3.title }, { path: '', title: p3.title }])
              })
            }
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
      component: () => import('@/views/' + a.componentPath),
      name: a.componentName,
      meta: { title: a.title, cache: a.isCache, breadcrumb: b }
    }]
  })
}

export default router
