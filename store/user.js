// payments的结构定义
// interface Payment = {
//   'id': 1,                        // id
//   'user_id': 1,                   // 用户id
//   'method': 'alipay',             // 支付方式，alipay: 支付宝, wechat: 微信, bankcard: 银行卡
//   'accouont_no': 'wuyanzu',       // 账号或银行卡号
//   'account_name': '吴彦祖',        // 账户名
//   'qr_code_image': '',            // 支付宝或微信收款码图片id
//   'bank': '招商银行',              // 银行名
//   'branch': '深圳支行',            // 银行支行
//   'status': 'on',                  // 状态，on: 已开启, off: 未开启
//   title: '银行卡',
//   icon: 'icon-bankcard'
// }
export default () => {
  const initialState = {
    account: null,
    payments: null,       // 用户的支付手段 Array<Payment>
    balance: null,        // todo:balance需要重新设计
    merchant: null,       // 用户的商家信息
    settings: null,       // 用户的广告设置
  }
  const state = Object.assign({}, initialState)
  const mutations = {
    SET_USER_ACCOUNT(state, data) {
      state.account = data
    },
    SET_USER_PAYMENTS(state, data) {
      state.payments = data
    },
    SET_USER_MERCHANT(state, data) {
      state.merchant = data
    },
    SET_USER_SETTINGS(state, data) {
      state.settings = data
    },
    SET_USER_QUALIFICATION(state, data) {
      state.qualification = data
    },
    SIGN_OUT(state) {
      // 恢复初始状态
      Object.keys(state).forEach(key => {
        state[key] = initialState[key]
      })
    },
  }
  const actions = {
    fetchUserAccount({commit}) {
      return this.app.axios.user.account().then(data => {
        commit('SET_USER_ACCOUNT', data.data)
      })
    },
    fetchUserPayments({commit, state, rootState}) {
      return this.app.axios.user.payments().then(data => {
        // 将服务器返回的payments数据丰富化
        data.data.forEach(payment => {
          const paymentOption = rootState.constant.PAYMENT_MAP[payment.method]
          payment.title = paymentOption.text
          payment.icon = paymentOption.icon
          payment.isActive = paymentOption.status === rootState.constant.PAYMENT_STATUS.ON
        })
        commit('SET_USER_PAYMENTS', data.data)
      })
    },
    fetchUserMerchant({commit, state, rootState}) {
      return this.app.axios.user.merchant().then(data => {
        commit('SET_USER_MERCHANT', data.data)
      })
    },
    fetchUserSettings({commit, state, rootState}) {
      return this.app.axios.user.settings().then(data => {
        commit('SET_USER_SETTINGS', data.data)
      })
    },
    fetchUserQualification({commit, state, rootState}) {
      return this.app.axios.user.qualification().then(data => {
        commit('SET_USER_QUALIFICATION', data.data)
      })
    },
    signOut({commit}) {
      return this.app.axios.user.signOut().then(res => {
        commit('SIGN_OUT')
        this.$router.push('/')
      })
    },
  }

  return {
    state,
    actions,
    mutations,
  }
}
