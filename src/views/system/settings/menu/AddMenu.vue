<template>
  <div>
    <div><el-switch v-model="switchValue" active-text="目录" inactive-text="菜单" @change='changeSwitch'></el-switch></div>
    <div><span>上一层级:{{addData.meta.title}}</span></div>
    <div>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px">
        <el-form-item label="路径" prop="url">
          <el-input v-model="addForm.url" :disabled="urlInput" placeholder="url,例如：/views/system/settings/menu/MenuList.vue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="addForm.title" placeholder="菜单名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="iconCls">
          <el-input v-model="addForm.iconCls" placeholder="菜单对应的图标" autocomplete="off"></el-input>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="页面是否缓存">
            <el-switch v-model="addForm.keepAlive"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="页面是否登录">
            <el-switch v-model="addForm.requireAuth"></el-switch>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel()">取 消</el-button>
      <el-button type="primary" @click="onSubmit('addForm')">确 定</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'AddMenu',
  props: {
    addData: {}
  },
  data () {
    return {
      addForm: {
        id: '',
        url: '',
        name: '',
        title: '',
        iconCls: 'el-icon-document',
        keepAlive: true,
        requireAuth: true,
        parentId: this.addData.id,
        folder: false
      },
      urlInput: false,
      switchValue: false,
      rules: {
        url: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ],
        iconCls: [
          { required: true, message: '必输项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 目录和菜单切换
    changeSwitch () {
      if (this.switchValue) { // 目录
        this.addForm.url = '/'
        this.addForm.folder = true
        this.addForm.iconCls = 'el-icon-folder'
        this.urlInput = true
      } else { // 菜单
        this.addForm.url = ''
        this.addForm.folder = false
        this.addForm.iconCls = 'el-icon-document'
        this.urlInput = false
      }
    },
    // 提交
    onSubmit (addForm) {
      this.$refs[addForm].validate((valid) => {
        if (valid) {
          this.$confirm('确定继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.httpPost('/system/menu/addMenu', this.addForm).then(resp => {
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
    onCancel () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
