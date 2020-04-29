<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="ㅤ用户名">
        <el-input v-model="searchMap.phone" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="searchMap.roleid" placeholder="角色">
          <el-option label="全部" value=""></el-option>
          <el-option label="普通用户" value="1"></el-option>
          <el-option label="管理员" value="2"></el-option>
          <el-option label="超级管理员" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
      <el-button type="primary" @click="handleAdd()">创建管理员账户</el-button>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="phone"
        label="用户名"
        width="400">
      </el-table-column>
      <el-table-column
        :formatter="roleFormat"
        :show-overflow-tooltip="true"
        prop="roleid"
        label="角色"
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
      title="创建管理员账户"
      :visible.sync="dialogFormVisible"
      center
      width="50%" >
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="pojo.phone" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="pojo.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button @click="dialogFormVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import userApi from '@/api/user/user'
  export default {
    data() {
      return {
        tableData: [],
        total:0,
        currentPage:1,
        pageSize:10,
        searchMap:{},
        dialogFormVisible:false,
        pojo:{},
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
      fetchData(){
        userApi.search(this.currentPage,this.pageSize,this.searchMap).then(resp=>{
          this.tableData=resp.data.rows;
          this.total=resp.data.total;
        })
      },
      handleAdd(){
          this.pojo={};
          this.dialogFormVisible=true;
      },
      handleSubmit(){
        //新增
        userApi.saveAdmin(this.pojo).then(resp=>{
            this.$message({
                message:resp.message,
                type:(resp.flag? 'success' : 'error')
            })
            if(resp.flag){
                this.pojo={};
                this.fetchData();
                this.dialogFormVisible=false;
            }
        })
      },
      handleDelete(id){
        this.$confirm('确定删除吗？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          userApi.deleteById(id).then(resp=>{
            this.$message({
              message:resp.message,
              type:(resp.flag? 'success' : 'error')
            })
            if(resp.flag){
              this.fetchData();
            }
          })
        })
      },
      createtimeFormat(row,column){
        var t=new Date(row.createtime);//row 表示一行数据, createTime 表示要格式化的字段名称
        return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
      },
      updatetimeFormat(row,column){
        var t=new Date(row.updatetime);//row 表示一行数据, updateTime 表示要格式化的字段名称
        return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
      },
      roleFormat(row,column){
        if(row.roleid==='3'){
          return '超级管理员';
        }else if(row.roleid==='2'){
          return '管理员';
        }else{
          return '普通用户';
        }
      },
    }
  }
</script>