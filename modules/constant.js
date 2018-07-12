/**
 * 以下常量尽量不要直接使用，而是通过store里面的constant来使用（那边会引用），保证单一数据来源
 */
export const COIN_TYPES = ['BTC', 'BCH', 'ETH', 'USDT']
export const PAYMENT_OPTIONS = [
  {text: '不限', value: 'ALL'},
  {text: '银行卡', value: 'CARD'},
  {text: '支付宝', value: 'ALIPAY'},
  {text: '微信', value: 'WECHAT'},
]

export const COUNTERPARTY_LIMIT_OPTIONS = [{
  text: '交易方必须完成过 1 次交易',
  value: 0
}, {
  text: '交易方必须通过手机验证',
  value: 1,
}, {
  text: '交易方必须通过实名验证',
  value: 2,
}]

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
