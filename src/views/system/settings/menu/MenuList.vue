<template>
  <div class="container" style="width: 600px;">
    <el-input
      placeholder="请输入菜单名称进行搜索..."
      prefix-icon="el-icon-search"
      v-model="filterText">
    </el-input>
    <el-tree :data="menus" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode"
             ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i v-if="data.folder" class="el-icon-folder"></i>
          <i v-else class="el-icon-document"></i>
          {{data.meta.title }}
        </span>
        <span>
          <el-button type="success" size="mini" class="menuBtn" @click="viewEditView(data)">查看</el-button>
          <el-button :disabled="!data.folder" type="primary" size="mini" class="menuBtn" @click="showAddView(data)">添加
          </el-button>
          <el-button type="warning" size="mini" class="menuBtn" @click="showEditView(data)">修改</el-button>
          <el-button type="danger" size="mini" class="menuBtn" @click="deleteMenu(data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      title="查看"
      :visible.sync="viewDialogVisible"
      v-if="viewDialogVisible"
      width="50%">
      <view-menu :viewData="editData" @closeDialog="viewDialogVisible = false"></view-menu>
    </el-dialog>
    <el-dialog
      title="新增"
      :visible.sync="addDialogVisible"
      v-if="addDialogVisible"
      width="50%">
      <add-menu :addData="addData" @closeDialog="addDialogVisible = false"
                @refreshTableData="refreshTableData"></add-menu>
    </el-dialog>
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      v-if="editDialogVisible"
      width="50%">
      <edit-menu :editData="editData" @closeDialog="editDialogVisible = false"
                 @refreshTableData="refreshTableData"></edit-menu>
    </el-dialog>
  </div>
</template>

<script>
  import AddMenu from './AddMenu'
  import EditMenu from './EditMenu'
  import ViewMenu from './ViewMenu'

  export default {
    name: 'MenuList',
    components: {
      AddMenu,
      EditMenu,
      ViewMenu
    },
    data() {
      return {
        viewDialogVisible: false,
        addDialogVisible: false,
        editDialogVisible: false,
        filterText: '',
        addData: {},
        editData: {},
        menus: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    mounted() {
      this.initMenus()// 从后台查询菜单信息
    },
    methods: {
      // 过滤node是否显示
      filterNode(value, data) {
        if (!value) return true
        return data.meta.title.indexOf(value) !== -1
      },
      // 修改菜单或目录
      viewEditView(data) {
        this.editData = data
        this.viewDialogVisible = true
      },
      // 显示添加菜单对话框
      showAddView(data) {
        // 如果为子文件夹，则可以新增，如果为子菜单，则不能新增
        if (data.folder) {
          this.addDialogVisible = true
          this.addData = data
        } else {
          this.$message.error('非文件夹，不能新增子菜单')
        }
      },
      // 修改菜单或目录
      showEditView(data) {
        this.editData = data
        this.editDialogVisible = true
      },
      // 删除菜单或目录
      deleteMenu(data) {
        if (data.parent) {
          this.$message.error('删除失败')
        } else {
          this.$confirm('此操作将永久删除【' + data.meta.title + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let id = data.id
            this.httpPost('/system/menu/deleteMenuByMid', {id}).then(resp => {
              if (resp.code === 200) {
                this.removeMenuFromMenus(null, this.menus, data.id)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      initMenus() {
        this.httpGet('/system/menu/getAllMenuTree').then(resp => {
          if (resp.code === 200) {
            this.menus = resp.obj
          }
        })
      },
      // 刷新
      refreshTableData() {
        this.initMenus()
      },
      removeMenuFromMenus(p, menus, id) {
        for (let i = 0; i < menus.length; i++) {
          let d = menus[i]
          if (d.id === id) {
            menus.splice(i, 1)
            if (menus.length === 0) {
              p.parent = false
            }
            return
          } else {
            this.removeMenuFromMenus(d, d.children, id)
          }
        }
      }
    }
  }
</script>

<style scoped>
  .menuBtn {
    padding: 2px;
  }

  .custom-tree-node {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .tree-node-icon {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
