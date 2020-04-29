<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="ㅤ活动名称">
        <el-input v-model="searchMap.name" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
      <el-button type="primary" @click="handleAdd()">新增活动</el-button>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="活动名称"
        width="400">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="holdingtime"
        label="举办时间"
        width="400">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="address"
        label="举办地点"
        width="400">
      </el-table-column>
      <el-table-column
        label="操作"
        width="115">
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      @size-change="sizeChange"
      @current-change="pageChange"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> 
    <el-dialog 
      title="活动详情"
      :visible.sync="dialogFormVisible"
      center
      fullscreen
      width="50%" >
      <el-form label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="activity.name" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍">
          <el-button type="primary" @click="dialogEditVisible=true">编辑</el-button>
        </el-form-item>
        <el-form-item label="活动图片">
            <el-upload
                class="avatar-uploader"
                action="http://api.awzsu.com/api/upload/image"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="activity.image" :src="activity.image" class="avatar">
                <i v-if="!activity.image" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="举办时间">
          <el-input v-model="activity.holdingtime" placeholder="举办时间"></el-input>
        </el-form-item>
        <el-form-item label="举办地点">
          <el-input v-model="activity.address" placeholder="举办地点"></el-input>
        </el-form-item>
        <el-form-item label="报名截止">
          <el-date-picker type="datetime" placeholder="报名截止时间" v-model="activity.enrolltime" ></el-date-picker>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="activity.contactname" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="activity.contactphone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="activity.contactemail" placeholder="联系邮箱"></el-input>
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch active-value="1" inactive-value="0" v-model="activity.state" ></el-switch>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button @click="dialogFormVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog 
      title="活动详细介绍"
      :visible.sync="dialogEditVisible"
      fullscreen
      center
      width="70%" >
      <quill-editor v-model="activity.content" :options="editorOption" />
    </el-dialog>
  </div>
</template>

<script>
  import activityApi from '@/api/activity/activity'
  import { quillEditor } from 'vue-quill-editor'
  import {quillRedefine} from 'vue-quill-editor-upload'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    data() {
      return {
        tableData: [],
        total:0,
        currentPage:1,
        pageSize:10,
        searchMap:{},
        dialogFormVisible:false,
        dialogEditVisible:false,
        activity:{},
        id:'',
        editorOption:{}
      }
    },
    components: {
      quillEditor,
      quillRedefine
    },
    created(){
      this.fetchData();
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
      handleAvatarSuccess(res, file) {
        console.log(res)
        if(res.flag){
          this.activity.image=res.data
        }
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
      sizeChange(val){
        this.pageSize=val;
        this.currentPage=1;
        this.fetchData();
      },
      pageChange(val){
        this.currentPage=val;
        this.fetchData();
      },
      fetchData(){
        activityApi.search(this.currentPage,this.pageSize,this.searchMap).then(resp=>{
          this.tableData=resp.data.rows;
          this.total=resp.data.total;
        })
      },
      handleAdd(){
          this.activity={};
          this.id='';
          this.dialogFormVisible=true;
      },
      handleDetail(id){
        activityApi.findById(id).then(resp=>{
          if(resp.flag){
            this.id=id;
            this.activity=resp.data;
            this.dialogFormVisible=true;
          }
        })
      },
      handleSubmit(){
        if(this.id===''){
            //新增
            activityApi.save(this.activity).then(resp=>{
                this.$message({
                    message:resp.message,
                    type:(resp.flag? 'success' : 'error')
                })
                if(resp.flag){
                    this.activity={};
                    this.fetchData();
                    this.dialogFormVisible=false;
                }
            })
        }else{
            //更新
            activityApi.updateById(this.id,this.activity).then(resp=>{
                this.$message({
                    message:resp.message,
                    type:(resp.flag? 'success' : 'error')
                })
                if(resp.flag){
                    this.id='';
                    this.activity={};
                    this.fetchData();
                    this.dialogFormVisible=false;
                }
            })
        }
      },
      handleDelete(id){
        this.$confirm('确定删除吗？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          activityApi.deleteById(id).then(resp=>{
            this.$message({
              message:resp.message,
              type:(resp.flag? 'success' : 'error')
            })
            if(resp.flag){
              this.fetchData();
            }
          })
        })
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