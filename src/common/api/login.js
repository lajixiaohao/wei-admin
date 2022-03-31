import { request } from '../utils/request.js'

export function getCaptcha (param) {
  return request({
    url: 'api/get-captcha',
    method: 'get',
    params: param
  })
}

export function login (data) {
  return request({
    url: 'api/login',
    method: 'post',
    data
  })
}
