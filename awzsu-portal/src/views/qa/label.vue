<template>
  <div class="wrapper qa-content"> 
   <div class="fl left-list"> 
    <div class="tab-content"> 
     <div id="index" class="tab-pane active"> 
      <div class="tab-bottom-line"> 
       <ul class="sui-nav nav-tabs"> 
        <li :class="type=='all'?'li-a':''"><a @click="type='all';fetchData()">全部问题</a></li> 
        <li :class="type=='wait'?'li-a':''"><a @click="type='wait';fetchData()">未解决</a></li> 
        <li :class="type=='done'?'li-a':''"><a @click="type='done';fetchData()">已解决</a></li> 
       </ul>  
       <div class="qa-list" v-infinite-scroll="loadMore"> 
        <div class="tab-content"> 
         <div class="tab-pane active"> 
            <ul class="detail-list"> 
              <li class="qa-item" v-for="(item,index) in items" :key="index"> 
                <div class="fl record"> 
                <div class="number"> 
                  <div class="border answer"> 
                  <p class="ansnum">{{item.replys}}</p> 
                  <p>回答</p> 
                  </div> 
                </div> 
                </div> 
                <div class="fl info"> 
                <div class="question"> 
                  <p class="author" v-if="item.replyname===''"><span class="name"> </span><span> </span></p> 
                  <p class="author" v-else><span class="name">{{item.replyname}}</span><span>{{item.replytime}}</span>回答</p> 
                  <p class="title"><router-link :to="'/qa/detail/'+item.id">{{item.title}}</router-link></p> 
                  <br>
                  <p class="question-content" v-html="item.content"></p>
                </div> 
                <div class="other">  
                  <div class="fr brower"> 
                  <p>浏览量 {{item.visits}} | {{item.createtime}} 来自 <router-link :to="'/home/'+item.userid+'/myarticle'">{{item.username}} </router-link></p> 
                  </div> 
                </div> 
                </div> 
                <div class="clearfix"></div> 
              </li>  
           </ul>  
         </div> 
        </div> 
       </div> 
      </div> 
     </div> 
     <div id="php" class="tab-pane">
       php 
     </div> 
     <div id="js" class="tab-pane">
       Javascript 
     </div> 
     <div id="python" class="tab-pane">
       python 
     </div> 
     <div id="java" class="tab-pane">
       java 
     </div> 
    </div> 
   </div> 
   <div class="fl right-tag"> 
    <div class="block-btn"> 
     <p>今天，有什么好东西要和大家分享么?</p> 
     <a class="sui-btn btn-block btn-share" @click="handleAdd">发布问题</a> 
    </div> 
   </div> 
   <div class="clearfix"></div> 
  </div>     
</template>
<script>
import questionApi from '@/api/qa/question'
import axios from 'axios'
import {getUser} from '@/utils/auth'
export default {
  data(){
    return {
      type:'all',
      pageNo: 1,
      total:0,
      items:[]
    }
  },
  created(){
    this.fetchData();
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
  methods:{
    fetchData(){
      this.pageNo=1
      this.total=0
      if(this.type=='all'){
        questionApi.search(this.pageNo,10,{labelid:this.$route.params.id}).then(resp=>{
          this.items=resp.data.data.rows;
          this.total=resp.data.data.total;
          this.items.forEach(item => {
            this.createReplyFormat(item)
          });
        })
      }else if(this.type=='wait'){
        questionApi.search(this.pageNo,10,{labelid:this.$route.params.id,state:'1'}).then(resp=>{
          this.items=resp.data.data.rows;
          this.total=resp.data.data.total;
          this.items.forEach(item => {
            this.createReplyFormat(item)
          });
        })
      }else{
        questionApi.search(this.pageNo,10,{labelid:this.$route.params.id,state:'2'}).then(resp=>{
          this.items=resp.data.data.rows;
          this.total=resp.data.data.total;
          this.items.forEach(item => {
            this.createReplyFormat(item)
          });
        })
      }
    },
    createReplyFormat(item){
      var t1=new Date(item.createtime);
      item.createtime= t1.getFullYear()+"-"+(t1.getMonth()+1)+"-"+t1.getDate()+" "+t1.getHours()+":"+t1.getMinutes()+":"+t1.getSeconds();
      var t2=new Date(item.replytime);
      item.replytime= t2.getFullYear()+"-"+(t2.getMonth()+1)+"-"+t2.getDate()+" "+t2.getHours()+":"+t2.getMinutes()+":"+t2.getSeconds();
    },
    loadMore(){
      if(this.pageNo*10<this.total ){
        this.pageNo++;
        if(this.type=='all'){
          questionApi.search(this.pageNo,10,{labelid:this.$route.params.id}).then(res=>{
            res.data.data.rows.forEach(item => {
              this.createReplyFormat(item)
            });
            this.items=this.items.concat(res.data.data.rows)
          })
        }else if(this.type=='wait'){
          questionApi.search(this.pageNo,10,{labelid:this.$route.params.id,state:'1'}).then(resp=>{
            res.data.data.rows.forEach(item => {
              this.createReplyFormat(item)
            });
            this.items=this.items.concat(res.data.data.rows)
          })
        }else{
          questionApi.search(this.pageNo,10,{labelid:this.$route.params.id,state:'2'}).then(resp=>{
            res.data.data.rows.forEach(item => {
              this.createReplyFormat(item)
            });
            this.items=this.items.concat(res.data.data.rows)
          })
        }
      }
    },
    handleAdd(){
      if(getUser().token===undefined){
        this.$message({
            message:"登录后才能发布问题哦",
            type:"warning"
        })
        return;
      }
      this.$router.push("/qa/add")
    }
  }
}
</script>

<style>
.li-a{
    height: 30px;
    margin-bottom: 5px;
    border-bottom: 0;
    padding-left: 0;
    background-color: #fff;
}
.qa-item {
    height: 170px;
}
.question-content{
  height: 40px;
  width: 700px;
  overflow: hidden;
}
</style>
