<template>
  <div class="questions" v-infinite-scroll='loadMore'> 
     <ul class="question-list"> 
      <li v-for="(item,index) in items" :key="index"> 
        <span class="fl good"><span class="num">{{item.comments}}</span> 评论</span> 
        <span class="title"><router-link :to="'/article/detail/'+item.id">{{item.title}}</router-link></span> 
        <span class="fr date">{{item.createtime}}</span> <span class="clearfix"></span> 
      </li> 
     </ul> 
    </div> 
</template>
<script>
import  '@/assets/css/page-sj-person-myquestion.css'
import articleApi from '@/api/article/article'
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
      articleApi.searchByUserid(this.pageNo,12,this.$route.params.id).then(res=>{
        this.items=res.data.data.rows
        this.total=res.data.data.total
        this.items.forEach(item => {
          this.createtimeFormat(item)
        });
      })
    },
    loadMore(){
      if(this.pageNo*12<this.total ){
          this.pageNo++;
          articleApi.searchByUserid(this.pageNo,12,this.$route.params.id).then(res=>{
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