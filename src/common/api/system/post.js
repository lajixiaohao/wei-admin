import { request } from '@/common/utils/request'

export function getPostData (param) {
  return request({
    url: 'post/list',
    method: 'get',
    params: param
  })
}

export function addOrEdit (data) {
  return request({
    url: 'post/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}

export function deletePost (data) {
  return request({
    url: 'post/remove',
    method: 'post',
    data
  })
}
