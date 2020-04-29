<template>
  <div>
    <div class="activity-head"> 
      <div class="wrapper"> 
        <!--头部导航--> 
        <header> 
          <div class="sui-navbar"> 
            <div class="navbar-inner"> 
              <router-link to="/article" class="sui-brand"><img :src="getLogoImage()" alt="社交"></router-link> 
              <ul class="sui-nav"> 
                <router-link to="/article" tag="li" active-class="active" exact><a>文章</a></router-link>
                <router-link to="/activity" tag="li" active-class="active"><a>活动</a></router-link>
                <router-link to="/square" tag="li" active-class="active"><a>动态广场</a></router-link>
                <router-link to="/qa" tag="li" active-class="active"><a>问答</a></router-link>
                <router-link to="/friends" tag="li" active-class="active"><a>交友</a></router-link>
              </ul> 
              <form class="sui-form sui-form pull-left"> 
                <input type="text" v-model="keyword" placeholder="输入关键词..."> 
                <router-link :to="'/article/search/'+keyword"><span class="btn-search fa fa-search"></span> </router-link>
              </form> 
              <div class="sui-nav pull-right info" v-if="user.token!==undefined"> 
                <li><router-link :to="'/home/'+user.id+'/myarticle'" class="notice">{{user.name}}</router-link></li>
                <li><router-link :to="'/home/'+user.id+'/myarticle'" class="homego">
                  <img v-if="user.image" :src="user.image" width="50px" height="50px" :alt="user.name"> 
                  <img v-else width="50px" height="50px" :alt="user.name" :src="getPhotoImage()">
                </router-link></li> 
                <li><a @click="handleLogout" class="notice">退出登录</a></li>
              </div>
              <div class="sui-nav pull-right info" v-if="user.token === undefined"> 
                <li><router-link to="/user/login">注册</router-link></li> 
                <li><router-link to="/user/login" class="sui-btn btn-login">登录</router-link></li>  
              </div> 
            </div> 
          </div> 
        </header> 
      </div> 
    </div>
    <router-view></router-view>
    <div class="footer"> 
      <div class="wrapper"> 
        <div class="footer-bottom"> 
        <div class="link"> 
          <dl> 
          <dt>
            网站相关
          </dt> 
          <dd>
            关于我们
          </dd> 
          <dd>
            服务条款
          </dd> 
          <dd>
            帮助中心
          </dd> 
          <dd>
            编辑器语法
          </dd> 
          </dl> 
          <dl> 
          <dt>
            常用链接
          </dt> 
          <dd>
            网易博客
          </dd> 
          <dd>
            天涯论坛
          </dd> 
          </dl> 
          <dl> 
          <dt>
            联系我们
          </dt> 
          <dd>
            联系我们
          </dd> 
          <dd>
            加入我们
          </dd> 
          <dd>
            建议反馈
          </dd> 
          </dl> 
          <dl> 
          <dt>
            关注我们
          </dt> 
          <dd>
            微博
          </dd> 
          <dd>
            twitter
          </dd> 
          </dl> 
          <div class="xuke"> 
          <h3>内容许可</h3> 
          <p>除特别说明外，用户内容均采用知识共享署名-非商业性使用-禁止演绎4.0 国际许可协议 (CC BY-NC-ND 4.0) 进行许可</p> 
          <p>本站由 一直看 提供更新服务</p> 
          </div> 
        </div> 
        <p class="Copyright">Copyright © 2020 一直看社区 当前版本 1.0.0</p> 
        </div> 
      </div> 
    </div>
  </div>
</template>

<script>
import '@/assets/plugins/normalize-css/normalize.css'
import '@/assets/plugins/yui/cssgrids-min.css'
import '@/assets/plugins/sui/sui.min.css'
import '@/assets/plugins/sui/sui-append.min.css'
import '@/assets/plugins/font-awesome/css/font-awesome.min.css'
import '@/assets/css/widget-base.css'
import '@/assets/css/widget-head-foot.css'
import {getUser,removeUser} from '@/utils/auth'
export default {
  data(){
    return {
      user:{},
      keyword:""
    }
  },
  created(){
    this.user = getUser();
  },
  methods:{
    handleLogout(){
      removeUser();
      this.$router.go(0)
    },
    getLogoImage(){
      return require("@/assets/img/asset-logo-black.png")
    },
    getPhotoImage(){
      return require("@/assets/img/widget-o-photo.png")
    }
  },
}
</script>