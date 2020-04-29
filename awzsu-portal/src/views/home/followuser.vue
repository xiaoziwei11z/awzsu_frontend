<template>
  <div class="questions" v-infinite-scroll='loadMore'> 
     <ul class="question-list"> 
      <li v-for="(item,index) in items" :key="index"> 
        <span>
          <img v-if="item.image" width="40px" height="40px" :src="item.image" alt="" class="person" /> 
          <img v-else width="40px" height="40px" :src="getPhotoImage()" alt="" class="person" >
        </span> 
        <span class="title"><router-link :to="'/home/'+item.id+'/myarticle'">{{item.name}}</router-link></span> 
        <span class="fr date">关注数:{{item.follows}} ㅤ粉丝数:{{item.fans}}</span> <span class="clearfix"></span> 
      </li> 
     </ul> 
    </div> 
</template>
<script>
import  '@/assets/css/page-sj-person-myquestion.css'
import userApi from '@/api/user/user'
export default {
  data(){
    return{
      items:[],
      pageNo:1,
      total:0
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
  created(){
    this.fetchData();
  },
  methods:{
    fetchData(){
      this.pageNo=1;
      userApi.searchFollow(this.pageNo,12,this.$route.params.id).then(res=>{
        this.items=res.data.data.rows
        this.total=res.data.data.total
      })
    },
    loadMore(){
      if(this.pageNo*12<this.total ){
          this.pageNo++;
          userApi.searchFollow(this.pageNo,12,this.$route.params.id).then(res=>{
            this.items=this.items.concat(res.data.data.rows)
          })
      }
    },
    getPhotoImage(){
      return require("@/assets/img/widget-o-photo.png")
    }
  }
}
</script>