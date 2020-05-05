<template>
  <div>
    <!-- 遍历路由表，生成左侧菜单 -->
    <el-menu router unique-opened @select="pushTabMsg" :default-active="activeKey">
      <!--因为递归的组件中如果包含el-menu，则子目录不会缩进显示，所以为了保证只有一个el-menu，只把子组件作为递归组件单独抽离出来-->
      <sub-menu :routes="routes"></sub-menu>
    </el-menu>
  </div>
</template>
<script>
import SubMenu from './SubMenu'
export default {
  name: 'SideMeun',
  components: {
    SubMenu
  },
  data () {
    return {
      activeKey: ''
    }
  },
  computed: {
    routes () {
      return this.$store.state.routes
    }
  },
  watch: {
    // 监听当前路由对象的变化
    $route (to, from) {
      this.activeCurrentMenu(to)
    }
  },
  methods: {
    // 根据当前路由路径来激活当前侧边的菜单
    activeCurrentMenu (route) {
      this.activeKey = route.fullPath
    },
    pushTabMsg (key, keyPath) {
      console.log('key, keyPath:' + key, keyPath)
    }
  }
}
</script>

<style scoped>

</style>
