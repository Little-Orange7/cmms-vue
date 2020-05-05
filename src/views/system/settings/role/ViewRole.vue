<template>
  <div>
    <el-form ref="viewForm" :model="form" label-width="80px">
      <el-form-item label="角色码">
        <el-input v-model="form.roleCode" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
        <el-button type="primary" @click="onCancel()">返回</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ViewRole',
  props: {
    role: {}
  },
  data () {
    return {
      form: this.role
    }
  },
  mounted () {
  },
  methods: {
    // 取消
    onCancel () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
