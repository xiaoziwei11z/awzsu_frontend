<template>
    <div class="wrapper tc-detail"> 
    <div class="fl left-list"> 
     <div class="tc-detail"> 
      <!-- 标题区 --> 
      <div class="detail-tit"> 
       <div class="detail-author"> 
        <router-link :to="'/home/'+item.userid+'/myarticle'">{{item.username}}</router-link> 发表于 {{item.createtime}}
       </div> 
       <div class="detail-content" v-html="item.content"> 
       </div> 
       <div class="detail-tool"> 
        <ul> 
         <li v-if="item.userid===userid"><a @click="handleDelete(item._id,'0')">删除</a></li>
         <li><span class="star"><i class="fa fa-thumbs-o-up" aria-hidden="true" @click="handleThumbupOne(item._id)"></i> {{item.thumbups}}</span></li> 
         <li><i @click="handleComment()" class="fa fa-commenting" aria-hidden="true"></i> {{item.comments}}</li> 
        </ul> 
       </div> 
      </div>       
      <!-- 评论区 --> 
      <div class="comment-area" v-infinite-scroll='loadMore'> 
       <div class="comment-tit"> 
        <span>评论</span> 
       </div> 
       <ul class="comment-list"> 
        <li v-for="(comment,index) in commentList" :key="index"> 
         <div class="item-content"> 
          <p class="author"><router-link :to="'/home/'+comment.userid+'/myarticle'">{{comment.username}}</router-link> 发表于 {{comment.createtime}}</p> 
          <p class="content" v-html="comment.content"></p> 
         </div> 
         <div class="item-thumb"> 
          <div>
            <a v-if="comment.userid===userid || item.userid==userid" @click="handleDelete(comment._id,comment.parentid)">删除</a>ㅤ
           <i class="fa fa-thumbs-o-up" aria-hidden="true" @click="handleThumbup(index)"></i> {{comment.thumbups}}
          </div> 
         </div> 
         </li> 
       </ul> 
      </div> 
     </div> 
    </div> 
    <div class="clearfix"></div> 
    <el-dialog
        title="评论"
        :visible.sync="dialogVisible"
        width="40%" >
        <quill-editor v-model="speech.content" :options="editorOption" />
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
    </el-dialog>
   </div> 
</template>
<script>
import '@/assets/css/page-sj-spit-detail.css'
import squareApi from '@/api/square/square'
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
          speech:{},
          editorOption: {},
          userid:""
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
        squareApi.findById(this.$route.params.id).then(resp=>{
          this.item = resp.data.data;
          this.createtimeFormat(this.item)
        })
        squareApi.searchByParentid(1,12,this.$route.params.id).then(res=>{
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
          squareApi.searchByParentid(this.pageNo,12,this.$route.params.id).then(res=>{
            res.data.data.rows.forEach(item => {
              this.createtimeFormat(item)
            });
            this.commentList=this.commentList.concat(res.data.data.rows)
          })
        }
      },
      handleSubmit(){
        this.speech.parentid=this.item._id
        squareApi.save(this.speech).then(res=>{
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
      handleDelete(id,parentid){
        this.$confirm('确定删除吗？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          squareApi.deleteById(id,parentid).then(resp=>{
            this.$message({
              message:resp.data.message,
              type:(resp.data.flag? 'success' : 'error')
            })
            if(resp.data.flag){
              if(parentid=='0'){
                this.$router.push('/square')
              }else{
                this.fetchData();
              }
            }
          })
        })
      },
      createtimeFormat(item){
        var t=new Date(item.createtime);
        item.createtime= t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
      },
      handleThumbup(index){
        if(getUser().token===undefined){
          this.$message({
              message:"登录后才能点赞哦",
              type:"warning"
          })
          return;
        }
        squareApi.thumbup(this.commentList[index]._id).then(res=>{
          this.$message({
            message:res.data.message,
            type:(res.data.flag?'success':'error')
          })
          if(res.data.flag){
              this.commentList[index].thumbups++;
          }
        })
      },
      handleThumbupOne(id){
        if(getUser().token===undefined){
          this.$message({
              message:"登录后才能点赞哦",
              type:"warning"
          })
          return;
        }
        squareApi.thumbup(id).then(res=>{
          this.$message({
            message:res.data.message,
            type:(res.data.flag?'success':'error')
          })
          if(res.data.flag){
              this.item.thumbups++;
          }
        })
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
        this.speech.content=''
      }
    }
}
</script>