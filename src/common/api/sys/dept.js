import { request } from '@/common/utils/request'

export function getDeptData (param) {
  return request({
    url: 'dept/get',
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
