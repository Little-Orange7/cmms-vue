<template>
  <div class="layout">
    <el-container>
      <el-header class="homeHeader">
        <div class="title">通用管理系统</div>
        <top-header></top-header>
      </el-header>
      <el-container class="content-box">
        <el-aside width="200px">
          <side-menu></side-menu>
        </el-aside>
        <el-container>
          <nav-tabs></nav-tabs>
          <el-main class="content">
            <transition name="move" mode="out-in">
              <router-view class="homeRouterView"></router-view>
            </transition>
          </el-main>
          <el-footer style="height: 40px">版权所有</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopHeader from './TopHeader'
import SideMenu from './SideMenu'
import NavTabs from './NavTabs'
export default {
  name: 'Layout',
  components: {
    TopHeader,
    SideMenu,
    NavTabs
  },
  data () {
    return {
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 2
    }
  }
}
</script>

<style scoped>
  .content {
    border: 1px solid #eee;
    padding: 20px;
  }
  .layout {
  }
  .content-box {
    height: 670px;
    border: 1px solid #eeeeee;
  }
  .homeRouterView {
    margin-top: 1px;
  }
  .homeHeader {
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px;
    box-sizing: border-box;
  }
  .homeHeader .title {
    font-size: 30px;
    font-family: 华文行楷;
    color: #ffffff
  }

</style>
