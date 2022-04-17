import { request } from '@/common/utils/request'

export function getTreeData (param) {
  return request({
    url: 'menu/tree',
    method: 'get',
    params: param
  })
}
