import { request } from '../utils/request.js'

export function getListData (param) {
  return request({
    url: 'api/post/list',
    method: 'get',
    params: param
  })
}

export function addOrEdit (data) {
  return request({
    url: 'api/post/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: 'api/post/remove',
    method: 'post',
    data
  })
}
