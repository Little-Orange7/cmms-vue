<template>
  <div class="container" style="width: 600px;">
    <el-input
      placeholder="请输入机构名称进行搜索..."
      prefix-icon="el-icon-search"
      v-model="filterText">
    </el-input>
    <el-tree :data="organs" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{data.orgName }}</span>
        <span>
          <el-button type="success" size="mini" class="orgBtn" @click="viewEditView(data)">查看</el-button>
          <el-button type="primary" size="mini" class="orgBtn" @click="showAddView(data)">添加</el-button>
          <el-button type="warning" size="mini" class="orgBtn" @click="showEditView(data)">修改</el-button>
          <el-button type="danger" size="mini" class="orgBtn" @click="deleteOrgan(data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      title="查看"
      :visible.sync="viewDialogVisible"
      v-if="viewDialogVisible"
      width="50%">
      <view-organ :viewData="editData" @closeDialog="viewDialogVisible = false"></view-organ>
    </el-dialog>
    <el-dialog
      title="新增"
      :visible.sync="addDialogVisible"
      v-if="addDialogVisible"
      width="50%">
      <add-organ :addData="addData" @closeDialog="addDialogVisible = false" @refreshTableData="refreshTableData"></add-organ>
    </el-dialog>
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      v-if="editDialogVisible"
      width="50%">
      <edit-organ :editData="editData" @closeDialog="editDialogVisible = false" @refreshTableData="refreshTableData"></edit-organ>
    </el-dialog>
  </div>
</template>

<script>
import AddOrgan from './AddOrgan'
import EditOrgan from './EditOrgan'
import ViewOrgan from './ViewOrgan'
export default {
  name: 'OrganList',
  components: {
    AddOrgan,
    EditOrgan,
    ViewOrgan
  },
  data () {
    return {
      filterText: '',
      addData: {},
      editData: {},
      organs: [],
      viewDialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      form: {
        parentId: ''
      },
      editForm: {},
      rules: {
        orgName: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.initOrgTree()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    initOrgTree () {
      this.httpGet('/system/org/getAllOrgTree').then(resp => {
        if (resp.code === 200) {
          this.organs = resp.obj
        }
      })
    },
    // 过滤node是否显示
    filterNode (value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    changeSwitch () {
      if (this.switchValue) { // 目录
        this.form.url = '/'
        this.form.folder = true
        this.urlInput = true
      } else { // 菜单
        this.form.url = ''
        this.form.folder = false
        this.urlInput = false
      }
    },
    showAddView (data) {
      this.addData = data
      this.addDialogVisible = true
    },
    // 查看
    viewEditView (data) {
      this.editData = data
      this.viewDialogVisible = true
    },
    // 修改菜单或目录
    showEditView (data) {
      this.editData = {...data}
      this.editDialogVisible = true
    },
    // 删除菜单或目录
    deleteOrgan (data) {
      if (data.parent) {
        this.$message.error('删除失败')
      } else {
        this.$confirm('此操作将永久删除【' + data.orgName + '】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = data.id
          this.httpPost('/system/org/deleteOrgByOid', {id}).then(resp => {
            if (resp.code === 200) {
              this.removeMenuFromMenus(null, this.organs, data.id)
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
    removeMenuFromMenus (p, menus, id) {
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
    },
    refreshTableData () {
      this.initOrgTree()
    }
  }
}
</script>

<style scoped>
  .orgBtn {
    padding: 2px;
  }
  .custom-tree-node {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
