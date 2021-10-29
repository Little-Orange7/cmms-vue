<template>
  <div>
    <span>上一层级:{{addData.orgName}}</span>
    <div>
      <el-form :model="form" :rules="rules" ref="addForm" label-width="120px">
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="form.orgName" placeholder="机构名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="机构码" prop="orgCode">
          <el-input v-model="form.orgCode" placeholder="机构码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="机构负责人">
          <el-input v-model="form.orgPrincipal" placeholder="机构负责人" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门电话">
          <el-input v-model="form.orgPhone" placeholder="部门电话" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门地址">
          <el-input v-model="form.orgAddress" placeholder="部门地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门介绍">
          <el-input v-model="form.orgRemark" placeholder="部门介绍" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="机构状态" prop="orgStatus">
          <el-switch v-model="form.orgStatus"></el-switch>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit('addForm')">确 定</el-button>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AddOrgan',
    props: {
      addData: {}
    },
    data() {
      return {
        form: {},
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
      onSubmit(addForm) {
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            this.$confirm('确定继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.httpPost('/system/org/addOrg', this.form).then(resp => {
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
