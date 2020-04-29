import axios from 'axios'
import {getUser} from '@/utils/auth'
// 创建axios实例
var service
if(getUser().token != undefined){
  service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 30000, // 请求超时时间
    headers: { 'Authorization': 'Bearer '+getUser().token  }
  })
}else{
  service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 30000, // 请求超时时间
  })
}
export default service