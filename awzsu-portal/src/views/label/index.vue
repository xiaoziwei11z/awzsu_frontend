<template>
  <div class="wrapper all-tags"> 
   <div class="tags-head"> 
    <h2 class="tag-title">标签</h2> 
    <p class="tag-second">标签是最有效的内容组织形式，正确的使用标签能更快的发现和解决你的问题。</p> 
   </div> 
   <div class="alltags-card"> 
    <ul class="yui3-g tags-list" style="display:block;"> 
     <li class="tag-item yui3-u-1-4" v-for="(item,index) in items" :key="index"> 
      <div class="inner"> 
       <h5 class="title">{{item.labelname}}</h5> 
       <div class="guanzhu"> 
         <a class="sui-btn btn-alreadyguanzhu color" @click="handleCancelFollow(item.id)" v-if="followIdList && followIdList.includes(item.id)">已关注</a> 
        <a class="sui-btn btn-guanzhu color" @click="handleFollow(item.id)" v-else>加关注</a> 
        <!-- <span class="guannum"><i class="num">{{item.fans}}</i>人关注</span>  -->
       </div> 
      </div> </li> 
    </ul> 
   </div> 
  </div>
</template>
<script>
import '@/assets/css/page-sj-qa-allTag.css'
import labelApi from "@/api/label/label"
import {getUser} from '@/utils/auth'
export default {
  data(){
    return {
      items:[],
      followIdList:[]
    }
  },
  created(){
    this.fetchData()
  },
  methods:{
    fetchData(){
      labelApi.findAll().then(res=>{
        this.items =res.data.data
      })
      labelApi.searchFollow(getUser().id).then(res=>{
        if(res.data.flag){
          this.followIdList = res.data.data.map(label=>label.id)
        }
      })
    },
    handleFollow(id){
      if(getUser().token===undefined){
        this.$message({
            message:"登录后才能关注哦",
            type:"warning"
        })
        return;
      }
      labelApi.follow(id).then(res=>{
        this.$message({
          message:res.data.message,
          type:(res.data.flag?'success':'error')
        })
        if(res.data.flag){
          this.fetchData();
        }
      })
    },
    handleCancelFollow(id){
      labelApi.cancelFollow(id).then(res=>{
        this.$message({
          message:res.data.message,
          type:(res.data.flag?'success':'error')
        })
        if(res.data.flag){
          this.fetchData();
        }
      })
    }
  }
}
</script>
