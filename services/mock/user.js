export const otherUser = {
  data: {
    id: 11,
    create_time: Date.now(),
    update_time: Date.now(),
    first_trade_time: Date.now(),
    username: '我的username',
    self_description: '诚信交易，能下单人就是在线的。联系电话：14888888888',
    trade_count_last_30_days: 130,
    trade_count_total: 200,
    average_response_time: 5 * 60,
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
    }, {
      'id': 1,                        // id
      'user_id': 1,                   // 用户id
      'method': 'wechat',             // 支付方式，alipay: 支付宝, wechat: 微信, bankcard: 银行卡
      'accouont_no': 'wuyanzu',       // 账号或银行卡号
      'account_name': '吴彦祖',        // 账户名
      'qr_code_image': '',            // 支付宝或微信收款码图片id
      'bank': '招商银行',              // 银行名
      'branch': '深圳支行',            // 银行支行
      'status': 'on'                  // 状态，on: 已开启, off: 未开启
    }, {
      'id': 1,                        // id
      'user_id': 1,                   // 用户id
      'method': 'bankcard',             // 支付方式，alipay: 支付宝, wechat: 微信, bankcard: 银行卡
      'accouont_no': '333333333333333',       // 账号或银行卡号
      'account_name': '吴彦祖',        // 账户名
      'qr_code_image': '',            // 支付宝或微信收款码图片id
      'bank': '招商银行招商银行招商银行招商银行',              // 银行名
      'branch': '深圳支行深圳支行深圳支行深圳支行深圳支行深圳支行',            // 银行支行
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
