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

export const balance = {
  data: {
    usdt: '100.0',
    eth: '90',
    btc: '0',
    bch: '9999.99'
  }
}

export const userData = {
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
