<template>
  <div class="wrapper activities"> 
   <h1>{{item.name}}</h1> 
   <div class="img-text"> 
    <div class="left-img"> 
     <img :src="item.image" alt="" /> 
    </div> 
    <div class="right-txt"> 
     <h4 class="follow-m" v-if="isFollow==false"><a @click="handleFollow(item.id)">收藏</a></h4>
     <h4 class="follow-m" v-else><a @click="handleCancelFollow(item.id)">取消收藏</a></h4>
     <p>举办时间： {{item.holdingtime}}</p> 
     <p>举办地点： {{item.address}}</p> 
     <p>报名截止：{{item.enrolltime}} </p>
    </div> 
   </div> 
   <div class="simple-text"> 
    <div class="left-content"> 
     <div class="content-item"> 
      <div class="text" v-html="item.content"> 
      </div>
     </div> 
    </div> 
    <div class="right-intro"> 
     <div class="content-item"> 
      <div class="tit">
       <span>联系我们</span>
      </div> 
      <div class="text"> 
       <p>联系人：{{item.contactname}}</p> 
       <p>电话：{{item.contactphone}}</p> 
       <p>邮箱：{{item.contactemail}}</p> 
      </div> 
     </div> 
    </div> 
   </div> 
  </div> 
</template>
<script>
import "@/assets/css/page-sj-activity-detail.css"
import activityApi from '@/api/activity/activity'
import {getUser} from '@/utils/auth'
export default {
  data(){
    return{
      item:{},
      isFollow:false
    }
  },
  created(){
    this.fetchData();
  },
  methods:{
    fetchData(){
      activityApi.findById(this.$route.query.id).then(resp=>{
        this.item = resp.data.data
        this.enrolltimeFormat();
      })
      activityApi.findIsFollow(this.$route.query.id).then(resp=>{
        if(resp.data.flag){
          this.isFollow=resp.data.data
        }
      })
    },
    enrolltimeFormat(){
      var t=new Date(this.item.enrolltime);
      this.item.enrolltime= t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
    },
    handleFollow(id){
      if(getUser().token===undefined){
        this.$message({
            message:"登录后才能收藏哦",
            type:"warning"
        })
        return;
      }
      activityApi.follow(id).then(res=>{
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
      activityApi.cancelFollow(id).then(res=>{
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
<style>
.follow-m{
  width: 1100px;
  text-align: right
}
</style>
