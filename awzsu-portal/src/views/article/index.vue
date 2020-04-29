<template>
    <div>
      <div class="tab-nav "> 
        <div class="wrapper"> 
          <ul class="fl sui-nav nav-tabs navbar-dark">            
            <router-link tag="li" to="/article/label/0" active-class="active" exact  ><a> 首页</a></router-link>
            <router-link tag="li" :to="'/article/label/'+item.id" active-class="active" v-for="(item,index) in items" :key="index"  >                
                <a>{{item.labelname}} </a>
            </router-link>            
            </ul> 
          <span class="fr more"><router-link to="/label">更多</router-link></span> 
          <div class="clearfix"></div> 
        </div> 
     </div>
     <router-view></router-view>
    </div>
</template>
<script>
import '@/assets/css/page-sj-qa-logined.css'
import labelApi from "@/api/label/label"
import {getUser} from '@/utils/auth'
export default {
  data(){
    return {
      items:[]
    }
  },
  created(){
    labelApi.searchFollow(getUser().id).then(res=>{
      this.items =res.data.data
    })
  }
}
</script>