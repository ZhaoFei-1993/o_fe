/**
 * 以下常量尽量不要直接使用，而是通过store里面的constant来使用（那边会引用），保证单一数据来源
 */
export const COIN_TYPES = ['BTC', 'BCH', 'ETH', 'USDT']
export const PAYMENT_OPTIONS = [
  {text: '不限', value: 'ALL'},
  {text: '银行卡', value: 'bankcard', icon: 'icon-bankcard'},        // method, 服务端对方法的定义
  {text: '支付宝', value: 'alipay', icon: 'icon-alipay'},
  {text: '微信', value: 'wechat', icon: 'icon-wechat-round'},
]

export const PAYMENT_TYPES = {
  BANKCARD: 'bankcard',
  ALIPAY: 'alipay',
  WECHAT: 'wechat'
}

// payment的映射，方便直接找到对应的配置
export const PAYMENT_MAP = PAYMENT_OPTIONS.reduce((map, option) => {
  map[option.value] = option
  return map
}, {})

// 支付方式的状态
export const PAYMENT_STATUS = {
  ON: 'on',
  OFF: 'off'
}

export const COUNTERPARTY_LIMIT_OPTIONS = [{
  text: '交易方必须通过手机验证',
  value: 0
}, {
  text: '交易方必须通过实名验证',
  value: 1,
}, {
  text: '交易方必须完成过 1 次交易',
  value: 2,
}]

export const VERIFY_CODE_TYPE = {
  GOOGLE: 'google',
  SMS: 'sms'
}

export const KYC_STATUS_PASS = 'pass'

export const ORDER_STATUS = {
  CREATED: {
    text: '等待买家付款',
    value: 'created',
  },
  PAID: {
    text: '已付款待确认',
    value: 'paid',
  },
  SUCCESS: {
    text: '已完成',
    value: 'success',
  },
  CANCEL: {
    text: '已取消',
    value: 'cancel',
  },
  CLOSED: {
    text: '已关闭',
    value: 'closed',
  },
}
