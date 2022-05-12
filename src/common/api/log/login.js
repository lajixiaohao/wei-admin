import { request } from '@/common/utils/request'

export function getLoginLogs (param) {
  return request({
    url: 'log/login',
    method: 'get',
    params: param
  })
}
