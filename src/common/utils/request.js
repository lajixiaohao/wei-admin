import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getToken, removeToken } from '@/common/utils/auth'

export function request (config) {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
  })

  instance.interceptors.request.use(config => {
    if (getToken()) {
      config.headers.Token = getToken()
    }
    return config
  }, err => {
    return err
  })

  instance.interceptors.response.use(response => {
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
      if (res.code !== 0) {
        Message({ message: res.msg, type: 'error' })
        return Promise.reject(new Error(res.msg || 'Error'))
      }
      return res
    }
  }, err => {
    if (err.response) {
      if (err.response.status === 403) {
        Message({ message: '403 Forbidden', type: 'error' })
      } else if (err.response.status === 401) {
        MessageBox.confirm('您的登录状态已失效，您可以继续停留在该页上，或重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          removeToken()
          window.location.reload()
        }).catch(() => {})
      } else {
        Message({ message: err.message, type: 'error' })
      }
      return Promise.reject(err)
    }
    Message({ message: err.message, type: 'error' })
    return Promise.reject(err)
  })

  return instance(config)
}
