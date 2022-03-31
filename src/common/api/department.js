import { request } from '../utils/request.js'

export function getTreeData (param) {
  return request({
    url: 'api/department/tree',
    method: 'get',
    params: param
  })
}

export function addOrEdit (data) {
  return request({
    url: 'api/department/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: 'api/department/remove',
    method: 'post',
    data
  })
}
