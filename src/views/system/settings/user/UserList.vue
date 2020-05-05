<template>
  <div>
    <div class="handle-box">
      <el-input v-model="searchForm.loginName" placeholder="登录名" class="handle-input mr10"></el-input>
      <el-input v-model="searchForm.userName" placeholder="用户名" class="handle-input mr10"></el-input>
      <el-input v-model="searchForm.mobilePhone" placeholder="手机号码" class="handle-input mr10"></el-input>
      <el-select v-model="searchForm.userStatus" clearable placeholder="用户状态">
        <el-option v-for="item in userStatusList" :key="item.optionValue" :label="item.optionLabel" :value="item.optionValue"></el-option>
      </el-select>
      <el-tooltip class="item" effect="light" content="支持模糊查询" placement="right">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-tooltip>
    </div>
    <div style="margin-top: 20px">
      <el-button type="primary" v-if="true" size="mini" @click="addDialogVisible=true">新增</el-button>
    </div>
    <div>
      <el-table
        ref="listTable" :data="tableData.slice((currentPage-1)*pageSize,pageSize*currentPage)" highlight-current-row
        border height="390" v-loading="loading" @current-change="handleCurrentChange">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column property="id" label="ID"></el-table-column>
        <el-table-column property="loginName" label="登录名"></el-table-column>
        <el-table-column property="userName" label="用户名"></el-table-column>
        <el-table-column property="userGender" label="性别"></el-table-column>
        <el-table-column property="mobilePhone" label="手机号码"></el-table-column>
        <el-table-column property="userMail" label="用户邮箱"></el-table-column>
        <el-table-column property="userStatus" label="用户状态" :formatter="formatStatus"></el-table-column>
        <el-table-column property="orgCode" label="机构码"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="success" @click="viewData(scope.row)">查看</el-button>
            <el-button type="text" size="mini" class="warning" @click="editData(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" class="primary" @click="configRoles(scope.row)">配置角色</el-button>
            <el-button type="text" size="mini" class="danger" @click="deleteData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="新增"
        :visible.sync="addDialogVisible"
        v-if="addDialogVisible"
        width="40%">
        <div>
          <add-user @closeDialog="addDialogVisible=false" @refreshTableData="refreshTableData()"></add-user>
        </div>
      </el-dialog>
      <el-dialog
        title="修改"
        :visible.sync="editDialogVisible"
        v-if="editDialogVisible"
        width="40%">
        <div>
          <edit-user :user="currentRow" @closeDialog="editDialogVisible=false" @refreshTableData="refreshTableData()"></edit-user>
        </div>
      </el-dialog>
      <el-dialog
        title="查看"
        :visible.sync="viewDialogVisible"
        v-if="viewDialogVisible"
        width="40%">
        <div>
          <view-user :user="currentRow" @closeDialog="viewDialogVisible=false"></view-user>
        </div>
      </el-dialog>
      <el-dialog
        title="配置角色"
        :visible.sync="configDialogVisible"
        v-if="configDialogVisible"
        width="50%">
        <div style="text-align: center">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="haveRoles"
            filterable
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :titles="['所有角色', '拥有角色']"
            :button-texts="['到左边', '到右边']"
            :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
            @change="moveChange"
            :props="defaultProps"
            :data="allRoles">
            <span slot-scope="{ option }">{{ option.id }} - {{ option.roleName }}</span>
            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
          </el-transfer>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="configDialogVisible=false">取消修改</el-button>
        <el-button type="primary" @click="doUpdate()">确认修改</el-button>
      </span>
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
import AddUser from './AddUser'
import EditUser from './EditUser'
import ViewUser from './ViewUser'
export default {
  name: 'UserList',
  components: {
    AddUser,
    EditUser,
    ViewUser
  },
  data () {
    return {
      userStatusList: [],
      searchForm: {loginName: '', userName: '', mobilePhone: '', userStatus: ''},
      tableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      viewDialogVisible: false,
      configDialogVisible: false,
      loading: false,
      currentPage: 1,
      pageSize: 5,
      totalSize: 0,
      currentRow: {},
      defaultProps: {
        key: 'id',
        label: 'nameZh'
      },
      // 所有的角色
      allRoles: [],
      // 已有角色的id
      haveRoles: [],
      updateForm: {
        uid: '',
        rids: ''
      }
    }
  },
  mounted () {
    this.initTableListData()
    this.initSelectOptions()
  },
  methods: {
    formatStatus (row, column) {
      let prop = column.property
      let list = this.userStatusList.filter(status => status.optionValue === row.userStatus)
      if (list !== null && list.length > 0) {
        return list[0].optionLabel
      } else {
        return ''
      }
    },
    initSelectOptions () {
      let selectCode = 'SYS_USER_STATUS'
      this.httpPost('/system/option/getOptionsBySelectCode', {selectCode}).then(resp => {
        if (resp.code === 200) {
          this.userStatusList = resp.obj
        }
      })
    },
    // 触发搜索按钮
    handleSearch () {
      // 根据查询条件 模糊查询
      this.initTableListData()
    },
    // 修改
    editData (row) {
      this.currentRow = {...row}
      if (this.currentRow.id) {
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行')
      }
    },
    // 查看
    viewData (row) {
      this.currentRow = row
      if (this.currentRow.id) {
        this.viewDialogVisible = true
      } else {
        this.$message.error('请选择一行')
      }
    },
    // 删除
    deleteData (row) {
      this.currentRow = row
      if (this.currentRow.id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = this.currentRow.id
          this.httpPost('/system/user/deleteUserByUid', {id}).then(resp => {
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
    // 配置角色
    configRoles (row) {
      this.currentRow = row
      if (this.currentRow.id) {
        // 1.查询所有的角色并加载
        this.initAllRoles()
        // 2.查询当前用户已经拥有的角色
        this.initSelectedRoles(this.currentRow.id)
        this.configDialogVisible = true
      } else {
        this.$message.error('请选择一行')
      }
    },
    // 查询所有的角色
    initAllRoles () {
      this.httpPost('/system/role/searchRoleListByCondition', this.searchForm).then(resp => {
        if (resp.code === 200) {
          this.allRoles = resp.obj
        }
      })
    },
    // 根据用户id查询该用户拥有的角色
    initSelectedRoles (id) {
      this.httpPost('/system/userRole/selectRidsByUid', {id}).then(resp => {
        if (resp.code === 200) {
          this.haveRoles = resp.obj
        }
      })
    },
    // 角色左右移动时，触发该方法
    moveChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    // 选择一行数据
    handleCurrentChange (val) {
      // this.currentRow = {...val}
      // console.log('this.currentRow.id:' + this.currentRow.id)
    },
    // 更新用户的角色列表
    doUpdate () {
      // 添加已选择的角色id
      this.updateForm.uid = this.currentRow.id
      this.updateForm.rids = this.haveRoles.toString()
      this.httpPost('/system/userRole/modifyRidsByUid', this.updateForm).then(resp => {
        if (resp.code === 200) {
          this.configDialogVisible = false
        }
      })
    },
    // 初始化用户列表数据
    initTableListData () {
      this.loading = true
      this.httpPost('/system/user/searchUserListByCondition', this.searchForm).then(resp => {
        if (resp.code === 200) {
          this.tableData = resp.obj
          this.totalSize = this.tableData.length
        }
      })
      this.loading = false
    },
    refreshTableData () {
      this.initTableListData()
    },
    handleRowSizeChange (val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentPageChange (val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped>
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
  .handle-input {
    width: 200px;
    display: inline-block;
  }
  .mr10 {
    margin-right: 5px;
  }
</style>
