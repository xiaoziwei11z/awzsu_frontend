<template>
  <div class="file-edit"> 
      <div class="info"> 
       <h3 class="tit"><span>个人档案</span></h3> 
       <!-- 个人信息 --> 
       <div class="sui-row-fluid person canadd"> 
        <div class="span4 item"> 
         <h3 class="name">真人头像</h3> 
         <img v-if="item.image"  width="200px" height="200px"  :src="item.image" alt=""> 
         <img v-else :src="getPhotoImage()">
        </div> 
        <div class="span4 item"> 
         <h3 class="name">姓名</h3> 
         <p>{{item.name}}</p> 
         <h3 class="name">出生日期</h3> 
         <p>{{item.birthdayShow}}</p> 
         <h3 class="name">所在地</h3> 
         <p>{{item.address}}</p> 
        </div> 
        <div class="span3 item"> 
         <h3 class="name">性别</h3> 
         <p>{{item.sex}}</p> 
         <h3 class="name">个人网站</h3> 
         <p>{{item.site}}</p> 
         <h3 class="name">公司组织</h3> 
         <p>{{item.company}}</p> 
         <h3 class="name">毕业院校</h3> 
         <p>{{item.school}}</p> 
        </div> 
        <div class="span1 edit"> 
         <span class="gray" @click="handleEdit" v-if="id===user.id"><i class="fa fa-pencil" aria-hidden="true"></i> 编辑</span> 
        </div> 
        <div style="clear:both"></div> 
       </div> 
      </div>
      <el-dialog
        title="个人档案"
        :visible.sync="dialogVisible"
        fullscreen
        center
        width="40%" >
        <el-form label-width="80px">
          <el-form-item label="名字">
            <el-input v-model="pojo.name" placeholder="名字"></el-input>
          </el-form-item>
          <el-form-item label="头像">
              <el-upload
                  class="avatar-uploader"
                  action="http://api.awzsu.com/api/upload/image"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="pojo.image" :src="pojo.image" class="avatar">
                  <i v-if="!pojo.image" class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker type="date" placeholder="出生日期" v-model="pojo.birthday" ></el-date-picker>
          </el-form-item>
          <el-form-item label="所在地">
            <el-input v-model="pojo.address" placeholder="所在地"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="pojo.sex" placeholder="性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="个人网站">
            <el-input v-model="pojo.site" placeholder="个人网站"></el-input>
          </el-form-item>
          <el-form-item label="公司组织">
            <el-input v-model="pojo.company" placeholder="公司组织"></el-input>
          </el-form-item>
          <el-form-item label="毕业院校">
            <el-input v-model="pojo.school" placeholder="毕业院校"></el-input>
          </el-form-item>
          <el-form-item label="个人简介">
             <el-input type="textarea" v-model="pojo.detail"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="handleSubmit">提交</el-button>
              <el-button @click="dialogVisible = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> 
  </div>
</template>
<script>
import '@/assets/css/page-sj-person-myfile.css'
import {getUser} from "@/utils/auth"
import {setUserDetail} from "@/utils/auth"
import userApi from '@/api/user/user'
export default{
  data(){
    return {
      user:{},
      id:'',
      item:{},
      pojo:{},
      dialogVisible: false,
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
  created() {
    this.fetchData();
  },
  methods:{
    fetchData(){
      this.user = getUser();
      this.id=this.$route.params.id;
      userApi.findById(this.id).then(resp=>{
        this.item=resp.data.data
        this.birthdayFormat(this.item)
      })
    },
    birthdayFormat(item){
      var t=new Date(item.birthday);
      item.birthdayShow = t.getFullYear()+"年"+(t.getMonth()+1)+"月"+t.getDate()+"日";
    },
    handleEdit(){
      this.dialogVisible=true;
      this.pojo=this.item
    },
    handleAvatarSuccess(res, file) {
      this.pojo.image=res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }, 
    handleSubmit(){
      userApi.save(this.pojo).then(res=>{
        this.$message({
            message: res.data.message,
            type: (res.data.flag?'success':'error')
        })
        if(res.data.flag){
          this.dialogVisible=false;
          setUserDetail(this.pojo.name,this.pojo.image)
          this.$router.go(0)
        }
      })
    },
    getPhotoImage(){
      return require("@/assets/img/widget-o-photo.png")
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>