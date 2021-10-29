<template>
  <div>
    <div>
      <el-switch v-model="switchValue" active-text="目录" inactive-text="菜单" @change='changeSwitch'></el-switch>
    </div>
    <span>上一层级:{{editData.meta.title}}</span>
    <div>
      <el-form :model="form" :rules="rules" ref="editForm" label-width="120px">
        <el-form-item label="路径" prop="url">
          <el-input v-model="form.url" :disabled="urlInput" placeholder="url,例如：/views/emp/basic/EmpBasic.vue"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" placeholder="菜单名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="iconCls">
          <el-input v-model="form.iconCls" placeholder="菜单对应的图标" autocomplete="off"></el-input>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="页面是否缓存">
            <el-switch v-model="form.keepAlive"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="页面是否登录">
            <el-switch v-model="form.requireAuth"></el-switch>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel()">取 消</el-button>
      <el-button type="primary" @click="onSubmit('editForm')">确 定</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'EditMenu',
    props: {
      editData: {}
    },
    data() {
      return {
        form: {},
        urlInput: false,
        switchValue: false,
        rules: {
          url: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ],
          iconCls: [
            {required: true, message: '必输项不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      // 加载的对话框时候，根据id查询路由信息
      let id = this.editData.id
      this.httpPost('/system/menu/selectMenuInfoByMid', {id}).then(resp => {
        if (resp.code === 200) {
          // 初始化对话框的数据
          this.form = resp.obj
        }
      })
    },
    methods: {
      changeSwitch() {
        if (this.switchValue) { // 目录
          this.form.url = '/'
          this.form.folder = true
          this.urlInput = true
        } else { // 菜单
          this.form.url = ''
          this.form.folder = false
          this.urlInput = false
        }
      },
      onSubmit(editForm) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            this.$confirm('确定继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.httpPost('/system/menu/editMenuInfoByMid', this.form).then(resp => {
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
      onCancel() {
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style scoped>

</style>
