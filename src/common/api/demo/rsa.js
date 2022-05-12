import { request } from '@/common/utils/request.js'

export function getRsaKey (param) {
  return request({
    url: 'encryption/rsa',
    method: 'get',
    params: param
  })
}
