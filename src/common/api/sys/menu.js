import { request } from '@/common/utils/request'

export function getTreeData (param) {
  return request({
    url: 'menu/tree',
    method: 'get',
    params: param
  })
}

export function remove (data) {
  return request({
    url: 'menu/remove',
    method: 'post',
    data
  })
}

export function addOrEdit (data) {
  return request({
    url: 'menu/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}
