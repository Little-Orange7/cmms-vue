<template>
  <div>
    <el-form ref="addForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="选择码">
        <el-input v-model="form.selectCode"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.selectName"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.selectRemark"></el-input>
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
    name: 'AddSelect',
    data() {
      return {
        form: {},
        rules: {
          selectCode: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          selectName: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 提交
      onSubmit(addForm) {
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            this.$confirm('确定继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.httpPost('/system/select/addSelect', this.form).then(resp => {
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
      // 取消
      onCancel() {
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style scoped>

</style>
