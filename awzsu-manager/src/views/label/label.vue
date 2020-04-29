<template>
  <div>
    <br>
    <!--空白字符ㅤ-->
    ㅤ<el-button type="primary" @click="handleAdd()">新增标签</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="labelname"
        label="标签名称"
        width="400">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="fans"
        label="粉丝数"
        width="400">
      </el-table-column>
      <el-table-column
         :formatter="createtimeFormat"
        :show-overflow-tooltip="true"
        prop="createtime"
        label="创建时间"
        width="400">
      </el-table-column>
      <el-table-column
         :formatter="updatetimeFormat"
        :show-overflow-tooltip="true"
        prop="updatetime"
        label="更新时间"
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
      title="标签详情"
      :visible.sync="dialogFormVisible"
      center
      width="50%" >
      <el-scrollbar style="height:100%">
        <el-form label-width="80px">
            <el-form-item label="标签名称">
                <el-input v-model="label.labelname" placeholder="标签名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
                <el-button @click="dialogFormVisible = false">关闭</el-button>
            </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
  import labelApi from '@/api/label/label'
  export default {
    data() {
      return {
        tableData: [],
        total:0,
        currentPage:1,
        pageSize:10,
        dialogFormVisible:false,
        label:{},
        id:''
      }
    },
    created(){
      this.fetchData();
    },
    methods:{
      sizeChange(val){
        this.pageSize=val;
        this.currentPage=1;
        this.fetchData();
      },
      pageChange(val){
        this.currentPage=val;
        this.fetchData();
      },
      createtimeFormat(row,column){
        var t=new Date(row.createtime);//row 表示一行数据, createTime 表示要格式化的字段名称
        return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
      },
      updatetimeFormat(row,column){
        var t=new Date(row.updatetime);//row 表示一行数据, updateTime 表示要格式化的字段名称
        return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
      },
      fetchData(){
        labelApi.search(this.currentPage,this.pageSize).then(resp=>{
          this.tableData=resp.data.rows;
          this.total=resp.data.total;
        })
      },
      handleAdd(){
          this.label={};
          this.id='';
          this.dialogFormVisible=true;
      },
      handleDetail(id){
        labelApi.findById(id).then(resp=>{
          if(resp.flag){
            this.id=id;
            this.label=resp.data;
            this.dialogFormVisible=true;
          }
        })
      },
      handleSubmit(){
        if(this.id===''){
            //新增
            labelApi.save(this.label).then(resp=>{
                this.$message({
                    message:resp.message,
                    type:(resp.flag? 'success' : 'error')
                })
                if(resp.flag){
                    this.label={};
                    this.fetchData();
                    this.dialogFormVisible=false;
                }
            })
        }else{
            //更新
            labelApi.updateById(this.id,this.label).then(resp=>{
                this.$message({
                    message:resp.message,
                    type:(resp.flag? 'success' : 'error')
                })
                if(resp.flag){
                    this.id='';
                    this.label={};
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
          labelApi.deleteById(id).then(resp=>{
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