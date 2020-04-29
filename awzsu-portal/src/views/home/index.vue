<template>
<div>
  <div class="myhome-personinfo"> 
   <div class="wrapper"> 
    <div class="person-baseinfo"> 
     <!--头像信息--> 
     <div class="photo"> 
      <img v-if="item.image" :src="item.image" alt="" class="person" /> 
      <img v-else :src="getPhotoImage()" alt="" class="person" >
      <div class="share"> 
       <div class="guanzhu1" v-if="id!=user.id"> 
         <a class="sui-btn btn-alreadyguanzhu color" @click="handleCancelFollow(item.id)" v-if="isFollow">已关注</a> 
         <a class="sui-btn btn-guanzhu color" @click="handleFollow(item.id)" v-else>关注</a> 
       </div>  
      </div>
     </div> 
     <!--文字信息--> 
     <div class="info"> 
      <h1>{{item.name}}<span class="allinfo"><router-link :to="'/home/'+id+'/detail'">查看完整档案</router-link></span></h1> 
      <ul class="fill"> 
        <li>关注数：<router-link :to="'/home/'+id+'/followuser'">{{item.follows}}</router-link> ㅤ
        粉丝数：<router-link :to="'/home/'+id+'/fansuser'">{{item.fans}}</router-link></li>
       <li v-if="item.address"> <i class="fa fa-map-marker" aria-hidden="true"></i> <span class="edit-item"> {{item.address}}</span> </li> 
       <li v-if="item.school"> <i class="fa fa-graduation-cap" aria-hidden="true"></i> <span class="edit-item"> {{item.school}}</span></li> 
       <li v-if="item.company"> <i class="fa fa-shopping-bag" aria-hidden="true"></i> <span class="edit-item"> {{item.company}}</span> </li> 
      </ul> 
     </div> 
    </div> 
    <!--右侧编辑--> 
    <div class="edit-info"> 
     <h4>个人简介</h4> 
     <div class="info-box"> 
      <div class="edit-intro">
       {{item.detail}}
      </div> 
     </div> 
    </div> 
    <div class="clearfix"></div> 
   </div> 
  </div> 
   <!--两列布局--> 
  <div class="wrapper  myhome"> 
   <div class="left-list"> 
    <div class="myhome-list" v-if="id===user.id"> 
     <ul class="home-list"> 
       <router-link :to="'/home/'+id+'/myarticle'" active-class="active" tag="li" exact ><a>我的文章</a></router-link>
       <router-link :to="'/home/'+id+'/myquestion'" active-class="active" tag="li" exact ><a>我的提问</a></router-link>
       <router-link :to="'/home/'+id+'/myspeech'" active-class="active" tag="li" exact ><a>我的动态</a></router-link>
     </ul> 
     <ul class="home-list bottom">
       <router-link :to="'/home/'+id+'/followlabel'" active-class="active" tag="li" exact ><a>我关注的标签</a></router-link>
       <router-link :to="'/home/'+id+'/followquestion'" active-class="active" tag="li" exact ><a>我关注的问题</a></router-link>
       <router-link :to="'/home/'+id+'/followarticle'" active-class="active" tag="li" exact ><a>我收藏的文章</a></router-link>
       <router-link :to="'/home/'+id+'/followactivity'" active-class="active" tag="li" exact ><a>我收藏的活动</a></router-link>
     </ul> 
    </div>
    <div class="myhome-list" v-else> 
     <ul class="home-list"> 
       <router-link :to="'/home/'+id+'/myarticle'" active-class="active" tag="li" exact ><a>TA的文章</a></router-link>
       <router-link :to="'/home/'+id+'/myquestion'" active-class="active" tag="li" exact ><a>TA的提问</a></router-link>
       <router-link :to="'/home/'+id+'/myspeech'" active-class="active" tag="li" exact ><a>TA的动态</a></router-link>
     </ul> 
     <ul class="home-list bottom">
       <router-link :to="'/home/'+id+'/followlabel'" active-class="active" tag="li" exact ><a>TA关注的标签</a></router-link>
       <router-link :to="'/home/'+id+'/followquestion'" active-class="active" tag="li" exact ><a>TA关注的问题</a></router-link>
       <router-link :to="'/home/'+id+'/followarticle'" active-class="active" tag="li" exact ><a>TA收藏的文章</a></router-link>
       <router-link :to="'/home/'+id+'/followactivity'" active-class="active" tag="li" exact ><a>TA收藏的活动</a></router-link>
     </ul> 
    </div> 
   </div> 
   <div class="right-content"> 
    <router-view></router-view>
   </div> 
   <div class="clearfix"></div> 
  </div> 
</div>
</template>
<script>
import '@/assets/css/page-sj-qa-allTag.css'
import '@/assets/css/page-sj-person-homepage.css'
import {getUser} from "@/utils/auth"
import userApi from '@/api/user/user'
export default{
  data(){
    return {
      user:{},
      id:'',
      item:{},
      isFollow:false
    }
  },
  watch:{
    $route:{
      //深度监听，同时也可监听到param参数变化
      deep:true,
      handler(){
        this.fetchData()
      }
    }
  },
  created() {
    this.fetchData();
  },
  methods:{
    fetchData(){
      this.user = getUser();
      this.id=this.$route.params.id;
      userApi.findIsFollow(this.id).then(resp=>{
          if(resp.data.flag){
            this.isFollow=resp.data.data
          }
        })
      userApi.findById(this.id).then(resp=>{
        this.item=resp.data.data
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
      userApi.follow(id).then(res=>{
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
      userApi.cancelFollow(id).then(res=>{
        this.$message({
          message:res.data.message,
          type:(res.data.flag?'success':'error')
        })
        if(res.data.flag){
          this.fetchData();
        }
      })
    },
    getPhotoImage(){
      return require("@/assets/img/widget-o-photo.png")
    }
  }
}
</script>
<style>
.guanzhu1{
  text-align: center
}
</style>
