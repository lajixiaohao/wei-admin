import { request } from '@/common/utils/request'

export function getTreeData (param) {
  return request({
    url: 'dept/tree',
    method: 'get',
    params: param
  })
}

export function addOrEdit (data) {
  return request({
    url: 'dept/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: 'dept/remove',
    method: 'post',
    data
  })
}
