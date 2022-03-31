import { request } from '../utils/request.js'

export function initialize (param) {
  return request({
    url: 'api/initialize',
    method: 'get',
    params: param
  })
}
