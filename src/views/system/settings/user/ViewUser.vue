<template>
  <div>
    <el-form ref="viewForm" :model="form" label-width="80px">
      <el-form-item label="登录名">
        <el-input v-model="form.loginName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.userName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="form.userGender" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.mobilePhone" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱">
        <el-input v-model="form.userMail" :disabled="true"></el-input>
      </el-form-item>
      <!--<el-form-item label="用户状态">
        <el-input v-model="form.userStatus"></el-input>
      </el-form-item>-->
      <el-form-item label="机构码">
        <el-input v-model="form.orgCode" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
        <el-button @click="onCancel()">返回</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ViewUser',
  props: {
    user: {}
  },
  data () {
    return {
      form: this.user
    }
  },
  mounted () {
    // 可根据userId请求后台查询角色信息并加载到form
  },
  methods: {
    // 返回
    onCancel () {
      console.log('onCancel')
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
