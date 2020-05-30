import request from '@/utils/request'

export function listMenu(params) {
  return request({
    url: '/menu/list',
    method: 'get',
    params
  })
}

export function getMenu(params) {
  return request({
    url: '/menu/get',
    method: 'get',
    params
  })
}

export function delMenu(data) {
  return request({
    url: '/menu/del',
    method: 'post',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}

export function updateMenu(menu_id, data) {
  return request({
    url: '/menu/edit?menu_id=' + menu_id,
    method: 'post',
    data
  })
}
