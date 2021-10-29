<template>
  <div>
    <span>上一层级:{{viewData.orgName}}</span>
    <div>
      <el-form :model="form" :rules="rules" ref="viewForm" label-width="120px">
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="form.orgName" :disabled="true" placeholder="机构名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="机构码" prop="orgCode">
          <el-input v-model="form.orgCode" :disabled="true" placeholder="机构码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="机构负责人">
          <el-input v-model="form.orgPrincipal" :disabled="true" placeholder="机构负责人" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门电话">
          <el-input v-model="form.orgPhone" :disabled="true" placeholder="部门电话" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门地址">
          <el-input v-model="form.orgAddress" :disabled="true" placeholder="部门地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门介绍">
          <el-input v-model="form.orgRemark" :disabled="true" placeholder="部门介绍" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="机构状态" prop="orgStatus">
          <el-switch v-model="form.orgStatus" :disabled="true"></el-switch>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button type="primary" @click="onCancel">返回</el-button>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ViewOrgan',
    props: {
      viewData: {}
    },
    data() {
      return {
        form: this.viewData,
        rules: {
          orgName: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          orgCode: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 取消
      onCancel() {
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style scoped>

</style>
