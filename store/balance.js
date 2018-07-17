export default () => {
  const state = {
    otcBalance: null,       // 数组形式的balance
    coinexBalance: null,
    otcMap: null,           // 键值对形式的balance
    coinexMap: null,
    currentCash: 'CNY',     // 当前的定价货币（法币）
    allRate: null,             // 汇率
    currentRate: null,      // 当前法币对应的汇率
  }

  const mutations = {
    SET_OTC_BALANCE(state, data) {
      state.otcBalance = data

      state.otcMap = data.reduce((reduced, coin) => {
        reduced[coin.coin_type] = coin
        return reduced
      }, {})
    },
    SET_COINEX_BALANCE(state, data) {
      state.coinexBalance = data

      // 同时生成 key => value 的映射
      state.coinexMap = data.reduce((reduced, coin) => {
        reduced[coin.coin_type] = coin
        return reduced
      }, {})
    },

    SET_EXCHANGE_RATE(state, data) {
      state.allRate = data
      state.currentRate = data[state.currentCash]
    }
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
    fetchExchangeRate({commit}) {
      return this.app.axios.balance.exchangeRate().then(res => {
        commit('SET_EXCHANGE_RATE', res.data)
      })
    }
  }

  return {
    state,
    actions,
    mutations,
  }
}
