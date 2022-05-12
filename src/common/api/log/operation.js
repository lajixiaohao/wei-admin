import { request } from '@/common/utils/request'

export function getOperationLogs (param) {
  return request({
    url: 'log/operation',
    method: 'get',
    params: param
  })
}
