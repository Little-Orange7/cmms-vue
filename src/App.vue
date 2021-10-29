<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'App'
  }
</script>

<style>
  /*.el-header{
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }*/
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    line-height: 200px;
  }

  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 40px;
  }

  .el-main {
    /*background-color: #E9EEF3;*/
    /*color: #333;*/
    /*text-align: center;*/
    /*line-height: 160px;*/
  }

  .el-container {
    margin-bottom: 1px;
  }

  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .primary {
    color: #409EFF;
  }

  .success {
    color: #67C23A;
  }

  .warning {
    color: #E6A23C;
  }

  .danger {
    color: #F56C6C;
  }
</style>
