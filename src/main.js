// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {loginHttpPost, httpPost, httpGet} from './utils/axios-api'

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
