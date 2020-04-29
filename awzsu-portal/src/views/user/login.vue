<template>
 <div class="wrapper loginsign"> 
    <div class="item signup"> 
      <div class="form"> 
      <h3 class="loginsign-title">注册新账号</h3> 
      <form class="sui-form"> 
        <div class="control-group"> 
          <div class="controls"> 
            <input type="text" v-model="user.name" placeholder="真实姓名或常用昵称" class="input-xlarge" data-rules="required" /> 
          </div> 
        </div> 
        <div class="different"> 
          <div class="radio-content"> 
            <div id="a1" class="phone"> 
            <div class="control-group number"> 
              <input type="text" v-model="user.phone" placeholder="仅支持大陆手机号" class="input-xlarge" data-rules="required|mobile" /> 
            </div> 
            <div class="control-group code"> 
              <div class="input-append"> 
                <input id="appendedInputButton" v-model="smscode" type="text" placeholder="短信验证" class="span2 input-large msg-input" /> 
                <button type="button" class="sui-btn msg-btn" @click="handleSms" :disabled="disabled">
                  <template v-if="send">
                    获取验证码
                  </template>
                  <template v-else>
                    {{second}}秒后重发
                  </template>
                </button> 
              </div> 
            </div> 
            <div class="control-group"> 
              <label for="inputpassword" class="control-label">密码</label> 
              <div class="controls"> 
              <input type="text" v-model="user.password" placeholder="请输入密码" class="input-xlarge" /> 
              </div> 
            </div> 
            </div> 
          </div> 
        </div> 
        <div class="control-group btn-signup"> 
        <label class="control-label"></label> 
        <div class="controls"> 
          <label><span class="type-text" style="font-size:12px;"></span> </label> 
          <button type="button" @click="handleRegister" class="sui-btn btn-danger btn-yes">注 册</button> 
        </div> 
        </div> 
      </form> 
      </div> 
    </div> 
    <div class="item"> 
      <div class="form"> 
      <h3 class="loginsign-title">用户登录</h3> 
        <form class="sui-form login-form"> 
          <div class="control-group"> 
            <label for="inputname" class="control-label">手机号：</label> 
            <div class="controls"> 
              <input type="text" v-model="pojo.phone" placeholder="11位手机号" class="input-xlarge" data-rules="required" /> 
            </div> 
          </div> 
          <div class="control-group"> 
            <label for="inputpassword" class="control-label">密码：</label> 
            <div class="controls"> 
              <input type="text" v-model="pojo.password" placeholder="输入登录密码" class="input-xlarge" /> 
            </div> 
          </div> 
          <div class="controls"> 
            <button type="button" class="sui-btn btn-danger btn-yes" @click="handleLogin">登 录</button> 
          </div> 
          <div class="other-methods"> 
          </div> 
        </form> 
      </div> 
    </div> 
  </div>
</template>
<script>
import '@/assets/css/page-sj-person-loginsign.css'
import userApi from '@/api/user/user'
import {setUser} from '@/utils/auth'
export default {
  data(){
    return {
        user:{},
        smscode:'',
        pojo:{},
        disabled:false,
        send:true,
        second:60
    }
  },
  methods:{
    handleSms(){//获取验证码
      userApi.sms(this.user.phone).then(res=>{
        this.$message({
          message: res.data.message,
          type: (res.data.flag?'success':'error')
        })
        if(res.data.flag){
          this.send=false;
          this.disabled=true;
          //倒计时
          let result = setInterval(()=>{
            this.second--;
            if(this.second<0){
              clearInterval(result);
              this.send=true;
              this.disabled=false;
              this.second=60;
            }
          },1000);
        }
      });
    },
    handleRegister(){
      userApi.register(this.smscode,this.user).then(res=>{
          if(res.data.flag){
              this.$message({
                  message: res.data.message,
                  type: 'success'
              })
              this.user={}
              this.pojo={}
              this.smscode=''
          }else{
              this.$message({
                  message: res.data.message,
                  type: 'error'
              })
          }
      })
    },
    handleLogin(){
      userApi.login(this.pojo).then(res=>{
        if(res.data.flag){
          let name = res.data.data.name;
          let id = res.data.data.id;
          let token = res.data.data.token;
          let image = res.data.data.image;
          setUser(token,id,name,image)
          this.$router.go(-1)
        }else{
          this.$message({
            message: res.data.message,
            type: (res.data.flag?'success':'error')
          })
          this.user={}
          this.pojo={}
          this.smscode=''
        }
      });
    }
  }
}
</script>