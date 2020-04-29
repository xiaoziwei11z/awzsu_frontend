import request from '@/utils/request'
const api_group='activity'
const api_name='activity'
export default{
    search(page,size,searchMap){
        return request({
            url:`/${api_group}/${api_name}/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    findById(id){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'get'
        })
    },
    searchFollow(page,size,id){
      return request({
        url:`/${api_group}/${api_name}/follow/${page}/${size}/${id}`,
        method:'get',
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
    findIsFollow(id){
      return request({
        url:`/${api_group}/${api_name}/isFollow/${id}`,
        method:'get'
      })
    }
}