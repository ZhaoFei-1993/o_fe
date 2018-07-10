export default () => {
  const state = {
    data: null,
    balance: null,
  }
  const mutations = {
    SET_USER_BALANCE(state, data) {
      state.balance = data
    }
  }
  const actions = {
    setUserBalance({commit, state, rootState}) {
      return this.app.axios.user.balance().then(data => {
        commit('SET_USER_BALANCE', data.data)
      })
    }
  }

  return {
    state,
    actions,
    mutations,
  }
}
