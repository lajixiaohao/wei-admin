import { request } from '../utils/request.js'

export function getTableData (param) {
  return request({
    url: 'api/organization/list',
    method: 'get',
    params: param
  })
}

export function addOrEdit (data) {
  return request({
    url: 'api/organization/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: 'api/organization/remove',
    method: 'post',
    data
  })
}
