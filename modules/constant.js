/** @i18n $translate **/
/**
 * 避免直接使用，统一export，然后通过store里面的constant来引用，保证单一数据来源
 */

// 支付方式的状态，
export const PAYMENT_STATUS = {
  ON: 'on',
  OFF: 'off'
}
export const KYC_STATUS = {
  PASS: 'pass', // 完成初级认证
  PROCESSING: 'processing',
  NO: 'no',
  FAIL: 'fail',
  ADVANCED_FAIL: 'advanced_fail',
  ADVANCED_PROCESSING: 'advanced_processing',
  ADVANCED_PASS: 'advanced_pass', // 完成高级认证
}
// 自动回复内容的最大长度
export const MAX_AUTO_REPLY_LENGTH = 50

// 允许的交易最大最小值的上下限（暂时只针对CNY）
export const DEAL_CASH_AMOUNT = {
  MIN: 100,
  MAX: 5000000
}

// 支付方式
export const PAYMENT_TYPES = {
  BANKCARD: 'bankcard',
  ALIPAY: 'alipay',
  WECHAT: 'wechat'
}

// 验证码类型
export const VERIFY_CODE_TYPE = {
  GOOGLE: 'totp',
  SMS: 'sms'
}

// 验证码的业务类型
export const VERIFY_CODE_BUSINESS = {
  ADD_PAYMENT: 'otc_add_payment_method',
  MODIFY_PAYMENT: 'otc_modify_payment_method',
  CONFIRM_RECEIPT: 'otc_receipt_order',
  MODIFY_FREQUENCY: 'otc_modify_validate_frequency',
}

/**
 * 获取i18n化的常量配置
 * @param $t
 */
export default function getConstant($t) {
  // i18n函数的占位，由i18n插件自动调用
  function $translate(text) {   // eslint-disable-line
    return $t ? $t(text) : text
  }

  const COIN_TYPES = ['USDT', 'BCH', 'BTC', 'ETH']

  // 实际支持的支付方式
  const ACTUAL_PAYMENT_OPTIONS = [
    {text: '银行卡', value: 'bankcard', icon: 'icon-bankcard'},        // method, 服务端对方法的定义
    {text: '支付宝', value: 'alipay', icon: 'icon-alipay'},
    {text: '微信', value: 'wechat', icon: 'icon-wechat-round'},
  ]

  // 包括"不限"的支付方式
  const PAYMENT_OPTIONS = [
    {text: '不限', value: 'ALL'},
    ...ACTUAL_PAYMENT_OPTIONS,
  ]

  const APPEAL_RESULTS = [
    {text: '取消申诉', value: 'draw'},
    {text: '买方胜诉', value: 'buyer_win'},
    {text: '卖方胜诉', value: 'seller_win'},
  ]

  const ORDER_RESULTS = [
    {text: '已协调双方自行解决', value: 'none'},
    {text: '系统已将币划给买方', value: 'receipt_order'},
    {text: '系统已将冻结的币释放给卖家', value: 'cancel_order'},
  ]

  const VALIDATE_FREQUENCY_OPTIONS = [{
    value: 'never',
    text: '从不二次验证',
    level: 0,
  }, {
    value: 'each_two_hours',
    text: '2小时内不二次验证',
    level: 1,
  }, {
    value: 'each_time',
    text: '每次收款均二次验证',
    level: 2,
  }]
  const APPEAL_STATUS_OPTIONS = [{
    value: 'created', text: '申诉待处理',
  }, {
    value: 'processing', text: '申诉处理中',
  }, {
    value: 'pending', text: '申诉挂起中',
  }, {
    value: 'cancel', text: '已取消申诉',
  }, {
    value: 'completed', text: '申诉已裁决',
  }]

  return {
    COIN_TYPES,
    COIN_TYPE_OPTIONS: COIN_TYPES.map(name => {
      return {
        text: name,
        value: name
      }
    }),
    ACTUAL_PAYMENT_OPTIONS,
    PAYMENT_OPTIONS,
    PAYMENT_TYPES,
    VALIDATE_FREQUENCY_OPTIONS,
    // payment的映射，方便直接找到对应的配置
    PAYMENT_MAP: PAYMENT_OPTIONS.reduce((map, option) => {
      map[option.value] = option
      return map
    }, {}),
    // 支付方式的状态
    PAYMENT_STATUS,
    ORDER_RESULT_MAP: ORDER_RESULTS.reduce((map, option) => {
      map[option.value] = option
      return map
    }, {}),
    APPEAL_RESULT_MAP: APPEAL_RESULTS.reduce((map, option) => {
      map[option.value] = option
      return map
    }, {}),
    APPEAL_STATUS_OPTIONS,
    APPEAL_STATUS_MAP: APPEAL_STATUS_OPTIONS.reduce((map, option) => {
      map[option.value] = option
      return map
    }, {}),
    // 交易需要验证的频率
    VALIDATE_FREQUENCY_MAP: VALIDATE_FREQUENCY_OPTIONS.reduce((map, option) => {
      map[option.value] = option
      return map
    }, {}),
    COUNTERPARTY_LIMIT_OPTIONS: [{
      text: '交易方必须通过手机验证',
      value: 'bind_phone'
    }, {
      text: '交易方必须完成过 1 次交易',
      value: 'one_deal',
    }],

    VERIFY_CODE_TYPE,
    // 验证码的业务类型
    VERIFY_CODE_BUSINESS,

    KYC_STATUS,

    ORDER_STATUS: {
      CREATED: {
        text: '待付款',
        value: 'created',
      },
      PAID: {
        text: '待放币',
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
      PENDING: 'pending',
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

    // 自动回复内容的最大长度
    MAX_AUTO_REPLY_LENGTH,

    // 允许的交易最大最小值的上下限（暂时只针对CNY）
    DEAL_CASH_AMOUNT,
    PLACE_ORDER_ERROR: {
      NO_KYC_LIMIT: 'NO_KYC_LIMIT',
      CANCEL_LIMIT: 'CANCEL_LIMIT',
      PAYMENT_LIMIT: 'PAYMENT_LIMIT',
      BALANCE_LIMIT: 'BALANCE_LIMIT',
    },
  }
}
