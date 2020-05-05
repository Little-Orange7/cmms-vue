<template>
  <div>
    <div><el-switch v-model="switchValue" :disabled="true" active-text="目录" inactive-text="菜单"></el-switch></div>
    <span>上一层级:{{viewData.meta.title}}</span>
    <div>
      <el-form :model="form" :rules="rules" ref="editForm" label-width="120px">
        <el-form-item label="路径" prop="url">
          <el-input v-model="form.url" :disabled="true" placeholder="url,例如：/views/emp/basic/EmpBasic.vue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" :disabled="true" placeholder="菜单名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="iconCls">
          <el-input v-model="form.iconCls" :disabled="true" placeholder="菜单对应的图标" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面关闭之前是否缓存">
          <el-switch v-model="form.keepAlive" :disabled="true"></el-switch>
        </el-form-item>
        <el-form-item label="页面查看是否需要登录">
          <el-switch v-model="form.requireAuth" :disabled="true"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onCancel()">返回</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ViewMenu',
  props: {
    viewData: {}
  },
  data () {
    return {
      form: {},
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
  mounted () {
    let id = this.viewData.id
    this.httpPost('/system/menu/selectMenuInfoByMid', {id}).then(resp => {
      if (resp.code === 200) {
        // 初始化对话框的数据
        this.form = resp.obj
      }
    })
  },
  methods: {
    onCancel () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
