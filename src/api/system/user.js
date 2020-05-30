import request from '@/utils/request'

export function listUser(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: '/user/del',
    method: 'post',
    data
  })
}

export function updateUser(user_id, data) {
  return request({
    url: '/user/edit?user_id=' + user_id,
    method: 'post',
    data
  })
}

export function updatePwd(user_id, data) {
  return request({
    url: '/user/edit-pwd?user_id=' + user_id,
    method: 'post',
    data
  })
}
