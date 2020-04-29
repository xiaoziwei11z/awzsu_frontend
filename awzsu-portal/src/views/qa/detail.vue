<template>
  <div class="wrapper qa-content">
    <div class="qa-title">
      <div class="fl title">
        <h2>{{item.title}}</h2>
        <p>
          <span class="author"><router-link :to="'/home/'+item.userid+'/myarticle'">{{item.username}}</router-link></span>ㅤ
          <span>{{item.createtime}}提问</span>ㅤㅤ
          <span v-if="isFollow==false"><a @click="handleFollow(item.id)">关注</a></span>
          <span v-else><a @click="handleCancelFollow(item.id)">取消关注</a></span>
        </p>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="fl left-list">
      <div class="problem-detail">
        <div class="title-intro">
          <div class="title">
            <div class="detail" v-html="item.content">
            </div>
            <div class="clearfix"></div>
            <div class="operate" v-if="item.userid===userid">
              <span class="comment" v-if="item.state=='2'">已解决</span>
              <span class="comment" v-else><a @click="handleDone(item.id)">解决</a></span>
            </div>
            <div class="operate" v-else>
              <span class="comment" v-if="item.state=='2'">已解决</span>
              <span class="comment" v-else>未解决</span>
              <span class="comment"><a @click="handleReply">回答</a></span>
            </div>
          </div>
        </div>
        <div class="answer-intro">
          <h4 class="answer-num">{{item.replys}}个回答</h4>
          <ul>
            <li v-for="(reply,index) in replyList" :key="index"> 
              <div class="title">
                <p v-html="reply.content"></p>
                <div class="operate">
                  <div class="tool pull-left">
                    <span class="author"><router-link :to="'/home/'+reply.userid+'/myarticle'">{{reply.username}}</router-link></span>ㅤ
                    <span class="time">{{reply.createtime}}回答</span>
                  </div>
                  <div class="myanswer pull-right">
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
              <hr>
            </li>
          </ul>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <el-dialog
      title="回答问题"
      :visible.sync="dialogVisible"
      width="40%" >
      <quill-editor v-model="pojo.content" :options="editorOption" />
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/page-sj-qa-detail.css'
import questionApi from '@/api/qa/question'
import replyApi from '@/api/qa/reply'
import {getUser} from '@/utils/auth'
import { quillEditor } from 'vue-quill-editor'
import {quillRedefine} from 'vue-quill-editor-upload'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
    components:{
      quillEditor,
      quillRedefine
    },
    data(){
        return {
          pageNo:1,
          total:0,
          item:{},
          replyList:{},
          dialogVisible: false,
          pojo:{},
          editorOption: {},
          userid:"",
          isFollow:false
        }
    },
    created(){
      this.userid=getUser().id;
      this.editorOption = quillRedefine(
        {
          // 图片上传的设置
          uploadConfig: {
            action:  'http://api.awzsu.com/api/upload/image',  // 必填参数 图片上传地址
            res: (resp) => { // 必须把返回的数据中所包含的图片地址 return 回去
              return resp.data
            },
            methods: 'post',  // 必填参数 图片上传方式
            // token: '',  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
            name: 'file',  // 必填参数 文件的参数名
            // size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
            accept: 'multipart/form-data, image/png, image/gif, image/jpeg, image/bmp, image/x-icon,image/jpg'  // 可选 可上传的图片格式
          }
        }
      )
      this.fetchData();
    },
    methods:{
      fetchData(){
        this.pageNo=1
        this.total=0
        questionApi.findIsFollow(this.$route.params.id).then(resp=>{
          if(resp.data.flag){
            this.isFollow=resp.data.data
          }
        })
        questionApi.findById(this.$route.params.id).then(resp=>{
          this.item = resp.data.data;
          this.createReplyFormat(this.item)
        })
        replyApi.searchByQuestionid(1,12,this.$route.params.id).then(res=>{
          this.replyList=res.data.data.rows
          this.total=res.data.data.total
          this.replyList.forEach(item => {
              this.createtimeFormat(item)
            });
        })
      },
      loadMore(){
        if(this.pageNo*12<this.total ){
          this.pageNo++;
          replyApi.searchByQuestionid(this.pageNo,12,this.$route.params.id).then(res=>{
            res.data.data.rows.forEach(item => {
              this.createtimeFormat(item)
            });
            this.replyList=this.replyList.concat(res.data.data.rows)
          })
        }
      },
      handleSubmit(){
        this.pojo.questionid=this.item.id
        replyApi.save(this.pojo).then(res=>{
          this.$message({
              message: res.data.message,
              type: (res.data.flag?'success':'error')
          })
          if(res.data.flag){
            this.dialogVisible=false;
            this.fetchData();
          }
        })
      },
      createtimeFormat(item){
        var t=new Date(item.createtime);
        item.createtime= t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
      },
      createReplyFormat(item){
        var t1=new Date(item.createtime);
        item.createtime= t1.getFullYear()+"-"+(t1.getMonth()+1)+"-"+t1.getDate()+" "+t1.getHours()+":"+t1.getMinutes()+":"+t1.getSeconds();
        var t2=new Date(item.replytime);
        item.replytime= t2.getFullYear()+"-"+(t2.getMonth()+1)+"-"+t2.getDate()+" "+t2.getHours()+":"+t2.getMinutes()+":"+t2.getSeconds();
      },
      handleReply(){
        if(getUser().token===undefined){
          this.$message({
              message:"登录后才能回答问题哦",
              type:"warning"
          })
          return;
        }
        this.dialogVisible=true;
        this.pojo.content=''
      },
      handleDone(id){
        this.$confirm('确定已解决吗？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          questionApi.done(id).then(res=>{
            this.$message({
              message:res.data.message,
              type:(res.data.flag?'success':'error')
            })
            if(res.data.flag){
              this.fetchData()
            }
          })
        })
      },
      handleFollow(id){
        if(getUser().token===undefined){
          this.$message({
              message:"登录后才能关注哦",
              type:"warning"
          })
          return;
        }
        questionApi.follow(id).then(res=>{
          this.$message({
            message:res.data.message,
            type:(res.data.flag?'success':'error')
          })
          if(res.data.flag){
            this.fetchData();
          }
        })
      },
      handleCancelFollow(id){
        questionApi.cancelFollow(id).then(res=>{
          this.$message({
            message:res.data.message,
            type:(res.data.flag?'success':'error')
          })
          if(res.data.flag){
            this.fetchData();
          }
        })
      }
    }
}
</script>