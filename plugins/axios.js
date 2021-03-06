import Vue from 'vue'
import axios from 'axios'
import {serverApiDomain, clientApiDomain, loginPage, webDomain} from '../modules/variables'
import cookieParser from '~/plugins/cookies'
import injectServices from '../services/index'
import {onApiError} from '~/modules/error-code'
import {reportError} from '~/plugins/sentry'

function sleep(ms = 100) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(ms)
    }, ms)
  })
}

// 全局处理
axios.defaults.timeout = 15000
axios.defaults.headers.common['platform'] = 'web'
axios.defaults.headers.common['timezone'] = new Date().getTimezoneOffset() / 60

const options = {
  baseURL: process.client ? clientApiDomain : serverApiDomain,
  // proxy: {
  //   host: '127.0.0.1',
  //   port: '80'
  // }
}

export default ({app, store}) => {
  const inst = axios.create(options)

  inst.defaults.headers.common['Accept-Language'] = store.state.lang.lang || 'zh_Hans_CN'

  // 初始化
  inst.init = function (req) {
    if (process.client) {
      const cookieString = document.cookie
      if (cookieString) {
        const cookies = cookieParser.parse(cookieString)
        inst.defaults.headers.common['Accept-Language'] = cookies.lang || store.state.lang.lang
        inst.defaults.headers.common['Authorization'] = cookies.token
      }
      // if (token && token.length) {
      //   inst.defaults.headers.common['Authorization'] = token[1]
      // } else {
      //   console.log('delete Authorization')
      //   delete inst.defaults.headers.common['Authorization']
      // }

      return inst
    } else {
      if (!req) throw new Error('没有传入 req 参数')
      const cookieString = req.headers.cookie
      const cookies = cookieString ? cookieParser.parse(cookieString) : {}
      const lang = cookies.lang || store.state.lang.lang || req.headers['Accept-Language']
      // 回来仔细研究下应该怎么做鉴权，感觉这种 init 并不是最好的方式。可以用下vue-axios代替

      // 防止用户之间串cookie
      if (cookieString) {
        inst.defaults.headers.cookie = cookieString
        if (cookies && cookies.token) {
          inst.defaults.headers.common['Authorization'] = cookies.token
        }
      } else {
        delete inst.defaults.headers.cookie
        delete inst.defaults.headers.common['Authorization']
      }

      // 防止用户之间串语言
      if (lang) {
        inst.defaults.headers.common['Accept-Language'] = lang
      } else {
        delete inst.defaults.headers.common['Accept-Language']
      }

      // remoteip
      // console.log(req.headers)
      let clientip = req.headers['x-connecting-ip']
      if (!clientip) {
        clientip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null
      }
      if (!clientip) {
        clientip = req.headers['x-proxy-ip']
      }
      if (!clientip) {
        clientip = req.headers['x-real-ip']
      }
      if (!clientip) {
        clientip = req.headers['remoteip']
      }
      // console.log(clientip)
      if (clientip) {
        inst.defaults.headers.common['clientip'] = clientip
      }
    }
    return inst
  }

  inst.needAuth = function (err, redirect, path = '/') {
    if (err.code && (err.code === 401 || err.code === 403)) {
      const loginUrl = `${loginPage}?redirect=${encodeURIComponent(webDomain + path)}`
      try {
        // nuxt的redirect在客户端使用了 window.location.replace，会导致无法回到之前页面，这里处理下
        if (process.client) {
          window.location = loginUrl
        } else {
          redirect(loginUrl)
        }
      } catch (e) {
        reportError(e)
      }

      // redirect是异步的...神坑，window.location也是异步的
      // 因此会造成先渲染了下一个页面，再跳转到登录页面的情况，为了避免这种情况，就等跳转完成(300ms)再 resolve
      // https://stackoverflow.com/questions/37521172/is-javascript-location-href-call-is-asynchronous
      return process.client ? sleep(300) : ''
    }
    reportError(err)
  }

  // 挂载一下api错误处理函数
  inst.onError = (error) => onApiError(error, app)

  inst.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      if (!/get|options/i.test(config.method)) {
        const token = Math.random().toString(36).substring(2, 15) // 后端只校验header跟query是否一致，可能存在后患

        config.headers.common['X-CSRF-TOKEN'] = token
        if (/\?/.test(config.url)) {
          config.url += '&X-CSRF-TOKEN=' + token
        } else {
          config.url += '?X-CSRF-TOKEN=' + token
        }
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
  // 401/403
  inst.interceptors.response.use(
    function (response) {
      const data = response.data

      // code 不为 0，即为后台报错
      if (data && data.code) {
        const err = new Error(data.message)
        err.code = data.code
        err.data = data.data
        err.message = data.message

        return Promise.reject(err)
      }
      return response.data
    },
    function (err) {
      err.code = (err.response && err.response.status) || err.code
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        if (process.client) {
          const token = /token=(.*?)(;|$)/gi.exec(document.cookie)
          if (token && token[0]) {
          }
        }
      } else {
        if (process.client) {
          ga('send', 'pageview')
        }

        console.error(err)
      }
      return Promise.reject(err)
    }
  )

  // 将service注入到axios实例中去
  injectServices(inst)

  // 客户端自己执行init
  if (process.client) {
    inst.init()
  }

  Vue.prototype.axios = inst
  app.axios = inst

  return inst
}
