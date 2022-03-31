import { request } from '../utils/request.js'

export function getListData (param) {
  return request({
    url: 'api/menu/list',
    method: 'get',
    params: param
  })
}

export function addOrEditMenu (data) {
  return request({
    url: 'api/menu/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: 'api/menu/remove',
    method: 'post',
    data
  })
}

export function addOrEditRegisterRoute (data) {
  return request({
    url: 'api/menu/' + (data.id > 0 ? 'edit-register-route' : 'add-register-route'),
    method: 'post',
    data
  })
}

export function addOrEditPermission (data) {
  return request({
    url: 'api/menu/' + (data.id > 0 ? 'edit-permission' : 'add-permission'),
    method: 'post',
    data
  })
}

export function getTwoLevelMenu (param) {
  return request({
    url: 'api/menu/get-two-level-menu',
    method: 'get',
    params: param
  })
}
