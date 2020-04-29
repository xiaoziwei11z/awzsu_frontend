import request from '@/utils/request'
const api_group='qa'
const api_name='reply'
export default{
  searchByQuestionid(page,size,questionid){
      return request({
          url:`/${api_group}/${api_name}/search/${page}/${size}/${questionid}`,
          method:'get',
      })
  },
  save(pojo){
    return request({
        url:`/${api_group}/${api_name}`,
        method:'post',
        data:pojo
    })
  },
}