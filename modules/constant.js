/**
 * 避免直接使用，统一export，然后通过store里面的constant来引用，保证单一数据来源
 */

const COIN_TYPES = ['BTC', 'BCH', 'ETH', 'USDT']

const PAYMENT_OPTIONS = [
  {text: '不限', value: 'ALL'},
  {text: '银行卡', value: 'bankcard', icon: 'icon-bankcard'},        // method, 服务端对方法的定义
  {text: '支付宝', value: 'alipay', icon: 'icon-alipay'},
  {text: '微信', value: 'wechat', icon: 'icon-wechat-round'},
]

export default {
  COIN_TYPES,
  COIN_TYPE_OPTIONS: COIN_TYPES.map(name => {
    return {
      text: name,
      value: name
    }
  }),
  PAYMENT_OPTIONS,
  PAYMENT_TYPES: {
    BANKCARD: 'bankcard',
    ALIPAY: 'alipay',
    WECHAT: 'wechat'
  },

  // payment的映射，方便直接找到对应的配置
  PAYMENT_MAP: PAYMENT_OPTIONS.reduce((map, option) => {
    map[option.value] = option
    return map
  }, {}),
  // 支付方式的状态
  PAYMENT_STATUS: {
    ON: 'on',
    OFF: 'off'
  },

  COUNTERPARTY_LIMIT_OPTIONS: [{
    text: '交易方必须通过手机验证',
    value: 'bind_phone'
  }, {
    text: '交易方必须通过实名验证',
    value: 'kyc',
  }, {
    text: '交易方必须完成过 1 次交易',
    value: 'one_deal',
  }],

  VERIFY_CODE_TYPE: {
    GOOGLE: 'totp',
    SMS: 'sms'
  },

  // 验证码的业务类型
  VERIFY_CODE_BUSINESS: {
    ADD_PAYMENT: 'otc_add_payment_method',
    MODIFY_PAYMENT: 'otc_modify_payment_method',
  },

  KYC_STATUS: {
    PASS: 'pass'
  },

  ORDER_STATUS: {
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
  },
  // 定价方式: 浮动定价 固定定价
  PRICING_TYPE: {
    FLOAT: 'float',
    FIXED: 'fixed'
  },
  // 商家认证状态
  MERCHANT_STATUS: {
    CREATED: 'created',
    PASS: 'pass',
    NO: 'no',
    CANCEL: 'cancel',
  },
  APPEAL_REASONS: ['卖家未放币', '买家付款未收到', '买家付款金额错误', '其他'],
  SIDE: {
    BUY: {
      text: '买家',
      value: 'buy',
    },
    SELL: {
      text: '卖家',
      value: 'sell',
    },
  }
}
