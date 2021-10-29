<template>
  <div>
    <el-form ref="addForm" :model="form" :rules="rules" label-width="80px">
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
        <el-button type="primary" @click="onSubmit('addForm')">确认</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'AddOption',
    props: {
      select: {}
    },
    data() {
      return {
        form: {
          selectId: this.select.id
        },
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
              this.httpPost('/system/option/addOption', this.form).then(resp => {
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
