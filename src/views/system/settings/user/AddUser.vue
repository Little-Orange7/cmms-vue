<template>
  <div>
    <el-form ref="addForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="登录名" prop="loginName">
        <el-input v-model="form.loginName"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="loginPwd">
        <el-input v-model="form.loginPwd"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="form.userGender"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.mobilePhone"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="userMail">
        <el-input v-model="form.userMail"></el-input>
      </el-form-item>
      <el-form-item label="用户状态" prop="userStatus">
        <el-input v-model="form.userStatus"></el-input>
      </el-form-item>
      <el-form-item label="机构码" prop="orgCode">
        <el-cascader
          ref="tree"
          :options="options"
          :props="defaultProps"
          v-model="form.orgCode"
          node-key="orgCode"
          @change="selectTreeChange()"
          collapse-tags
          clearable></el-cascader>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" @click="onSubmit('addForm')">确认</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'AddUser',
    data() {
      return {
        form: {},
        options: [],
        defaultProps: {
          checkStrictly: true,
          emitPath: false,
          value: 'orgCode',
          label: 'orgName'
        },
        rules: {
          loginName: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          loginPwd: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          userMail: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          userStatus: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          orgCode: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.initSearchTree()
    },
    methods: {
      initSearchTree() {
        this.httpGet('/system/org/getAllOrgTree').then(resp => {
          if (resp.code === 200) {
            this.options = resp.obj
          }
        })
      },
      selectTreeChange() {
        console.log('selectTreeChange=======>this.form.orgCode:' + this.form.orgCode)
      },
      onSubmit(addForm) {
        console.log('onSubmit')
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            this.$confirm('确定继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.httpPost('/system/user/addUser', this.form).then(resp => {
                if (resp.code === 200) {
                  this.$emit('closeDialog')
                  this.$emit('refreshTableData')
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onCancel() {
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style scoped>

</style>
