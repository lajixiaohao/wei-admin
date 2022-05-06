import { request } from '@/common/utils/request'

export function getRoleData (param) {
  return request({
    url: 'role/list',
    method: 'get',
    params: param
  })
}

export function addOrEdit (data) {
  return request({
    url: 'role/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function deleteRole (data) {
  return request({
    url: 'role/remove',
    method: 'post',
    data
  })
}

export function getTreeData (param) {
  return request({
    url: 'role/tree',
    method: 'get',
    params: param
  })
}

export function permissionAssign (data) {
  return request({
    url: 'role/permission-assign',
    method: 'post',
    data
  })
}
