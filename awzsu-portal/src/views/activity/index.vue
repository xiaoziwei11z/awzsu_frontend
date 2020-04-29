<template>
  <div class="wrapper activities"> 
   <div class="activity-card-list"> 
    <div class="top-title"> 
     <h4 class="latest">活动列表</h4>      
     <div class="clearfix"></div> 
    </div> 
    <div class="activity-list" v-infinite-scroll="loadMore" >
     <ul class="activity"> 
        <li class="activity-item" v-for="(item,index) in items" :key="index"> 
        <div class="activity-inner"> 
            <div class="img">
                <router-link :to="{path:'/activity/detail', query:{id:item.id}}"><img :src="item.image" alt="" /></router-link>
            </div> 
            <div class="text"> 
            <p class="title">{{item.name}}</p> 
            <div class="fl goin"> 
            <p>时间：{{item.holdingtime}}</p> 
            <p>地点：{{item.address}}</p> 
            </div> 
            <div class="clearfix"></div> 
            </div> 
        </div> 
       </li>  
     </ul> 
    </div> 
   </div> 
  </div>
</template>
<script>
    import '@/assets/css/page-sj-activity-index.css'
    import activityApi from '@/api/activity/activity'
    export default {
        data(){
            return {
                pageNo:1,
                items:{},
                total:0
            }
        },
        created() {
            activityApi.search(1,12,{state:"1"}).then(res=>{
                this.items=res.data.data.rows
                this.total=res.data.data.total
            })
        },
        methods:{
            loadMore(){
                if(this.pageNo*12<this.total ){
                    this.pageNo++;
                    activityApi.search(this.pageNo,12,{state:"1"}).then(res=>{
                        this.items=this.items.concat(res.data.data.rows)
                    })
                }
            }
        }
    }
</script>