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
