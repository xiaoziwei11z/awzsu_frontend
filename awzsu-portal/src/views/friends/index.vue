<template>
    <div>
        <div class="banner"> 
        </div>
        <div class="wrapper tag-item"> 
            <div class="fl left-list"> 
                <div class="friend-dating-list"> 
                <ul class="friends"> 
                  <li class="friend-item" v-for="(item,index) in items" :key="index"> 
                    <div class="fl photo"> 
                        <span class="cafe-more"></span> 
                        <div class="img">
                          <img :src="item.image" width="200px" height="200px" alt="">
                        </div> 
                    </div> 
                    <div class="fl content"> 
                        <p class="title"> <span class="name"><router-link :to="'/home/'+item.userid+'/myarticle'">{{item.name}}</router-link></span> 邀你一起 <span class="cafe">{{item.topic}}</span></p> 
                        <p class="aa"> <span class="money"> {{item.age}}岁 | {{item.sex}} | {{item.address}}</span> </p> 
                        <p class="point"> 在{{item.company}}就职</p> 
                        <p class="desc"> 发布于  {{item.createtime}}</p> 
                    </div> 
                    <div class="fr xy"> 
                        <ul v-if="item.userid!=user.id"> 
                          <li><i class="like sui-icon icon-tb-like" @click="handleFollow(item.userid)"></i></li> 
                          <li><i class="close sui-icon icon-tb-roundclose" @click="handleDislike(item.userid)"></i></li> 
                        </ul> 
                    </div> 
                    <div class="clearfix"></div> 
                  </li> 
                </ul>      
                </div> 
            </div> 
            <div class="fl right-tag"> 
              <div v-if="user.id" class="friend-info-card"> 
                <div class="card"> 
                    <div class="photo-name"> 
                      <img v-if="user.image" :src="user.image" width="40px" height="40px" alt=""> 
                      <img v-else width="40px" height="40px" alt="" :src="getPhotoImage()">
                    <div class="name-edit"> 
                      <p><span class="name">{{user.name}}</span> <span class="edit"><router-link :to="'/home/'+user.id+'/detail'">编辑个人资料</router-link></span></p> 
                    </div> 
                    <div class="clearfix"></div> 
                  </div> 
                  <div class="like"> 
                    <span class="like1">关注　<i class="num"><router-link :to="'/home/'+user.id+'/followuser'">{{user.follows}}</router-link></i></span> 
                    <span>粉丝　<i class="num"><router-link :to="'/home/'+user.id+'/fansuser'">{{user.fans}}</router-link></i></span> 
                  </div> 
                </div> 
              </div> 
              <div class="block-btn"> 
                <p>约一约有趣的人，会一会好的时光！</p> 
                <a class="sui-btn btn-block btn-share" @click="handleAdd">发布交友信息</a> 
              </div> 
            </div> 
            <div class="clearfix"></div> 
            </div>
    </div>
</template>

<script>
import '@/assets/css/page-sj-makeFriends-index.css'
import {getUser} from '@/utils/auth'
import userApi from '@/api/user/user'
export default {
  data(){
    return {
      user:{},
      pageNo:1,
      items:{},
      total:0
    }
  },
  created(){
    this.fetchData()
  },
  methods:{
    fetchData(){
      this.pageNo=1
      userApi.findById(getUser().id).then(resp=>{
        this.user=resp.data.data
      })
      userApi.searchFriends(1,12).then(res=>{
          this.items=res.data.data.rows
          this.total=res.data.data.total
          this.items.forEach(item => {
            this.createtimeFormat(item)
          });
      })
    },
    handleAdd(){
      if(getUser().token===undefined){
        this.$message({
            message:"登录后才能发布交友信息哦",
            type:"warning"
        })
        return;
      }
      if(!this.user.image || !this.user.address || !this.user.sex || !this.user.company || !this.user.birthday){
        this.$message({
            message:"完善个人资料后才能发布交友信息哦",
            type:"warning"
        })
        return;
      }
      this.$router.push("/friends/add")
    },
    loadMore(){
      if(this.pageNo*12<this.total ){
          this.pageNo++;
          userApi.searchFriends(this.pageNo,12).then(res=>{
            res.data.data.rows.forEach(item => {
              this.createtimeFormat(item)
            });
            this.items=this.items.concat(res.data.data.rows)
          })
      }
    },
    createtimeFormat(item){
      var t=new Date(item.createtime);
      item.createtime= t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
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
    handleDislike(id){
      if(getUser().token===undefined){
        this.$message({
            message:"登录后才能不喜欢哦",
            type:"warning"
        })
        return;
      }
      userApi.dislike(id).then(res=>{
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
