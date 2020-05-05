<template>
  <!--el-menu的递归子组件，不包含el-menu-->
  <div>
    <template v-for="(item,index) in routes">
      <!-- 一级菜单的情况 start-->
        <!-- index跟浏览器地址对应，这样菜单才能显示选中状态  -->
      <el-menu-item v-if="item.children === null||item.children.length === 0" :index="item.path" :key="index">
        <i v-if="item.meta.iconCls" :class="item.meta.iconCls"></i><!-- 设置icon -->
        <span slot="title">{{item.meta.title}}</span><!-- 菜单名称 -->
      </el-menu-item>
      <!-- 一级菜单的情况 end-->
      <!-- 多级菜单 start-->
      <el-submenu v-else :index="item.meta.title+item.meta.iconCls" :key="index"><!--:index的值必须唯一，此处使用图标+标题来唯一确定-->
        <template slot="title">
          <i v-if="item.meta.iconCls" :class="item.meta.iconCls" style="color: #409eff;margin-right: 5px"></i>
          <span slot="title">{{item.meta.title}}</span>
        </template>
        <sub-menu :routes="item.children"></sub-menu><!--递归自身，加载子菜单-->
      </el-submenu>
      <!-- 多级菜单 end-->
    </template>
  </div>
</template>

<script>
export default {
  name: 'SubMenu',
  props: {
    routes: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
