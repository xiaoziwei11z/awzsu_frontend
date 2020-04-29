<template>
  <div class="questions"> 
     <ul class="question-list"> 
      <li> 
        <span class="fl good" v-for="(item,index) in items" :key="index"><span class="num">{{item.labelname}}</span></span> 
        <span class="title"> </span> 
        <span class="fr date"> </span> <span class="clearfix"></span> 
      </li> 
     </ul> 
    </div> 
</template>
<script>
import  '@/assets/css/page-sj-person-myquestion.css'
import labelApi from '@/api/label/label'
export default {
  data(){
    return{
      items:[],
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
      labelApi.searchFollow(this.$route.params.id).then(res=>{
        this.items=res.data.data
      })
    },
  }
}
</script>