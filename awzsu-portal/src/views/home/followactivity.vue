<template>
  <div class="questions" v-infinite-scroll='loadMore'> 
     <ul class="question-list"> 
      <li v-for="(item,index) in items" :key="index"> 
        <span class="title"><router-link :to="{path:'/activity/detail', query:{id:item.id}}">{{item.name}}</router-link></span> 
        <span class="fr date">{{item.holdingtime}}</span> <span class="clearfix"></span> 
      </li> 
     </ul> 
    </div> 
</template>
<script>
import  '@/assets/css/page-sj-person-myquestion.css'
import activityApi from '@/api/activity/activity'
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
      activityApi.searchFollow(this.pageNo,12,this.$route.params.id).then(res=>{
        this.items=res.data.data.rows
        this.total=res.data.data.total
      })
    },
    loadMore(){
      if(this.pageNo*12<this.total ){
          this.pageNo++;
          activityApi.searchFollow(this.pageNo,12,this.$route.params.id).then(res=>{
            this.items=this.items.concat(res.data.data.rows)
          })
      }
    }
  }
}
</script>