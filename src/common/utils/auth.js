/**
 * TOKEN相关操作
 **/
import Cookies from 'js-cookie'
import Config from '@/settings'

const tokenKey = Config.tokenKey

// 获取token
export function getToken () { return Cookies.get(tokenKey) }

// 设置token
export function setToken (str) { return Cookies.set(tokenKey, str, { sameSite: 'lax', secure: false }) }

// 删除token
export function removeToken () { return Cookies.remove(tokenKey) }
