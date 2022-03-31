import { request } from '../utils/request.js'

export function logout (data) {
  return request({
    url: 'api/logout',
    method: 'post',
    data
  })
}
