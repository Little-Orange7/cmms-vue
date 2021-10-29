<template>
  <div>
    <div class="loginContainer">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" v-loading="loading" element-loading-text="正在登录..."
               element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
               class="ms-content">
        <h3 class="loginTitle">系统登录</h3>
        <el-form-item prop="loginName">
          <el-input size="normal" type="text" v-model="loginForm.loginName" auto-complete="off" placeholder="请输入用户名">
            <el-button slot="prepend" icon="el-icon-lx-people">用户</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="loginPwd">
          <el-input size="normal" type="password" v-model="loginForm.loginPwd" auto-complete="off" placeholder="请输入密码">
            <el-button slot="prepend" icon="el-icon-lx-lock">密码</el-button>
          </el-input>
        </el-form-item>
        <el-checkbox size="normal" class="loginRemember" v-model="checked">记住用户名和密码</el-checkbox>
        <el-button size="normal" type="primary" style="width: 100%;" @click="submitLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        loading: false,
        loginForm: {
          loginName: 'admin',
          loginPwd: '123',
          code: ''
        },
        checked: true,
        rules: {
          loginName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          loginPwd: [{required: true, message: '请输入密码', trigger: 'blur'}]
        }
      }
    },
    mounted() {
      var _this = this
      // 回车监听事件，不依赖焦点是否在组件上；@keydown.enter.native="submitLogin"需要焦点在组件上时，回车才能出发
      document.onkeydown = function (e) {
        var key = window.event.keyCode
        if (key === 13) {
          _this.submitLogin()
        }
      }
    },
    methods: {
      submitLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true
            this.httpPost('/system/common/doLogin', this.loginForm).then(resp => {
              this.loading = false
              if (resp.code === 200) {
                this.$store.commit('INIT_USER', resp.obj)
                window.sessionStorage.setItem('user', JSON.stringify(resp.obj))
                this.$router.replace('/Layout/Dashboard')
              }
              this.loading = false
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .ms-content {
    padding: 30px 30px;
  }

  .loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .loginTitle {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
  }

  .loginRemember {
    text-align: left;
    margin: 0px 0px 15px 0px;
  }

</style>
