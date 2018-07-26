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
import constant from '~/modules/constant'
export default () => {
  const initialState = {
    account: null,
    payments: null,       // 用户的支付手段 Array<Payment>
    merchant: null,       // 用户的商家信息
    settings: null,       // 用户的广告设置
    qualification: [],
  }
  const state = Object.assign({}, initialState)

  const getters = {
    paymentEnabled: (state) => {
      return state.payments && state.payments.some((payment) => payment.status === constant.PAYMENT_STATUS.ON)
    }
  }

  const mutations = {
    SET_USER_ACCOUNT(state, {data, constant}) {
      // 根据用户账户，计算用户安全等级
      let securityLevel = 0
      ;['is_have_totp_auth', 'mobile', 'email'].forEach(key => {
        if (data[key]) securityLevel++
      })

      if (data.kyc_status === constant.KYC_STATUS.PASS) securityLevel++
      if (data.login_password_level === constant.PASSWORD_LEVEL.HIGH || data.login_password_level === constant.PASSWORD_LEVEL.MIDDLE) securityLevel++

      data.securityLevel = securityLevel

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
      Object.assign(state, initialState)
    },
  }
  const actions = {
    fetchUserAccount({commit, rootState}) {
      return this.app.axios.user.account().then(data => {
        commit('SET_USER_ACCOUNT', {
          data: data.data,
          constant: rootState.constant
        })
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

          // 这里是在支付方式的管理页面有用到
          if (payment.qr_code_image) {
            payment.qrCodeImage = {
              id: payment.qr_code_image,
              url: payment.qr_code_image_url,
              blob: '',
            }
          }
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
    setUserSettings({commit}, settings) {
      return this.app.axios.user.setSettings(settings).then(res => {
        commit('SET_USER_SETTINGS', settings)
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
    getters,
    actions,
    mutations,
  }
}
