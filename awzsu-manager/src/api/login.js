import request from '@/utils/request'
const api_group='user'
const api_name='user'

export function login(pojo) {
  return request({
    url: `/${api_group}/${api_name}/admin/login`,
    method: 'post',
    data: pojo
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
