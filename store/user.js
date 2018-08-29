import {PAYMENT_STATUS, KYC_STATUS} from '~/modules/constant'

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
      return state.payments && state.payments.some((payment) => payment.status === PAYMENT_STATUS.ON)
    },
    kycPassed: (state) => {
      return state.account && state.account.kyc_status === KYC_STATUS.ADVANCED_PASS
    }
  }

  const mutations = {
    SET_USER_ACCOUNT(state, {data, constant}) {
      // 根据用户账户，计算用户安全等级
      let securityLevel = 0
      ;['is_have_totp_auth', 'mobile', 'email'].forEach(key => {
        if (data[key]) securityLevel++
      })

      if (data.trade_validate_frequency === constant.VALIDATE_FREQUENCY_MAP.each_time.value || data.trade_validate_frequency === constant.VALIDATE_FREQUENCY_MAP.each_two_hours.value) securityLevel++
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
      data.max_deal_cash_amount = data.max_deal_cash_amount.setDigit(0)
      data.min_deal_cash_amount = data.min_deal_cash_amount.setDigit(0)
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
    signOut({commit, dispatch}) {
      return this.app.axios.user.signOut().then(res => {
        commit('SIGN_OUT')
        return dispatch('chat/logout')
      }).then(() => {
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
