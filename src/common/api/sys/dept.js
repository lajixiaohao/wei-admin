import { request } from '@/common/utils/request'

export function getDeptData (param) {
  return request({
    url: 'dept/index',
    method: 'get',
    params: param
  })
}
