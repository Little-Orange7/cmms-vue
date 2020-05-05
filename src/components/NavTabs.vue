<template>
  <el-tabs class="el-tabs" v-model="currentTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="showCurrentTab">
    <el-tab-pane v-for="item in tabsList" :key="item.path" :label="item.title" :name="item.path"/>
  </el-tabs>
</template>

<script>

export default {
  name: 'NavTabs',
  data () {
    return {
      mediList: [],
      currentTabsValue: '/Layout/Dashboard',
      tabsList: [{
        title: '首页',
        path: '/Layout/Dashboard',
        name: 'Dashboard',
        keepAlive: false
      }],
      dashboard: '/Layout/Dashboard'
    }
  },
  watch: {
    // 监听路由对象的变化
    $route (to, from) {
      this.setTabs(to)
    },
    // 监听打开的tabs，来动态跳转缓存页面
    tabsList (newVal, oldVal) {
      let vals = newVal
      this.mediList = []// 每次都要重置为空
      vals.forEach(val => {
        if (val.keepAlive) { // 打开的tab且设置为缓存页的才会缓存
          this.mediList.push(val.name)// 放入打开的tab的name
        }
      })
      this.$store.commit('SET_KEEPALIVE', this.mediList)
    }
  },
  methods: {
    // 跳转当前点击的tab
    showCurrentTab (tab) {
      if (tab.name !== this.$route.fullPath) {
        this.$router.push(tab.name)
      }
    },
    // 当前页面要和当前路由保持一致
    setTabs (route) {
      const isExist = this.tabsList.some(item => {
        return item.path === route.fullPath
      })
      if (!isExist) {
        this.tabsList.push({
          title: route.meta.title,
          path: route.fullPath,
          name: route.name,
          keepAlive: route.meta.keepAlive
        })
      }
      this.currentTabsValue = route.fullPath
    },
    // 关闭tab
    removeTab (targetName) {
      let tabs = this.tabsList
      let activeName = this.currentTabsValue
      // 如果关闭的是当前的tab，则关闭之后显示当前的前一个或者后一个tab
      if (activeName === targetName && targetName !== this.dashboard) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.path
            }
          }
        })
      }
      this.currentTabsValue = activeName
      // 关闭的不是当前页，不需要跳转路由
      if (activeName === targetName || activeName === this.dashboard) {
        this.$router.push(this.currentTabsValue)
      } else if (activeName !== targetName) {
        this.$router.push(this.currentTabsValue)
      }
      // 首页不能关闭
      if (targetName !== this.dashboard) {
        this.tabsList = tabs.filter(tab => tab.path !== targetName)
      }
    }
  }
}
</script>

<style scoped>
  .el-tabs{
    height: 40px;
    border: 1px solid #eee
  }
</style>
