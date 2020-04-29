import request from '@/utils/request'
const api_group='article'
const api_name='article'
export default{
    findAll(){
        return request({
            url:`/${api_group}/${api_name}`,
            method:'get'
        })
    },
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
    examine(id,state){
        return request({
            url:`/${api_group}/${api_name}/examine/${id}/${state}`,
            method:'put'
        })
    },
    deleteById(id){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'delete'
        })
    },
    importIndex(){
      return request({
        url:`/${api_group}/${api_name}/index`,
        method:'get'
      })
    }
}