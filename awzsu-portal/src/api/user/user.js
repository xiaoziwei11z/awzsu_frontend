import request from '@/utils/request'
const api_group='user'
const api_name='user'
export default {
  sms(mobile) {
    return request({
      url: `/${api_group}/${api_name}/sms/${mobile}`,
      method: 'get'
    })
  },
  register(smscode,user) {
    return request({
      url: `/${api_group}/${api_name}/register/${smscode}`,
      method: 'post',
      data:user
    })
  },
  login(pojo) {
    return request({
      url: `/${api_group}/${api_name}/login`,
      method: 'post',
      data:pojo
    })
  },
  findById(id) {
    return request({
      url: `/${api_group}/${api_name}/${id}`,
      method: 'get'
    })
  },
  save(pojo){
    return request({
      url: `/${api_group}/${api_name}`,
      method: 'post',
      data:pojo
    })
  },
  follow(id){
    return request({
        url:`/${api_group}/${api_name}/follow/${id}`,
        method:'put'
    })
  },
  dislike(id){
    return request({
        url:`/${api_group}/${api_name}/dislike/${id}`,
        method:'put'
    })
  },
  cancelFollow(id){
    return request({
        url:`/${api_group}/${api_name}/cancelFollow/${id}`,
        method:'put'
    })
  },
  findIsFollow(id){
    return request({
      url:`/${api_group}/${api_name}/isFollow/${id}`,
      method:'get'
    })
  },
  searchFollow(page,size,id){
    return request({
      url:`/${api_group}/${api_name}/follow/${page}/${size}/${id}`,
      method:'get',
    })
  },
  searchFans(page,size,id){
    return request({
      url:`/${api_group}/${api_name}/fans/${page}/${size}/${id}`,
      method:'get',
    })
  },
  saveFriends(pojo){
    return request({
      url:`/${api_group}/${api_name}/friends`,
      method:'post',
      data:pojo
    })
  },
  searchFriends(page,size){
    return request({
      url:`/${api_group}/${api_name}/friends/${page}/${size}`,
      method:'get',
    })
  },
}
