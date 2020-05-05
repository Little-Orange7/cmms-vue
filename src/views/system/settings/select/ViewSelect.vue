<template>
  <div>
    <el-form ref="viewForm" :model="form" label-width="80px">
      <el-form-item label="id">
        <el-input v-model="form.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="选择码">
        <el-input v-model="form.selectCode" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.selectName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.selectRemark" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="form.createUser" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="form.createTime" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="更新人">
        <el-input v-model="form.updateUser" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-input v-model="form.updateTime" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
        <el-button type="primary" @click="onCancel()">返回</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ViewSelect',
  props: {
    select: {}
  },
  data () {
    return {
      form: this.select
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
