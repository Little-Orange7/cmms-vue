<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" style="margin-bottom: 20px;height:80px;">
          <div class="hello">
            <span>欢迎来到首页!</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height:680px;">
          <el-calendar v-model="value">
          </el-calendar>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" style="margin-bottom: 20px;height:380px;">
          <div slot="header" class="cardColer">
            <span>待办事项</span>
          </div>
          <el-table :data="todoData" height="260" border style="width: 100%">
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="task" label="任务"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card shadow="hover" style="height:380px;">
          <div slot="header" class="cardColer">
            <span>已办事项</span>
          </div>
          <el-table :data="doneData" height="260" border style="width: 100%">
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="task" label="任务"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      value: new Date(),
      todoData: [{
        date: '2016-05-03',
        name: '王大锤',
        task: '请假申请'
      }, {
        date: '2016-05-02',
        name: '张大牙',
        task: '销假申请'
      }],
      doneData: [{
        date: '2016-05-03',
        name: '张一三',
        task: '报销申请'
      }, {
        date: '2016-05-02',
        name: '李二四',
        task: '出差车票报销'
      }, {
        date: '2016-05-04',
        name: '王三五',
        task: '报销申请'
      }, {
        date: '2016-05-01',
        name: '赵五六',
        task: '报销申请'
      }, {
        date: '2016-05-08',
        name: '钱六七',
        task: '报销申请'
      }]
    }
  },
  computed: {
  },
  methods: {
    handleClick (row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>
  .hello {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #2D8CF0;
    font-size: 30px;
  }
  .cardColer {
    color: #2D8CF0;
  }
</style>
