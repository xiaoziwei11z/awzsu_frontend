<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{name}}</div>
  </div>
</template>

<script>
import { getUser } from '@/utils/auth'

export default {
  data(){
    return {
      name:"",
    }
  },
  created(){
    this.name=getUser().name
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
