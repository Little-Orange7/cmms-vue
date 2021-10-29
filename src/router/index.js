import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../components/Layout'
import Dashboard from '../views/dashboard/Dashboard'
import Login from '../views/login/Login'
import NProgress from 'nprogress'
import watermark from '../utils/watermark'
import store from '../store'
import {httpPost} from '../utils/axios-api'
import {parseRoutes} from '../utils/parse-routes'
import {Message} from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Layout',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'Dashboard',
          name: 'Dashboard',
          component: Dashboard
        }
      ]
    },
    { // 加上这个是防止，登录后，1.刷新时地址栏的url对应的路由信息还未加载(由于下面的是动态加载路由router.addRoutes，此时地址栏的url对应的路由有可
      // 能还未加载完成，所以没有匹配到对应路由的url)，2.或者人为在地址栏输入不存在的url的页面时；这两种情况，这里会统一定位到首页。
      path: '*',
      redirect: '/Layout/Dashboard'
    }
  ]
})

// 全局前置守卫；每次路由跳转的时候，都会执行,或者刷新页面的时候也会执行
/**
 * 如果用户输入的不是登录地址(/Login),则判断当前会话是否存在用户信息，如果用户信息，
 * 一.存在，则继续判断vuex中是否有路由信息，如果 1.存在路由信息，则直接跳转到用户输入的路由地址的页面(若存在对应的页面，若不存在，则跳转到首页)，
 *                                          2.不存在路由信息，则根据用户id向后台发起请求，查询对应的路由菜单信息，并跳转到首页。
 * 二.不存在，则直接跳转到登录页面(/Login)。
 * 优点：考虑到用户登录后，刷新页面的情况；用户登录之后，只要刷新，菜单就可以获取到最新的(避免了超级管理员修改该用户菜单权限
 * 之后，要该用户退出重新登录才能加载到最新配置的菜单的尴尬)，刷新之后，所有的页面都关闭，只显示首页。
 * */
router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log('router.beforeEach===to.path:' + to.path)
  if (to.path === '/Login') {
    next()
  } else {
    if (window.sessionStorage.getItem('user')) { // 如果用户信息存在
      // 如果用户信息存在，则根据用户id查询获取路由信息，直接跳转到首页
      if (store.state.routes.length > 0) { // 如果路由信息存在，则直接跳转到路由对应的页面
        // 注意，此处不能用next(to.path)，只能用next()，这两者区别：next(to.path)会再一次进入导航守卫，根据此处的判断
        // 条件会造成死循环；而next()不会进入导航守卫，会直接到路由实例去找对应路由和组件；相同点：执行的url是一样的。
        next()
        NProgress.done()
      } else {
        // 获取用户路由信息
        let uid = JSON.parse(window.sessionStorage.getItem('user')).id
        httpPost('/system/common/getAllMenusByUid', {uid}).then(data => {
          console.log('data.code:' + data.code)
          if (data.code === 200) {
            let psRoutes = parseRoutes(data.obj)
            router.addRoutes(psRoutes)
            store.commit('INIT_ROUTES', psRoutes) // 将路由信息放入vuex中
            console.log('[获取用户路由信息成功]')
            // 此处，不能用next(to.path)，因为有可能router.addRoutes还未加载完成，所以控制台会报错；下面的这种方法也有可能找不到router中
            // 对应的url,但是不会报错，在路由实例的地方配置了统一处理找不到url的跳转的处理。
            next()
            NProgress.done()
          } else {
            console.log('[获取用户路由信息失败]')
            // 未登录的url将统一跳转到登录页(/Login)
            next('/Login')
            NProgress.done()
            Message.error({message: '获取用户菜单失败'})
          }
        })
      }
    } else {
      console.log('[用户未登录，跳转到登录页]')
      next('/Login')
    }
  }
})

// 全局后置钩子，每次路由跳转完之后执行
/**
 * 将登录用户名作为水印的背景；放到后置钩子里是因为，每次前置
 * 守卫走完就会加载用户信息，所以只要用户登录，就一定可以加载
 * 到用户的登录信息。
 */
router.afterEach((to) => {
  console.log('[router.afterEach]')
  NProgress.done()
  // 加水印
  if (to.path !== '/Login') {
    watermark.set(store.state.user.loginName, store.state.user.userName)
  } else { // 登录页展示的水印
    watermark.set('版权所有', '后台管理系统')
  }
})

export default router
