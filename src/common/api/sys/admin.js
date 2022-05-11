import { request } from '@/common/utils/request'

export function getAdminData (param) {
  return request({
    url: 'admin/list',
    method: 'get',
    params: param
  })
}

export function deleteAdmin (data) {
  return request({
    url: 'admin/remove',
    method: 'post',
    data
  })
}

export function modifyPassword (data) {
  return request({
    url: 'admin/modify-password',
    method: 'post',
    data
  })
}

export function addOrEdit (data) {
  return request({
    url: 'admin/' + (data.id > 0 ? 'edit' : 'add'),
    method: 'post',
    data
  })
}
