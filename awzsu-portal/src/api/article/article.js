import request from '@/utils/request'
const api_group='article'
const api_name='article'
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
    deleteById(id){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'delete'
        })
    },
    hotlist(page,size,labelid){
      return request({
          url:`/${api_group}/${api_name}/hotlist/${page}/${size}/${labelid}`,
          method:'get',
      })
    },
    newlist(page,size,labelid){
      return request({
          url:`/${api_group}/${api_name}/newlist/${page}/${size}/${labelid}`,
          method:'get',
      })
    },
    searchCommentsByArticleid(page,size,articleid){
      return request({
          url:`/${api_group}/${api_name}/searchComments/${page}/${size}/${articleid}`,
          method:'get'
      })
    },
    saveComment(comment){
      return request({
          url:`/${api_group}/${api_name}/comment`,
          method:'post',
          data:comment
      })
    },
    save(article){
      return request({
          url:`/${api_group}/${api_name}`,
          method:'post',
          data:article
      })
    },
    searchByUserid(page,size,id){
      return request({
        url:`/${api_group}/${api_name}/user/${page}/${size}/${id}`,
        method:'get',
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