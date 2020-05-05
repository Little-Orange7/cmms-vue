<template>
  <div class="layoutHeader">
    <el-dropdown trigger="click" @command="logoutCommand">
      <span>{{user.userName}}
        <i class="el-icon-setting" style="margin-right: 15px"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        <el-dropdown-item command="modifyPwd">修改密码</el-dropdown-item>
        <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="个人中心"
      :visible.sync="userInforDialogVisible"
      v-if="userInforDialogVisible"
      width="40%">
      <div>
        <el-form ref="userForm" :model="user" :rules="rules" label-width="80px">
          <el-form-item label="登录名" prop="loginName">
            <el-input v-model="user.loginName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="user.userName"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="user.userGender"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="user.mobilePhone"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="userMail">
            <el-input v-model="user.userMail"></el-input>
          </el-form-item>
          <!--<el-form-item label="用户状态" prop="userStatus">
            <el-input v-model="user.userStatus" :disabled="true"></el-input>
          </el-form-item>-->
          <el-form-item label="机构码" prop="orgCode">
            <el-input v-model="user.orgCode" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="userInfoOnCancel()">关闭</el-button>
          <el-button type="primary" @click="userInfoOnSubmit('userForm')">修改</el-button>
        </span>
      </div>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="pwdDialogVisible"
      v-if="pwdDialogVisible"
      width="40%">
      <div>
        <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="100px">
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="pwdForm.oldPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="pwdForm.newPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="reNewPwd">
            <el-input v-model="pwdForm.reNewPwd" type="password"></el-input>
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="pwdOnCancel()">关闭</el-button>
          <el-button type="primary" @click="pwdOnSubmit('pwdForm')">修改</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'TopHeader',
  data () {
    return {
      userInforDialogVisible: false,
      pwdDialogVisible: false,
      pwdForm: {},
      rules: {
        loginName: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        loginPwd: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        userMail: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        userStatus: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ]
      },
      pwdRules: {
        oldPwd: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        reNewPwd: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    // 退出登录
    logoutCommand (command) {
      console.log('command:' + command)
      if (command === 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.httpPost('/system/common/doLogout')
          window.sessionStorage.removeItem('user')
          this.$store.commit('INIT_ROUTES', [])
          this.$router.replace('/Login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else if (command === 'userInfo') {
        this.userInforDialogVisible = true
      } else if (command === 'modifyPwd') {
        this.pwdDialogVisible = true
      }
    },
    userInfoOnCancel () {
      this.userInforDialogVisible = false
    },
    // 修改用户信息
    userInfoOnSubmit (userForm) {
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          this.$confirm('确定继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.httpPost('/system/user/addUser', this.form).then(resp => {
              if (resp.code === 200) {
                this.userInforDialogVisible = false
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
    pwdOnCancel () {
      this.pwdDialogVisible = false
    },
    // 修改密码
    pwdOnSubmit (pwdForm) {
      this.$refs[pwdForm].validate((valid) => {
        if (valid) {
          this.$confirm('确定继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.pwdForm.loginName = this.user.loginName
            this.httpPost('/system/common/modifyPwd', this.pwdForm).then(resp => {
              if (resp.code === 200) {
                this.pwdDialogVisible = false
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
    }
  }
}
</script>

<style scoped>
  .layoutHeader {
    background-color: #409eff;
    display: flex;
  }

</style>
