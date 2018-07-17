export default () => {
  const state = {
    otcBalance: null,
    coinexBalance: null,
  }

  const mutations = {
    SET_OTC_BALANCE(state, data) {
      state.otcBalance = data
    },
    SET_COINEX_BALANCE(state, data) {
      state.coinexBalance = data
    },
  }

  const actions = {
    fetchOtcBalance({ commit }) {
      return this.app.axios.balance.otcBalance().then(res => {
        commit('SET_OTC_BALANCE', res.data)
      })
    },
    fetchCoinexBalance({ commit }) {
      return this.app.axios.balance.otcBalance().then(res => {
        commit('SET_COINEX_BALANCE', res.data)
      })
    },
  }

  return {
    state,
    actions,
    mutations,
  }
}
