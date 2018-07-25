/**
 * 避免直接使用，统一export，然后通过store里面的constant来引用，保证单一数据来源
 */

const COIN_TYPES = ['BTC', 'BCH', 'ETH', 'USDT']

// 实际支持的支付方式
const ACTUAL_PAYMENT_OPTIONS = [
  {text: '银行卡', value: 'bankcard', icon: 'icon-bankcard'},        // method, 服务端对方法的定义
  {text: '支付宝', value: 'alipay', icon: 'icon-alipay'},
  {text: '微信', value: 'wechat', icon: 'icon-wechat-round'}
]

// 包括"不限"的支付方式
const PAYMENT_OPTIONS = [
  {text: '不限', value: 'ALL'},
  ...ACTUAL_PAYMENT_OPTIONS,
]

const APPEAL_RESULTS = [
  {text: '平局', value: 'draw'},
  {text: '买家胜诉', value: 'buyer_win'},
  {text: '卖家胜诉', value: 'seller_win'},
]

const ORDER_RESULTS = [
  {text: '双方协商处理', value: 'none'},
  {text: '订单成交', value: 'receipt_order'},
  {text: '订单取消', value: 'cancel_order'},
]

export default {
  COIN_TYPES,
  COIN_TYPE_OPTIONS: COIN_TYPES.map(name => {
    return {
      text: name,
      value: name
    }
  }),
  ACTUAL_PAYMENT_OPTIONS,
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
  ORDER_RESULT_MAP: ORDER_RESULTS.reduce((map, option) => {
    map[option.value] = option
    return map
  }, {}),
  APPEAL_RESULT_MAP: APPEAL_RESULTS.reduce((map, option) => {
    map[option.value] = option
    return map
  }, {}),
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
    CONFIRM_RECEIPT: 'otc_receipt_order',
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
  MERCHANT_AUTH_STATUS: {
    CREATED: 'created',
    PASS: 'pass',
    NO: 'no',
    CANCEL: 'cancel',
  },
  APPEAL_REASONS: ['卖家未放币', '买家付款未收到', '买家付款金额错误', '其他'],
  APPEAL_STATUS: {
    CREATED: 'created',
    PROCESSING: 'processing',
    CANCEL: 'cancel',
    COMPLETED: 'completed',
  },
  SIDE: {
    BUY: 'buy',
    SELL: 'sell',
  },
  QUALIFICATIONS: {
    KYC: 'kyc',
    BIND_PHONE: 'bind_phone',
    ONE_DEAL: 'one_deal',
  },
  // 用户的密码难度等级
  PASSWORD_LEVEL: {
    HIGH: 'high',
    MIDDLE: 'middle',
    LOW: 'low',
  },

  // 广告状态
  ITEM_STATUS: {
    ONLINE: 'on',
    OFFLINE: 'off',
  },
  // 交易需要验证的频率
  TRADE_VALIDATE_FREQUENCY: {
    NEVER: 'never',
    EACH_TIME: 'each_time',
    EACH_TWO_HOURS: 'each_two_hours',
  },

  // 自动回复内容的最大长度
  MAX_AUTO_REPLY_LENGTH: 50,

  // 允许的交易最大最小值的上下限（暂时只针对CNY）
  DEAL_CASH_AMOUNT: {
    MIN: 100,
    MAX: 5000000
  },
}
