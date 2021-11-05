// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {loginHttpPost, httpPost, httpGet} from './utils/axios-api'

//引入bpmn.js的样式(工具栏和属性栏)
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
import 'bpmn-js-properties-panel-keeley/dist/assets/bpmn-js-properties-panel.css';


Vue.use(ElementUI)

Vue.prototype.loginHttpPost = loginHttpPost
Vue.prototype.httpPost = httpPost
Vue.prototype.httpGet = httpGet

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
