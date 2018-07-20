import CONSTSANTS from '~/modules/constant'
import {ERROR_CODE} from '~/modules/error-code'

/**
 * 将后台给的列表转化为options格式，方便组件使用
 * @param {Array<{key:String, name:String}>} data
 * @return {Array<{text:String, value: String}>}
 */
function list2Options(data) {
  return data.map(item => {
    return {
      text: item.name,
      value: item.key
    }
  })
}

export default () => {
  const state = {
    ...CONSTSANTS,
    ERROR_CODE,
    bankOptions: [],                    // 银行列表
    appealReasonOptions: [],            // 申诉原因列表
    cancelMerchantReasonOptions: [],    // 取消商家身份原因列表
  }

  const mutations = {
    SET_BANK_OPTIONS(state, data) {
      state.bankOptions = data
    },
    SET_APPEAL_OPTION(state, data) {
      state.appealReasonOptions = data
    },
    SET_CANCEL_MERCHANT_REASON_OPTIONS(state, data) {
      state.cancelMerchantReasonOptions = data
    },

  }

  const actions = {
    fetchSystemConstant({commit, state, rootState}) {
      return this.app.axios.misc.systemConstant().then(data => {
        commit('SET_BANK_OPTIONS', list2Options(data.data.bank))
        commit('SET_APPEAL_OPTION', list2Options(data.data.appeal_reason))
        commit('SET_CANCEL_MERCHANT_REASON_OPTIONS', list2Options(data.data.merchant_auth_cancel_reason))
      })
    }
  }

  return {
    state,
    actions,
    mutations,
  }
}
