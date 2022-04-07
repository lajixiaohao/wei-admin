/**
 * TOKEN相关操作
 **/
import Config from '@/settings'

const tokenKey = Config.tokenKey

// 获取token
export function getToken () {
  return window.localStorage.getItem(tokenKey)
}

// 设置token
export function setToken (str) {
  window.localStorage.setItem(tokenKey, str)
}

// 删除token
export function removeToken () {
  window.localStorage.removeItem(tokenKey)
}
