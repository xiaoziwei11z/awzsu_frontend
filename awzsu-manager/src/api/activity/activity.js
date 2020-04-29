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
    deleteById(id){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'delete'
        })
    },
    save(activity){
        return request({
            url:`/${api_group}/${api_name}`,
            method:'post',
            data:activity
        })
    },
    updateById(id,activity){
        return request({
            url:`/${api_group}/${api_name}/${id}`,
            method:'put',
            data:activity
        })
    }
}