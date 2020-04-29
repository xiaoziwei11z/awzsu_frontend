<template>
  <div class="wrapper headline-content">
    <div class="fl left-list">
    <div class="problem-detail">
    <!-- title area  -->
    <div class="title-intro">
        <h2>{{item.title}}</h2>
        <div class="operate">
            <span class="fl author"><router-link :to="'/home/'+item.userid+'/myarticle'">{{item.username}}</router-link> 发布于　{{item.createtime}}</span>
            <span class="fr " v-if="isFollow==false"><a @click="handleFollow(item.id)">收藏</a></span>
            <span class="fr " v-else><a @click="handleCancelFollow(item.id)">取消收藏</a></span>
        </div>
        <div class="clearfix"></div>
        <div class="content" v-html="item.content">
        </div>
    </div>
    <!-- remark area -->
    <div class="answer-intro">
        <h4 class="answer-num">{{item.comments}}条评论　　<a @click="handleComment">评论</a></h4>
        <div class="remark-list">
            <ul class="lists">
                <li class="item" v-for="(comment,index) in commentList" :key="index">
                    <div class="fl img">
                    </div>
                    <div class="fl text">
                        <p class="author"><span class="name"><router-link :to="'/home/'+comment.userid+'/myarticle'">{{comment.username}}</router-link></span> 发布于　{{comment.createtime}}</p>
                        <p class="word" v-html="comment.content"></p>
                    </div>
                    <div style="clear:both"></div>
                <hr>
                </li>
            </ul>
         </div>
       </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <el-dialog
      title="评论文章"
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
import '@/assets/css/page-sj-headline-detail.css'
import articleApi from '@/api/article/article'
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
          commentList:{},
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
        articleApi.findIsFollow(this.$route.params.id).then(resp=>{
          if(resp.data.flag){
            this.isFollow=resp.data.data
          }
        })
        articleApi.findById(this.$route.params.id).then(resp=>{
          this.item = resp.data.data;
          this.createtimeFormat(this.item)
        })
        articleApi.searchCommentsByArticleid(1,12,this.$route.params.id).then(res=>{
          this.commentList=res.data.data.rows
          this.total=res.data.data.total
          this.commentList.forEach(item => {
              this.createtimeFormat(item)
            });
        })
      },
      loadMore(){
        if(this.pageNo*12<this.total ){
          this.pageNo++;
          articleApi.searchCommentsByArticleid(this.pageNo,12,this.$route.params.id).then(res=>{
            res.data.data.rows.forEach(item => {
              this.createtimeFormat(item)
            });
            this.commentList=this.commentList.concat(res.data.data.rows)
          })
        }
      },
      handleSubmit(){
        this.pojo.articleid=this.item.id
        articleApi.saveComment(this.pojo).then(res=>{
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
      handleComment(){
        if(getUser().token===undefined){
          this.$message({
              message:"登录后才能评论哦",
              type:"warning"
          })
          return;
        }
        this.dialogVisible=true;
        this.pojo.content=''
      },
      handleFollow(id){
        if(getUser().token===undefined){
          this.$message({
              message:"登录后才能收藏哦",
              type:"warning"
          })
          return;
        }
        articleApi.follow(id).then(res=>{
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
        articleApi.cancelFollow(id).then(res=>{
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