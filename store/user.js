export default () => {
  const state = {
    account: null,
    payments: null,       // 用户的支付手段
    balance: null,        // todo:balance需要重新设计
    merchant: null,       // 用户的商家信息
    settings: null,       // 用户的广告设置
  }
  const mutations = {
    SET_USER_ACCOUNT(state, data) {
      state.account = data
    },
    SET_USER_PAYMENTS(state, data) {
      state.payments = data
    },
    SET_USER_BALANCE(state, data) {
      state.balance = data
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
  }
  const actions = {
    fetchUserAccount({commit}) {
      return this.app.axios.user.account().then(data => {
        commit('SET_USER_ACCOUNT', data.data)
      })
    },
    fetchUserPayments({commit}) {
      return this.app.axios.user.payments().then(data => {
        commit('SET_USER_PAYMENTS', data.data)
      })
    },
    fetchUserBalance({commit, state, rootState}) {
      return this.app.axios.user.balance().then(data => {
        commit('SET_USER_BALANCE', data.data)
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
  }

  return {
    state,
    actions,
    mutations,
  }
}
