<template>
  <div class="wrapper tag-item"> 
    <div class="fl left-list"> 
     <div class="tc-data-list"> 
      <div class="tc-list" v-infinite-scroll='loadMore'> 
       <ul class="detail-list"> 
        <li class="qa-item" v-for="(item,index) in items" :key="index"> 
         <div class="fl record"> 
          <div class="number"> 
           <div class="border useful"> 
            <p class="usenum">
              <a @click="handleThumbup(index)" class="zan">
                <i class="fa fa-thumbs-up " aria-hidden="true"></i>
              </a>
            </p> 
            <p class="zannum"> {{item.thumbups}} </p> 
           </div> 
           <div class="border answer"> 
           </div> 
          </div> 
         </div> 
         <div class="info"> 
           <div class="speech-content">
            <p class="text"> <router-link :to="'/square/detail/'+item._id" v-html="item.content"></router-link> </p> 
           </div>
          <div class="other"> 
           <div class="fl date"> 
            <span><router-link :to="'/home/'+item.userid+'/myarticle'">{{item.username}}</router-link> 发表于 {{item.createtime}}</span> 
           </div> 
           <div class="fr remark"> 
             浏览量:{{item.visits}}ㅤ
             评论数:{{item.comments}}
           </div> 
          </div> 
         </div> 
         <div class="clearfix"></div> </li> 
       </ul>        
      </div> 
     </div> 
    </div> 
    <div class="fl right-tag"> 
     <div class="block-btn"> 
      <p>发个动态，分享一下你最近的生活吧！</p> 
      <a class="sui-btn btn-block btn-share" @click="handleAdd()">发表动态</a> 
     </div> 
    </div> 
    <div class="clearfix"></div> 
   </div>
</template>
<script>
  import '@/assets/css/page-sj-spit-index.css'
  import squareApi from '@/api/square/square'
  import {getUser} from '@/utils/auth'
  export default {
    data(){
      return{
        pageNo:1,
        items:{},
        total:0
      }
    },
    created() {
        squareApi.searchByParentid(1,12,"0").then(res=>{
            this.items=res.data.data.rows
            this.total=res.data.data.total
            this.items.forEach(item => {
              this.createtimeFormat(item)
            });
        })
    },
    methods:{
      loadMore(){
        if(this.pageNo*12<this.total ){
            this.pageNo++;
            squareApi.searchByParentid(this.pageNo,12,"0").then(res=>{
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
      handleThumbup(index){
        if(getUser().token===undefined){
          this.$message({
              message:"登录后才能点赞哦",
              type:"warning"
          })
          return;
        }
        squareApi.thumbup(this.items[index]._id).then(res=>{
          this.$message({
            message:res.data.message,
            type:(res.data.flag?'success':'error')
          })
          if(res.data.flag){
              this.items[index].thumbups++;
          }
        })
      },
      handleAdd(){
        if(getUser().token===undefined){
          this.$message({
              message:"登录后才能发表动态哦",
              type:"warning"
          })
          return;
        }
        this.$router.push("/square/add")
      }
    }
  }
</script>
<style>
.speech-content{
  height: 40px;
  overflow: hidden;
}
</style>
