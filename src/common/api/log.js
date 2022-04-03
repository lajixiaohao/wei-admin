import { request } from '../utils/request.js'

export function getOperationList (param) {
  return request({
    url: 'api/log/operation',
    method: 'get',
    params: param
  })
}

export function getLoginList (param) {
  return request({
    url: 'api/log/login',
    method: 'get',
    params: param
  })
}

export function exportLoginLog (param) {
  return request({
    url: 'api/log/login/export',
    method: 'get',
    params: param,
    responseType: 'blob'
  })
}
