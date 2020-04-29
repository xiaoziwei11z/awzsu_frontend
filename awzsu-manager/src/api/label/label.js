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
    deleteById(id){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'delete'
        })
    },
    save(label){
        return request({
            url:`/${api_group}/${api_name}`,
            method:'post',
            data:label
        })
    },
    updateById(id,label){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'put',
            data:label
        })
    }
}