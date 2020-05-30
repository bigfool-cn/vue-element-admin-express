import request from '@/utils/request'

export function listRole(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}

export function getRole(params) {
  return request({
    url: '/role/get',
    method: 'get',
    params
  })
}

export function delRole(data) {
  return request({
    url: '/role/del',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function updateRole(role_id, data) {
  return request({
    url: '/role/edit?role_id=' + role_id,
    method: 'post',
    data
  })
}
