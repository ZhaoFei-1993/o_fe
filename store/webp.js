export default () => {
  const state = {
    support: false,
  }
  const mutations = {
    SET_WEBP(state, data) {
      state.support = data
    },
  }

  return {
    state,
    mutations,
  }
}
