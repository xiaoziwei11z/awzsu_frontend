<template>
  <div class="release-box"> 
    <h3>发表动态</h3> 
    <div class="editor"> 
      <quill-editor v-model="speech.content" :options="editorOption" />
      <br>
      <div class="btns"> 
        <button class="sui-btn btn-danger btn-release" @click="handleSubmit">发表</button> 
      </div> 
       <div class="clearfix"></div> 
    </div> 
  </div>
</template>
<script>
  import '@/assets/css/page-sj-spit-submit.css'
  import squareApi from '@/api/square/square'
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
      return{
        speech:{},
        editorOption:{}
      }
    },
    created(){
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
    },
    methods:{
      handleSubmit(){
        this.speech.parentid="0"
        squareApi.save(this.speech).then(res=>{
          this.$message({
              message: res.data.message,
              type: (res.data.flag?'success':'error')
          })
          if(res.data.flag){
              this.$router.push('/square')
          }
        })
      }
    }
  }
</script>

<style>
  .release-box {
    width: 1200px;
    margin: 0 auto;
    overflow-x: auto;
    overflow-y: auto;
  }
  .btns{
    text-align: right
  }
</style>
