import { request } from '../utils/request.js'

export function getProfileData (param) {
  return request({
    url: 'api/profile',
    method: 'get',
    params: param
  })
}

export function modifyName (data) {
  return request({
    url: 'api/profile/modify-name',
    method: 'post',
    data
  })
}

export function modifyPassword (data) {
  return request({
    url: 'api/profile/modify-password',
    method: 'post',
    data
  })
}
