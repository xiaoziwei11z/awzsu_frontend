import request from '@/utils/request'
const api_group='search'
const api_name='article'

export default{
  searchIndex(keyword,page,size){
    return request({
      url:`/${api_group}/${api_name}/index/${keyword}/${page}/${size}`,
      method:'get',
    })
  }
}