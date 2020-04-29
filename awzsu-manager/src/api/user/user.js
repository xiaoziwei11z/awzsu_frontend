import request from '@/utils/request'
const api_group='user'
const api_name='user'
export default{
    search(page,size,searchMap){
        return request({
            url:`/${api_group}/${api_name}/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    deleteById(id){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'delete'
        })
    },
    saveAdmin(pojo){
        return request({
            url:`/${api_group}/${api_name}/admin`,
            method:'post',
            data:pojo
        })
    }
}