<template>
  <div>
    <div class="handle-box">
      <el-cascader
        ref="tree"
        :options="options"
        :props="defaultProps"
        v-model="selectedKeys"
        node-key="orgCode"
        @change="selectTreeChange()"
        collapse-tags
        clearable></el-cascader>
      <el-tooltip class="item" effect="light" content="支持模糊查询" placement="right">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-tooltip>
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
      </el-table>
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

  export default {
    name: 'OrganUser',
    data() {
      return {
        userStatusList: [],
        searchForm: {id: '', name: '', code: ''},
        oids: '',
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
        options: [],
        defaultProps: {
          multiple: true,
          checkStrictly: true,
          emitPath: false,
          value: 'orgCode',
          label: 'orgName'
        },
        expandAll: true,
        selectedKeys: []
      }
    },
    mounted() {
      this.initTableListData()
      this.initSearchTree()
      this.initSelectOptions()
    },
    methods: {
      formatStatus(row, column) {
        let prop = column.property
        console.log('prop:' + prop + ',this.userStatusList:' + this.userStatusList)
        let list = this.userStatusList.filter(status => status.optionValue === row.userStatus)
        if (list !== null && list.length > 0) {
          return list[0].optionLabel
        } else {
          return ''
        }
      },
      initSelectOptions() {
        let selectCode = 'SYS_USER_STATUS'
        this.httpPost('/system/option/getOptionsBySelectCode', {selectCode}).then(resp => {
          if (resp.code === 200) {
            this.userStatusList = resp.obj
          }
        })
      },
      initSearchTree() {
        this.httpGet('/system/org/getAllOrgTree').then(resp => {
          if (resp.code === 200) {
            this.options = resp.obj
          }
        })
      },
      initTableListData() {
        let oids = this.selectedKeys.toString()
        this.httpPost('/system/orgUser/searchUserListByOids', {oids}).then(resp => {
          if (resp.code === 200) {
            this.tableData = resp.obj
          }
        })
      },
      selectTreeChange() {
        console.log('selectTreeChange=======>selectedKeys:' + this.selectedKeys)
      },
      // 触发搜索按钮
      handleSearch() {
        this.initTableListData()
        console.log('handleSearch')
      },
      handleCurrentChange(val) {
        console.log('val:' + val)
        this.currentRow = {...val}
        console.log('this.currentRow.id:' + this.currentRow.id)
      },
      handleRowSizeChange(val) {
        this.pageSize = val
        console.log(`每页 ${val} 条`)
      },
      handleCurrentPageChange(val) {
        this.currentPage = val
        console.log(`当前页: ${val}`)
      }
    }
  }
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-input {
    width: 200px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 5px;
  }
</style>
