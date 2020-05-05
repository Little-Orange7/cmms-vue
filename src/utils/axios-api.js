import axios from 'axios'
import {Message} from 'element-ui'
import router from '../router'

/**
 * 创建axios实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  // 统一设置请求头
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  // baseURL: process.env.BASE_URL,  // api的base_url
  baseURL: 'api', // 每个接口请求都会统一加上api，例如:http://host:port/api/XXXX
  timeout: 5000 // 请求超时时间
})

// 响应成功-------
// response.status 200 OK
// response.data.status  500 是返回成功之后的业务错误信息

// 响应失败--------
// response.status
// 401 登录过期，请重新登录
// 404 网络请求不存在
// 500 是服务端异常报错了
service.interceptors.response.use(response => {
  // 响应接收成功，但是业务上的处理是失败的
  if (response.status === 200 && response.data.code === 500) {
    Message.error({message: response.data.msg})
    return response.data
  }
  // 退出登录成功后，跳转到登录页
  if (response.status === 200 && response.data.code === 402) {
    Message.success({message: response.data.msg})
    window.sessionStorage.removeItem('user')
    router.replace('/')
    return
  }
  // 后台只放置成功的数据，不放置成功的msg，则不会弹出成功提示；只有存在成功的消息，就会弹出成功提示。
  if (response.data.msg) {
    Message.success({message: response.data.msg})
  }
  return response.data
}, error => {
  if (error.response.status === 404) {
    Message.error({message: '网络请求不存在!'})
  } else if (error.response.status === 401) {
    // 登录过期，要跳转到登录页
    window.sessionStorage.removeItem('user')
    Message.error({message: '登录过期，请重新登录!'})
    router.replace('/')
  } else {
    if (error.response.data.msg) {
      Message.error({message: error.response.data.msg})
    } else {
      Message.error({message: '未知网络错误!'})
    }
  }
})

// 登录请求，可以对用户名和密码做加密处理，todo 加密处理未完成
export const loginHttpPost = (url, params) => {
  return service({
    method: 'post',
    url: url,
    data: params
  })
}

// post请求
export const httpPost = (url, params) => {
  return service({
    method: 'post',
    url: url,
    data: params
  })
}

// get请求
export const httpGet = (url, params) => {
  return service({
    method: 'get',
    url: url,
    data: params
  })
}
