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
    // 支持文件流下载
    if (response.data instanceof Blob) {
      const filename = response.headers['content-disposition'].split('filename=')[1]
      const blob = new Blob([response.data], { type: 'application/octet-stream' })
      const blobURL = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = blobURL
      a.setAttribute('download', decodeURIComponent(filename))
      if (typeof a.download === 'undefined') {
        a.setAttribute('target', '_blank')
      }
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(blobURL)
    } else {
      const res = response.data
      // code=1，表示请求未按预期完成，将统一展示错误消息
      if (res.code !== 0) {
        Message({
          message: res.msg,
          type: 'error'
        })
        return Promise.reject(new Error(res.msg || 'Error'))
      }
      return res
    }
  }, err => {
    // 403
    if (err.response.status === 403) {
      Message({
        message: err.response.data.msg,
        type: 'error'
      })
    }
    // 401
    if (err.response.status === 401) {
      MessageBox.confirm('您的登录状态已失效，您可以继续停留在该页上，或重新登录', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '关闭',
        type: 'warning'
      }).then(() => {
        removeToken()
        location.reload()
      }).catch(() => {})
    }
    return Promise.reject(new Error('Error'))
  })

  return instance(config)
}
