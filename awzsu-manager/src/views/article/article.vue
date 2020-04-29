<template>
  <div>
    <br>
  ㅤ<el-form :inline="true">
    <el-form-item label="ㅤ文章标题">
      <el-input v-model="searchMap.title" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item label="所属标签">
        <el-select v-model="searchMap.labelid" placeholder="所属标签">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="label in labelList"
            :key="label.id"
            :label="label.labelname"
            :value="label.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否审核">
        <el-select v-model="searchMap.state" placeholder="是否审核">
          <el-option label="全部" value=""></el-option>
          <el-option label="已拒绝" value="0"></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="已审核" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="title"
        label="文章标题"
        width="350">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="labelname"
        label="所属标签"
        width="180">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="userid"
        label="用户id"
        width="180">
      </el-table-column>
      <el-table-column
         :formatter="createtimeFormat"
        :show-overflow-tooltip="true"
        prop="createtime"
        label="创建时间"
        width="180">
      </el-table-column>
      <el-table-column
         :formatter="updatetimeFormat"
        :show-overflow-tooltip="true"
        prop="updatetime"
        label="更新时间"
        width="180">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="visits"
        label="浏览量"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="thumbups"
        label="点赞数"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="comments"
        label="评论数"
        width="100">
      </el-table-column>
      <el-table-column
        :formatter="stateFormat"
        :show-overflow-tooltip="true"
        prop="state"
        label="审核状态"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="115">
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row.id)" type="text" size="small">查看</el-button>
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
      title="文章详情"
      :visible.sync="dialogFormVisible"
      center
      fullscreen
      width="70%" >
      <el-scrollbar style="height:100%">
        {{article.title}}
        <hr>
        <div v-html='article.content'></div>     
        <div v-if="article.state == '1'">  
          <el-button type="primary" @click="handleExamine('2')">审核通过</el-button>
          <el-button type="primary" @click="handleExamine('0')">审核拒绝</el-button>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
  import articleApi from '@/api/article/article'
  import labelApi from '@/api/label/label'
  export default {
    data() {
      return {
        tableData: [],
        total:0,
        currentPage:1,
        pageSize:10,
        searchMap:{},
        labelList:[],
        dialogFormVisible:false,
        article:{}
      }
    },
    created(){
      this.getLabelList();
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
      getLabelList(){
        labelApi.findAll().then(resp=>{
          this.labelList=resp.data;
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
      stateFormat(row,column){
        if(row.state==='2'){
          return '已审核';
        }else if(row.state==='1'){
          return '待审核';
        }else{
          return '已拒绝';
        }
      },
      fetchData(){
        articleApi.search(this.currentPage,this.pageSize,this.searchMap).then(resp=>{
          this.tableData=resp.data.rows;
          this.total=resp.data.total;
        })
      },
      handleDetail(id){
        articleApi.findById(id).then(resp=>{
          if(resp.flag){
            this.article=resp.data;
            this.dialogFormVisible=true;
          }
        })
      },
      handleExamine(state){
        articleApi.examine(this.article.id,state).then(resp=>{
          this.$message({
            message:resp.message,
            type:(resp.flag? 'success' : 'error')
          })
          if(resp.flag){
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
          articleApi.deleteById(id).then(resp=>{
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