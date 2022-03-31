import { request } from '../utils/request.js'

export function getListData (param) {
  return request({
    url: 'api/admin/list',
    method: 'get',
    params: param
  })
}

export function addOrEdit (data) {
  return request({
    url: 'api/admin/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function getTreeData (param) {
  return request({
    url: 'api/admin/tree',
    method: 'get',
    params: param
  })
}

export function modifyPassword (data) {
  return request({
    url: 'api/admin/modify-password',
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: 'api/admin/remove',
    method: 'post',
    data
  })
}

export function changeTakeover (data) {
  return request({
    url: 'api/admin/change-takeover',
    method: 'post',
    data
  })
}
