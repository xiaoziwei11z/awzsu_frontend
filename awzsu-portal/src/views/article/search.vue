<template>
  <div class="wrapper qa-content"> 
   <div class="fl left-list"> 
    <div class="tab-content"> 
     <div id="index" class="tab-pane active"> 
      <div class="tab-bottom-line"> 
       <div class="qa-list"> 
        <div class="tab-content"> 
         <div class="tab-pane active"> 
           <div class="data-list" v-infinite-scroll="loadMore"> 
            <ul class="headline fixed" id="headline"> 
              <li class="headline-item" v-for="(item,index) in items" :key="index"> 
                <div class="fl indexImg"> 
                  <img src=""> 
                </div> 
                <div class="words"> 
                  <h3><router-link :to="'/article/detail/'+item.id">{{item.title}}</router-link> <span><img src="" class="vip"></span></h3> 
                  <h5 class="author"> 
                  <div class="fl"> 
                    <span class="authorName"> {{item.username}} </span> 
                    <span>{{item.createtime}}</span> 
                  </div> 
                  <div class="fr attention"> 
                  </div> 
                  <div class="clearfix"></div> </h5> 
                  <br>
                </div> <p class="article-content" v-html="item.content"></p> 
              </li>
            </ul> 
            <ul id="loaded" class="headline"> 
            </ul> 
          </div>
          </div> 
        </div> 
       </div> 
      </div> 
     </div> 
    </div> 
   </div> 
   <div class="clearfix"></div> 
  </div>     
</template>
<script>
import searchApi from '@/api/article/search'
import axios from 'axios'
import {getUser} from '@/utils/auth'
import '@/assets/css/page-sj-headline-login.css'
export default {
  data(){
    return {
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
      searchApi.searchIndex(this.$route.params.keyword,this.pageNo,10).then(resp=>{
        this.items=resp.data.data.rows;
        this.total=resp.data.data.total;
        this.items.forEach(item => {
          this.createtimeFormat(item)
        });
      })
    },
    loadMore(){
      if(this.pageNo*10<this.total ){
        this.pageNo++;
        searchApi.searchIndex(this.$route.params.keyword,this.pageNo,10).then(res=>{
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
.headline-item {
    height: 200px;
}
.article-content{
  height: 70px;
  width: 800px;
  overflow: hidden;
}
</style>
