import request from '@/utils/request'
const api_group='square'
const api_name='square'
export default{
  save(speech){
    return request({
        url:`/${api_group}/${api_name}`,
        method:'post',
        data:speech
    })
  },
  searchByParentid(page,size,parentid){
      return request({
          url:`/${api_group}/${api_name}/search/${page}/${size}/${parentid}`,
          method:'get',
      })
  },
  findById(id){
      return request({
          url:`/${api_group}/${api_name}/${id}`,
          method:'get',
      })
  },
  deleteById(id,parentid){
    return request({
      url:`/${api_group}/${api_name}/${id}/${parentid}`,
      method:'delete',
    })
  },
  thumbup(id){
    return request({
      url:`/${api_group}/${api_name}/thumbup/${id}`,
      method:'put',
    })
  },
  searchByUserid(page,size,id){
    return request({
      url:`/${api_group}/${api_name}/user/${page}/${size}/${id}`,
      method:'get',
    })
  },
}