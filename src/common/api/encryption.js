import { request } from '../utils/request.js'

export function getRsaKey (param) {
  return request({
    url: 'api/encryption/rsa',
    method: 'get',
    params: param
  })
}
