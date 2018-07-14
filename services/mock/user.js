import faker from 'faker'

export const otherUser = {
  data: {
    id: 11,
    create_time: Date.now(),
    update_time: Date.now(),
    first_trade_time: Date.now(),
    name: '我的username',
    self_description: '诚信交易，能下单人就是在线的。联系电话：14888888888',
    trade_count_last_30_days: 130,
    trade_count_total: 200,
    average_response_time: 5 * 60,
    recent_deal_count: 100,
    recent_order_count: 200,
    average_pay_time: 100,
    average_release_time: 200,
    email_verified: false,
    phone_verified: true,
    idcard_verified: false,
  },
  code: 0
}

export const account = {
  data: {
    'id': 1,                         // 用户id
    'name': 'wuyanzu',               // 用户名
    'email': '25479932@qq.com',      // 邮箱
    'country_code': '86',            // 手机号国家区号
    'mobile': '12345678900',         // 手机号
    'kyc_status': 'yes',             // kyc实名状态, yes: 已通过，no: 未通过
    'kyc_name': '吴彦祖',             // kyc实名姓名
    'is_have_totp_auth': true,       // 是否绑定谷歌验证器
    'status': 'normal'               // 账户状态，normal: 正常，forbidden: 封禁
  }
}

export const payments = {
  data: {
    data: [{
      'id': 1,                        // id
      'user_id': 1,                   // 用户id
      'method': 'alipay',             // 支付方式，alipay: 支付宝, wechat: 微信, bankcard: 银行卡
      'accouont_no': 'wuyanzu',       // 账号或银行卡号
      'account_name': '吴彦祖',        // 账户名
      'qr_code_image': '',            // 支付宝或微信收款码图片id
      'bank': '招商银行',              // 银行名
      'branch': '深圳支行',            // 银行支行
      'status': 'on'                  // 状态，on: 已开启, off: 未开启
    }]
  }
}

export const merchant = {
  data: {
    'user_id': 1,                           // 用户id
    'wechat': 'wuyanzu',                    // 微信号
    'guaranty_amount': '10000.00000000',    // 已缴纳保证金，单位CET
    'is_online': true,                      // 是否在线
    'is_available': true,                   // 是否接受交易
    'status': 'yes',                        // 认证状态 created: 已提交, yes: 已通过, no: 未通过, cancel: 已取消
    'auth_time': 1531232482
  }
}

export const settings = {
  data: {
    'user_id': 1,                           // 用户id
    'min_deal_cash_amount': '1000.00',      // 最小交易限额
    'max_deal_cash_amount': '100.00',       // 最大交易限额
    'auto_reply_content': '自动回复的内容123456',               // 自动回复内容
    'counterparty_limit': [0, 1, 2],        // 交易限制, 0: 绑定手机号, 1: kyc实名, 2: 成交过一笔订单
  }
}

export const balance = {
  data: {
    usdt: '100.0',
    eth: '90',
    btc: '0',
    bch: '9999.99'
  }
}

export const constraint = {
  data: {
    cancel: faker.random.boolean(),
    kfc_time: faker.random.boolean(),
  }
}

export const qualification = {
  data: ['bind_phone', 'kyc', 'one_deal']
}

export const userData = {
  data: {
    username: 'Wruce Wayne',
    recent_deal_count: 100,
    recent_order_count: 200,
    average_pay_time: 100,
    average_release_time: 200,
  }
}

export const otcBalance = {
  data: [
    {
      'coin_type': 'BTC',             // 币种
      'available': '100.00000000',    // 可用余额
      'frozen': '20.00000000',        // 冻结中余额
      'total': '80.00000000'          // 总余额
    },
  ]
}

export const coinexBalance = {
  data: [
    {
      'coin_type': 'BTC',             // 币种
      'available': '100.00000000',    // 可用余额
      'frozen': '20.00000000',        // 冻结中余额
      'total': '80.00000000'          // 总余额
    },
  ]
}

export const paymentMethods = {
  data: [{
    'method': 'alipay',             // 支付方式，alipay: 支付宝, wechat: 微信, bankcard: 银行卡
    'account_no': 'wuyanzu',       // 账号或银行卡号
    'account_name': '吴彦祖',        // 账户名
    'qr_code_image': 'data:image/png;base64,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',            // 支付宝或微信收款码图片id
    'bank': '',              // 银行名
    'branch': '',            // 银行支行
    'status': 'on',                 // 状态，on: 已开启, off: 未开启
  }, {
    'method': 'bankcard',             // 支付方式，alipay: 支付宝, wechat: 微信, bankcard: 银行卡
    'account_no': '1234567890978675645',       // 账号或银行卡号
    'account_name': '吴孟达',        // 账户名
    'qr_code_image': '',
    'bank': '招商银行',              // 银行名
    'branch': '深圳支行',            // 银行支行
    'status': 'on',                 // 状态，on: 已开启, off: 未开启
  }, {
    'method': 'wechat',             // 支付方式，alipay: 支付宝, wechat: 微信, bankcard: 银行卡
    'account_no': '1234567890978675645',       // 账号或银行卡号
    'account_name': '吴孟达',        // 账户名
    'qr_code_image': 'data:image/png;base64,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',            // 支付宝或微信收款码图片id
    'bank': '',              // 银行名
    'branch': '',            // 银行支行
    'status': 'on',                 // 状态，on: 已开启, off: 未开启
  }]
}
