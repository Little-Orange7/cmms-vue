<template>
  <div>
    <el-form ref="editForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="选项值">
        <el-input v-model="form.optionValue"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.optionLabel"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.optionRemark"></el-input>
      </el-form-item>
      <el-form-item label="顺序">
        <el-input v-model="form.optionKey"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" @click="onSubmit('editForm')">确认</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'EditOption',
    props: {
      option: {}
    },
    data() {
      return {
        form: this.option,
        rules: {
          selectCode: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          optionLabel: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      // 可根据roleId请求后台查询角色信息并加载到form
    },
    methods: {
      // 提交
      onSubmit(editForm) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            this.$confirm('确定继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.httpPost('/system/option/editOption', this.form).then(resp => {
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
