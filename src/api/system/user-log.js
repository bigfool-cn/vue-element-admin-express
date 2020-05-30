import request from '@/utils/request'

export function listLog(params) {
  return request({
    url: '/user-log/list',
    method: 'get',
    params
  })
}

export function delLog(data) {
  return request({
    url: '/user-log/del',
    method: 'post',
    data
  })
}
