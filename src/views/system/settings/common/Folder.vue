<template>
  <!--为嵌套子路由组件提供视图出口，渲染子组件-->
  <keep-alive :include="keepAlive">
    <router-view></router-view>
  </keep-alive>
</template>

<script>
export default {
  name: 'Folder',
  data () {
    return {
    }
  },
  computed: {
    keepAlive () {
      return this.$store.state.keepAliveComps
    }
  }
}
</script>

<style scoped>

</style>
