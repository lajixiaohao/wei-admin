import { request } from '../utils/request.js'

export function getListData (param) {
  return request({
    url: 'api/role/list',
    method: 'get',
    params: param
  })
}

export function addOrEditRole (data) {
  return request({
    url: 'api/role/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: 'api/role/remove',
    method: 'post',
    data
  })
}

export function getTreeData (param) {
  return request({
    url: 'api/role/tree',
    method: 'get',
    params: param
  })
}

export function permissionAssign (data) {
  return request({
    url: 'api/role/permission-assign',
    method: 'post',
    data
  })
}
