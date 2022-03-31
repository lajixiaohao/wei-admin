import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import {
  getToken,
  removeToken
} from '@/common/utils/auth'

/**
 * 网络请求
 * @param {Object} config
 */
export function request (config) {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000
  })

  // 请求前拦截
  instance.interceptors.request.use(config => {
    if (getToken()) {
      config.headers.Token = getToken()
    }

    return config
  }, err => {
    return err
  })

  // 响应后拦截
  instance.interceptors.response.use(response => {
    const res = response.data

    // token失效时的处理
    if (res.code === 2001) {
      MessageBox.confirm('您的登录状态已失效，您可以继续停留在该页上，或重新登录', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '关闭',
        type: 'warning'
      }).then(() => {
        removeToken()
        window.sessionStorage.clear()
        location.reload()
      })
    }

    if (res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error'
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    }

    return res
  }, err => {
    Message({
      message: err.message,
      type: 'error'
    })
    return Promise.reject(err)
  })

  return instance(config)
}
