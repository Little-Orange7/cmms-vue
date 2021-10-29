<template>
  <div>
    <div style="margin-top: 5px">
      <el-button type="primary" v-if="true" size="mini" @click="addDialogVisible=true">新增</el-button>
    </div>
    <div>
      <el-table
        ref="listTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" highlight-current-row
        border height="390" v-loading="loading" @current-change="handleCurrentChange">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="optionValue" label="选项值"></el-table-column>
        <el-table-column prop="optionKey" label="顺序"></el-table-column>
        <el-table-column prop="optionLabel" label="名称"></el-table-column>
        <el-table-column prop="optionRemark" label="备注"></el-table-column>
        <el-table-column prop="createUser" label="创建人" v-if="false"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" v-if="false"></el-table-column>
        <el-table-column prop="updateUser" label="更新人" v-if="false"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" v-if="false"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="success" @click="viewData(scope.row)">查看</el-button>
            <el-button type="text" size="mini" class="warning" @click="editData(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" class="danger" @click="deleteData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="新增"
        :visible.sync="addDialogVisible"
        v-if="addDialogVisible"
        width="40%"
        append-to-body>
        <div>
          <add-option :select="select" @closeDialog="addDialogVisible=false"
                      @refreshTableData="refreshTableData()"></add-option>
        </div>
      </el-dialog>
      <el-dialog
        title="修改"
        :visible.sync="editDialogVisible"
        v-if="editDialogVisible"
        width="40%"
        append-to-body>
        <div>
          <edit-option :option="currentRow" @closeDialog="editDialogVisible=false"
                       @refreshTableData="refreshTableData()"></edit-option>
        </div>
      </el-dialog>
      <el-dialog
        title="查看"
        :visible.sync="viewDialogVisible"
        v-if="viewDialogVisible"
        width="40%"
        append-to-body>
        <div>
          <view-option :select="currentRow" @closeDialog="viewDialogVisible=false"></view-option>
        </div>
      </el-dialog>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleRowSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        :total="totalSize"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import AddOption from './AddOption'
  import EditOption from './EditOption'
  import ViewOption from './ViewOption'

  export default {
    name: 'OptionList',
    components: {
      AddOption,
      EditOption,
      ViewOption
    },
    props: {
      select: {}
    },
    data() {
      return {
        tableData: [],
        addDialogVisible: false,
        editDialogVisible: false,
        viewDialogVisible: false,
        configDialogVisible: false,
        loading: false,
        currentRow: {},
        currentPage: 1,
        pageSize: 5,
        totalSize: 0,
        // tree严格的遵循父子不互相关联
        checkStrictly: true,
        expandAll: true,
        selectedMenus: [],
        selectedKeys: [],
        allMenus: [],
        addMenu: {rid: '', mid: ''}
      }
    },
    mounted() {
      this.initTableListData()
    },
    methods: {
      // 过滤node是否显示
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 触发搜索按钮
      handleSearch() {
        this.initTableListData()
      },
      // 修改
      editData(row) {
        this.currentRow = {...row}
        console.log('editData=====>this.role.id:' + this.currentRow.id)
        if (this.currentRow.id) {
          this.editDialogVisible = true
        } else {
          this.$message.error('请选择一行')
        }
      },
      // 查看
      viewData(row) {
        this.currentRow = row
        console.log('viewData=====>this.currentRow.id:' + this.currentRow.id)
        if (this.currentRow.id) {
          this.viewDialogVisible = true
        } else {
          this.$message.error('请选择一行')
        }
      },
      deleteData(row) {
        this.currentRow = row
        if (this.currentRow.id) {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let id = this.currentRow.id
            this.httpPost('/system/option/delectOptionByOptionId', {id}).then(resp => {
              if (resp.code === 200) {
                this.refreshTableData()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.$message.error('请选择一行')
        }
      },
      // 查询所有的菜单
      initAllMenus() {
        this.httpGet('/system/menu/getAllMenuTree').then(resp => {
          if (resp.code === 200) {
            this.allMenus = resp.obj
          }
        })
      },
      // 根据rid查询该role已拥有的菜单id
      initSelectedMenus(rid) {
        this.httpPost('/system/roleMenu/selectMidsByRid', {rid}).then(resp => {
          if (resp.code === 200) {
            this.selectedMenus = resp.obj
          }
        })
      },
      // 更新role拥有的菜单权限
      doUpdate() {
        this.selectedKeys = this.$refs.tree.getCheckedKeys()
        this.addMenu.rid = this.currentRow.id
        this.addMenu.mid = this.selectedKeys.toString()
        this.httpPost('/system/roleMenu/modifyMidsByRid', this.addMenu).then(resp => {
          if (resp.code === 200) {
            this.configDialogVisible = false
          }
        })
      },
      // 初始化列表数据
      initTableListData() {
        this.loading = true
        this.httpPost('/system/option/getOptionsBySelectCode', this.select).then(resp => {
          if (resp.code === 200) {
            this.tableData = resp.obj
            this.totalSize = this.tableData.length
          }
        })
        this.loading = false
      },
      // 数据变动之后，重新请求查询数据，刷新表数据
      refreshTableData() {
        this.initTableListData()
      },
      handleRowSizeChange(val) {
        this.pageSize = val
        console.log(`每页 ${val} 条`)
      },
      handleCurrentPageChange(val) {
        this.currentPage = val
        console.log(`当前页: ${val}`)
      },
      handleCurrentChange(val) {
        console.log('val:' + val)
      }
    }
  }
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 200px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 5px;
  }
</style>
