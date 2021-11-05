<template>
  <div class="containers">
    <div ref="canvas" class="canvas">
      <div class="button-group">
        <el-button type="primary" icon="el-icon-refresh-left" @click="handleUndo">撤销</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleRedo">恢复撤销</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handleDownloadXml">下载</el-button>
        <el-button type="primary" @click="handleOpenFile">上传<i class="el-icon-upload el-icon--right"></i></el-button>
<!--        <el-button type="primary" icon="el-icon-zoom-out" @click="handleZoom(-1)">缩小</el-button>-->
<!--        <el-button type="primary" icon="el-icon-zoom-in" @click="handleZoom(1)">放大</el-button>-->
        <el-button type="primary" icon="el-icon-folder-add" @click="handleDeployXml">部署</el-button>
      </div>
    </div>
    <div id="js-properties-panel" class="panel"></div>
    <el-dialog title="文件名称定义" :visible.sync="dialogFormVisible">
      <el-form :model="fileForm">
        <el-form-item label="文件名称" :label-width="formLabelWidth">
          <el-input v-model="fileForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  //一.需要编辑则引入"bpmn-js/lib/Modeler",并且还需要引入左侧编辑栏panel等
  //引入bpmn-js面板模块，通过该面板可设计节点属性
  import BpmnModeler from "bpmn-js/lib/Modeler";
  /*import propertiesPanelModule from 'bpmn-js-properties-panel'// 属性面板
  import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'// 而这个引入的是右侧属性栏里的内容
  // 一个描述的json
  import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'// 扩展属性*/

  //如果使用camunda，后台activiti不兼容，就使用下面的适配activiti的方式；
  // 适应activiti（为了防止兼容性报错问题，最好使用以下版本：npm install bpmn-js@7.3.1 bpmn-js-properties-panel@0.37.2 camunda-bpmn-moddle@4.4.0)
  import activitiModdleDescriptor from 'activiti-bpmn-moddle/resources/activiti.json'
  // 这两个是面板
  import propertiesPanelModule from 'bpmn-js-properties-panel-keeley'
  import propertiesProviderModule from 'bpmn-js-properties-panel-keeley/lib/provider/activiti'

  import { xmlStr } from "../../../bpmn/bpmnXmlStr";
  import zoomScroll from "../../../bpmn/zoomScroll";//禁用鼠标滚轮 防止滚轮操作导致图形上下移动
  // customTranslate 官网有直接去下载
  import customTranslate from '../../../bpmn/customTranslate';
  const customTranslateModule = {
    translate: [ 'value', customTranslate ]
  }
  //二.这里需要预览引入Viewer就可以
  import BpmnViewer from "bpmn-js/lib/Viewer";

  export default {
    name: "bpmnModeler",
    created() {
      // this.getImg();
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        bpmnModeler: null,
        container: null,
        canvas: null,
        newScale:1,
        bpmnInfo:{
          xmlStr:xmlStr,
          svgStr:''
        },
        //Viewer相关
        bpmnViewer: null,
        scale: 1,
        xmlUrl:xmlStr,
        fileForm:{
          name:'',
          handleType:''//0-下载 1-部署
        },
        dialogFormVisible: false,
        formLabelWidth: '120px'
      };
    },
    methods: {
      init() {
        const canvas = this.$refs.canvas;
        this.bpmnModeler = new BpmnModeler({
          container: canvas,
          // 添加控制板
          propertiesPanel: {
            parent: '#js-properties-panel'
          },
          additionalModules: [
            // 左边工具栏以及节点
            propertiesProviderModule,
            // 右边的工具栏
            propertiesPanelModule,
            // 语言汉化
            customTranslateModule
          ],
          //如果要在属性面板中维护camunda：XXX属性，则需要此
          moddleExtensions: {
            // camunda: camundaModdleDescriptor
            activiti: activitiModdleDescriptor
          }
        });
        // 实时保存
        const _this = this
        // 给图绑定事件，当图有发生改变就会触发这个事件
        this.bpmnModeler.on('commandStack.changed', function() {
          _this.saveBmap()
        })
        this.createNewDiagram();
      },
      createNewDiagram() {
        let vm = this
        try {
          const result = vm.bpmnModeler.importXML(vm.bpmnInfo.xmlStr);
          const {warnings} = result;
          console.log(warnings);
        } catch (err) {
          console.log(err.message, err.warnings);
        }
      },
      // 实时保存
      saveBmap() {
        const vm = this
        vm.bpmnModeler.saveXML({ format: true }, (err, xml) => {
          if (err) { return }
          vm.bpmnInfo.xmlStr = xml
        })
        vm.bpmnModeler.saveSVG({ format: true }, (err, data) => {
          if (err) { return }
          vm.bpmnInfo.svgStr = data
        })
      },
      // 上传文件
      handleOpenFile(e) {
        const vm = this
        const input = document.createElement('input')
        input.type = 'file'
        input.click()// 打开文件选择框
        input.onchange = function() {
          const file = input.files[0]
          vm.fileForm.name = file.name.substring(0,file.name.lastIndexOf("."))
          if (window.FileReader) {
            try {
              var fr = new FileReader()
              fr.readAsText(file) // 将文件读取为文本
              fr.onload = function(e) {
                vm.bpmnInfo.xmlStr = fr.result
                vm.createNewDiagram()
              }
            } catch (e) {
              console.error(e.toString())
            }
          } else {
            alert('您的浏览器可能不支持此操作')
          }
        }
        if(document.body.contains(input)){
          document.body.removeChild(input)
        }
      },
      // 下载xml/svg
      download(type, data, name) {
        // 下载xml/svg
        let dataTrack = ''
        const a = document.createElement('a')
        switch (type) {
          case 'xml':
            dataTrack = 'bpmn'
            break
          case 'svg':
            dataTrack = 'svg'
            break
          default:
            break
        }
        const reName = name + `.${dataTrack}`
        a.setAttribute(
          'href',
          `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
        )
        a.setAttribute('target', '_blank')
        a.setAttribute('dataTrack', `diagram:download-${dataTrack}`)
        a.setAttribute('download', reName)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      },
      handleDownloadXml(){
        this.dialogFormVisible = true;
        this.fileForm.handleType='0';//下载
      },
      handleDeployXml(){
        this.dialogFormVisible = true;
        this.fileForm.handleType='1';//部署
      },
      handleDialog(){
        if('0'==this.fileForm.handleType){
          this.downloadXml();
          this.dialogFormVisible = false;
        }else if('1'==this.fileForm.handleType){
          this.deploy();
        }else{
          this.$message.error("非法操作！")
        }
      },
      // 下载 XML 格式
      downloadXml() {
        let vm = this
        vm.bpmnModeler.saveXML({ format: true }, (err, xml) => {
          if (err) {
            alert('导出错误，请重试')
          } else {
            vm.download('xml', xml, vm.fileForm.name)
          }
        })
      },
      // 下载 SVG 格式
      saveImg() {
        let vm = this
        vm.bpmnModeler.saveSVG({ format: true }, (err, xml) => {
          if (err) {
            alert('导出错误，请重试')
          } else {
            vm.download('svg', xml, new Date().getTime())
          }
        })
      },
      //部署
      deploy(){
        let deployment={
          type:'',
          name:this.fileForm.name,
          resource:this.bpmnInfo.xmlStr
        }
        this.httpPost('/activiti/createDeployment', deployment).then(resp => {
          if (resp.code === 200) {
          }
          this.dialogFormVisible = false;
        })
      },
      // 前进
      handleRedo() {
        this.bpmnModeler.get('commandStack').redo()
      },
      // 后退
      handleUndo() {
        this.bpmnModeler.get('commandStack').undo()
      },
      /*// 放大缩小
      handleZoom(radio) {
        let vm = this
        vm.newScale+=radio;
        console.log("vm.newScale:"+vm.newScale)
        vm.bpmnModeler.get('canvas').zoom(vm.newScale)
      },*/
      resetView(){
        let vm = this
        //恢复到原位
        vm.bpmnModeler.get('canvas').zoom('fit-viewport')
      },
      //view 缩放相关
      getImg() {
        // 初始时清除图层
        this.bpmnViewer && this.bpmnViewer.destroy();
        // this.$refs.canvas.importXML = "";
        this.scale = 1; // 放大缩小比例
        // 初始化canvas
        this.bpmnViewer = new BpmnViewer({
          container: this.$refs.canvas,
          height: 540, // 根据实际情况设置高度，宽度的话设置父元素的宽度就可以，会自适应的
        });
        const self = this;
        const bpmnXmlStr = this.xmlUrl; // 从接口获取的xml文件
        this.bpmnViewer.importXML(bpmnXmlStr, function (err) {
          if (err) {
            console.error(err);
          } else {
            let canvas = self.bpmnViewer.get("canvas");
            canvas.zoom("fit-viewport", "auto");
            // nodeCodes为需要设置高亮颜色的部分的id的集合（xml文件中<flowNodeRef>****</flowNodeRef>标签里的部分），这个数据也是从接口获取，这里从xml中随便取出几个测试用
            let nodeCodes = [
              "Activity_1d2rrr0",
              "StartEvent_1",
              "Activity_1d2wp4b",
            ];
            // 调用设置高亮颜色class方法,这里可以根据接口获取的id集合情况，对不同的部分设置不同的class名，然后在css中设置样式
            self.setNodeColor(nodeCodes, "nodeSuccess", canvas);
          }
        });
      },
      // 设置高亮颜色的class
      setNodeColor(nodeCodes, colorClass, canvas) {
        for (let i = 0; i < nodeCodes.length; i++) {
          canvas.addMarker(nodeCodes[i], colorClass);
        }
      },
      // 放大缩小，这里尽量设置flag的值小一点，这样每次放大缩小不会很多，避免放大超出父元素
      handleZoom(flag) {
        // 放大缩小倍数flag可以自行设置
        if (flag < 0 && this.scale <= 1) {
          return;
        }
        this.scale += flag;
        this.$nextTick(() => {
          this.bpmnViewer.get("canvas").zoom(this.scale);
        });
      },
      //当前日期格式化
      getNowDateStr() {
        let date = new Date();
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + month + currentDate + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
      }
    }
  };

</script>
<style scoped>
  .containers {
    width: 100%;
    height: calc(100vh - 82px);
  }
  .canvas{
    width: 80%;
    /*height: 100%;*/
    height: 1035px;
    float: left;
    background-color: #eaeaea;
  }
  .panel{
    /*position: relative;*/
    right: 0;
    top: 0;
    width: 20%;
    height: 100%;
    float: right;
  }
  .canvas .button-group{
    position: relative;
    padding-left: 2%;
    top: -10px;
    width: 100%;
    height: 20px;
  }
  /deep/ .button-group .el-button{
    padding: 6px 20px;
    font-size: 5px;
  }
</style>
