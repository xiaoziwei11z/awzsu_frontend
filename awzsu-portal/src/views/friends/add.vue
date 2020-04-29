<template>
  <div class="wrapper">
        <div class="release-date">
    <h3><span>选择交友主题</span></h3>
    <form class="sui-form form-horizontal">
        <div class="control-group">
            <label for="inputEmail" class="control-label topic">主题：</label>
            <div class="controls">
                <ul>
                    <li class="active">
                      <el-radio v-model="pojo.topic" label="看电影">
                        <div class="topic d1">
                            <span>看电影</span>
                        </div>
                      </el-radio>
                    </li>
                    <li class="active">
                      <el-radio v-model="pojo.topic" label="吃饭">
                        <div class="topic d2">
                            <span>吃饭</span>
                        </div>
                      </el-radio>
                    </li>
                    <li class="active">
                      <el-radio v-model="pojo.topic" label="K 歌">
                        <div class="topic d3">
                            <span>K 歌</span>
                        </div>
                      </el-radio>
                    </li>
                    <li class="active">
                      <el-radio v-model="pojo.topic" label="喝咖啡">
                        <div class="topic d4">
                            <span>喝咖啡</span>
                        </div>
                      </el-radio>
                    </li>
                    <li class="active">
                      <el-radio v-model="pojo.topic" label="旅行">
                        <div class="topic d6">
                            <span>旅行</span>
                        </div>
                      </el-radio>
                    </li>
                    <li class="active">
                      <el-radio v-model="pojo.topic" label="其他">
                        <div class="topic d8">
                            <span>其他</span>
                        </div>
                      </el-radio>
                    </li>
                </ul>
            </div>
        </div>
        <div class="btn-date">
          <button type="submit" class="sui-btn btn-info btn-release " @click="handleSubmit">发布</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import '@/assets/css/page-sj-makeFriends-submit.css'
import {getUser} from '@/utils/auth'
import userApi from '@/api/user/user'
export default {
  data(){
    return {
      pojo:{},
      user:{}
    }
  },
  created(){
    this.fetchData()
  },
  methods:{
    fetchData(){
      userApi.findById(getUser().id).then(resp=>{
        this.user=resp.data.data
      })
    },
    handleSubmit(){
      if(!this.pojo.topic){
        this.$message({
            message:"请先选择交友主题",
            type:"warning"
        })
        return;
      }
      this.pojo.image=this.user.image
      this.pojo.address=this.user.address
      this.pojo.company=this.user.company
      this.pojo.sex=this.user.sex
      this.pojo.name=this.user.name
      this.pojo.birthday=this.user.birthday
      this.pojo.userid=this.user.id
      userApi.saveFriends(this.pojo).then(res=>{
        this.$message({
            message: res.data.message,
            type: (res.data.flag?'success':'error')
        })
        if(res.data.flag){
            this.$router.push('/friends')
        }
      })
    }
  }
}
</script>

