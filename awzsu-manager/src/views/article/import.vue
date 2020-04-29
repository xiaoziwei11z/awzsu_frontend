<template>
  <div>
    <br>
  ㅤ<el-form :inline="true">
      <el-form-item label="ㅤ将所有文章同步到索引库：">
        <el-button type="primary" @click="handleImport()">导入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import articleApi from '@/api/article/article'
  export default {
    methods:{
      handleImport(){
        articleApi.importIndex().then(resp=>{
          this.$message({
            message:resp.message,
            type:(resp.flag? 'success' : 'error')
          })
        })
      },
    }
  }
</script>