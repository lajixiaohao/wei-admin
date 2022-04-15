import { request } from '@/common/utils/request'

export function getCaptcha (param) {
  return request({
    url: 'get-captcha',
    method: 'get',
    params: param
  })
}

export function login (data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function logout (data) {
  return request({
    url: 'logout',
    method: 'post',
    data
  })
}

export function initialize (param) {
  return request({
    url: 'initialize',
    method: 'get',
    params: param
  })
}

export function getProfileData (param) {
  return request({
    url: 'profile',
    method: 'get',
    params: param
  })
}

export function modifyName (data) {
  return request({
    url: 'profile/modify-name',
    method: 'post',
    data
  })
}

export function modifyPassword (data) {
  return request({
    url: 'profile/modify-password',
    method: 'post',
    data
  })
}
