import {
  COIN_TYPES,
} from '~/modules/constant'

export default () => {
  const state = {
    // 这边变量都是通过/constant拉回来的
    fetched: false,             // 下面四个options都是通过同一个接口获得的。
    COIN_TYPES, // 暂时简单的字符串，之后根据后端情况改
  }

  const mutations = {
    SET_CONSTANT(state, constant) {
      state.fetched = true
    },
  }

  const actions = {
    initConstant({commit, state}, req) {
      if (!state.fetched) {
        req && this.app.axios.init(req)
        return this.app.axios.constant.getConstant().then(data => {
          commit('SET_CONSTANT', data)
        })
      }
    },
  }

  return {
    state,
    actions,
    mutations,
  }
}
