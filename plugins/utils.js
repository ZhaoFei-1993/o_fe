import Vue from 'vue'

const emailDomainMap = {
  'qq.com': 'http://mail.qq.com',
  'gmail.com': 'http://mail.google.com',
  'sina.com': 'http://mail.sina.com.cn',
  '163.com': 'http://mail.163.com',
  '126.com': 'http://mail.126.com',
  'yeah.net': 'http://www.yeah.net/',
  'sohu.com': 'http://mail.sohu.com/',
  'tom.com': 'http://mail.tom.com/',
  'sogou.com': 'http://mail.sogou.com/',
  '139.com': 'http://mail.10086.cn/',
  'hotmail.com': 'http://www.hotmail.com',
  'live.com': 'http://login.live.com/',
  'live.cn': 'http://login.live.cn/',
  'live.com.cn': 'http://login.live.com.cn',
  '189.com': 'http://webmail16.189.cn/webmail/',
  'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
  'yahoo.cn': 'http://mail.cn.yahoo.com/',
  'eyou.com': 'http://www.eyou.com/',
  '21cn.com': 'http://mail.21cn.com/',
  '188.com': 'http://www.188.com/',
  'foxmail.coom': 'http://www.foxmail.com',
}

const imgTypeArr = ['JPEG', 'TIFF', 'RAW', 'BMP', 'GIF', 'PNG', 'JPG']

const utils = {
  isImage(fileName) {
    const arr = fileName.split('.')
    if (!arr.length) return false

    const type = arr[arr.length - 1].toUpperCase()

    return imgTypeArr.some(element => element === type)
  },

  /**
   * 获取邮箱对应的网站
   * @param email
   * @return {*}
   */
  getEmailSite: function (email) {
    const mail = /@(.*)$/.exec(email)
    if (mail && mail[1]) {
      return emailDomainMap[mail[1]]
    } else {
      return false
    }
  },

  /**
   * 从后端返回的列表数据中提取出来分页信息
   * @param data
   * @param limit
   * @return {{total: *|number|PaymentItem, currentPage: number, totalPage: number, hasNext: *, limit: number}}
   */
  extractPager(data, limit = 10) {
    return {
      total: data.total,
      currentPage: data.curr_page,
      totalPage: data.total_page,
      hasNext: data.has_next,
      limit: limit,
    }
  },
  /**
   * 跳转到email对应的登录网站
   * @param email
   */
  openEmailSite: function (email) {
    const emailDomain = this.getEmailSite(email)

    if (emailDomain) {
      window.open(emailDomain)
    }
  },

  /**
   * 格式化数字输入（只允许输入数字）
   * @param value
   * @param event
   * @return {string | void | *}
   */
  numberFormat: function (value, event) {
    const newVal = value.replace(/[^0-9]/gi, '')
    event.target.value = newVal
    return newVal
  },

  /**
   * 格式化文本输入（只允许输入文本）
   * @param value
   * @param event
   * @return {string | void | *}
   */
  textFormat: function (value, event) {
    const newVal = value.replace(/[^a-zA-Z]/gi, '')
    event.target.value = newVal
    return newVal
  },

  /**
   * 格式化输入的小数的格式，并且限制小数长度
   * @param val
   * @param {Number} decimalLength 限制的小数长度
   * @return {*}
   */
  inputDecimalFormat: function (val, decimalLength) {
    if (!(/\./.test(val))) return val

    let decimal = /\.(\d*)?/.exec(val)
    if (decimal && decimal.length) {
      decimal = decimal[1]
    }

    if (decimal.length > decimalLength) {
      return val.split('.')[0] + '.' + decimal.substring(0, decimalLength)
    } else {
      return val
    }
  },

  /**
   * 去除掉url中的参数
   * @param key
   * @return {string}
   */
  removeParamInLink(key) {
    const search = location.search
    let newSearch = ''
    if (search) {
      const result = []
      const parts = search.trim().replace(/^[?#&]/, '').split('&')
      parts.forEach((item) => {
        const info = item.split('=')
        if (info[0] !== key) {
          result.push(item)
        }
      })
      if (result.length > 0) {
        newSearch = '?' + result.join('&')
      }
    }
    return location.href.split('?')[0] + newSearch
  },

  /**
   * 函数节流方法
   * @param {Function} fn 延时调用函数
   * @param {Number} delay 延迟多长时间
   * @param {Number} atleast 至少多长时间触发一次
   * @return Function 延迟执行的方法
   */
  throttle(fn, delay, atleast) {
    let timer = null
    let previous = null

    return function () {
      const now = new Date()

      if (!previous) {
        previous = now
      }

      if (now - previous > atleast) {
        fn()
        // 重置上一次开始时间为本次结束时间
        previous = now
      } else {
        clearTimeout(timer)
        timer = setTimeout(function () {
          fn()
        }, delay)
      }
    }
  },
  /**
   * 将放在一起的validator 和 message 分开（放在一起是方便管理，分开是方便使用）
   * @param validationConfig
   * @return {{validations: {}, invalidMessages: {}}}
   */
  processValidationConfig(validationConfig) {
    const validations = {}
    const invalidMessages = {}

    for (const key in validationConfig) {
      validations[key] = validationConfig[key].validation
      console.log(validations[key], validationConfig[key])
      invalidMessages[key] = validationConfig[key].message
    }

    return {
      validations,
      invalidMessages,
      messages: invalidMessages,
    }
  },
  /**
   * 格式化时间
   * @param  {Number} timestamp 时间戳，秒为单位
   * @param  {String} precision 精确度
   * @return {String}           格式化后的时间字符串
   */
  getTimeText: function (timestamp, precision = 'second') {
    const time = new Date(timestamp * 1000)
    let timeText = ''
    switch (precision) {
      case 'second':
        timeText =
          time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
      case 'minute': // eslint-disable-line no-fallthrough
        if (precision !== 'minute') {
          timeText = ':' + timeText
        }
        timeText =
          (time.getMinutes() > 9
            ? time.getMinutes()
            : '0' + time.getMinutes()) + timeText
      case 'hour': // eslint-disable-line no-fallthrough
        if (precision !== 'hour') {
          timeText = ':' + timeText
        }
        timeText =
          (time.getHours() > 9 ? time.getHours() : '0' + time.getHours()) +
          timeText
      case 'day': // eslint-disable-line no-fallthrough
        if (precision !== 'day') {
          timeText = ' ' + timeText
        }
        timeText =
          (time.getDate() > 9 ? time.getDate() : '0' + time.getDate()) +
          timeText
      case 'month': // eslint-disable-line no-fallthrough
        if (precision !== 'month') {
          timeText = '-' + timeText
        }
        timeText =
          (time.getMonth() + 1 > 9
            ? time.getMonth() + 1
            : '0' + (time.getMonth() + 1)) + timeText
      case 'year': // eslint-disable-line no-fallthrough
        if (precision !== 'year') {
          timeText = '-' + timeText
        }
        timeText = time.getFullYear() + timeText
        break
      default:
        break
    }
    return timeText
  },
  local(date) {
    return (new Date(date)).toLocaleString()
  },
}

export default ({app, store}) => {
  app.utils = Vue.prototype.utils = utils
}
