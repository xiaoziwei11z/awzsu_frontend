import request from '@/utils/request'
const api_group='label'
const api_name='label'
export default{
    findAll(){
        return request({
            url:`/${api_group}/${api_name}`,
            method:'get'
        })
    },
    search(page,size){
        return request({
            url:`/${api_group}/${api_name}/search/${page}/${size}`,
            method:'get'
        })
    },
    findById(id){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'get'
        })
    },
    searchFollow(userid){
      return request({
          url:`/${api_group}/${api_name}/follow/${userid}`,
          method:'get'
      })
    },
    follow(id){
      return request({
          url:`/${api_group}/${api_name}/follow/${id}`,
          method:'put'
      })
    },
    cancelFollow(id){
      return request({
          url:`/${api_group}/${api_name}/cancelFollow/${id}`,
          method:'put'
      })
    },
}