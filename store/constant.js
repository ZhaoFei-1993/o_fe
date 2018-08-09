import getConstant from '~/modules/constant'
import {ERROR_CODE} from '~/modules/error-code'
import * as variables from '~/modules/variables'

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

// 没有翻译过的常量，在header.vue里面会重设一次，改成带翻译的常量
const defaultConstant = getConstant()

export default () => {
  const state = {
    ...defaultConstant,
    ...variables,
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
    SET_CONSTANT(state, data) {
      Object.assign(state, data)
    }
  }

  const actions = {
    fetchSystemConstant({commit, state, rootState}) {
      return this.app.axios.misc.systemConstant().then(data => {
        commit('SET_BANK_OPTIONS', list2Options(data.data.bank))
        commit('SET_APPEAL_OPTION', list2Options(data.data.appeal_reason))
        commit('SET_CANCEL_MERCHANT_REASON_OPTIONS', list2Options(data.data.merchant_auth_cancel_reason))
      })
    },
    /**
     * 设置constant的多语言版本
     * @param commit
     */
    setConstantI18n({commit}) {
      commit('SET_CONSTANT', getConstant(this.app.$t))
    }
  }

  return {
    state,
    actions,
    mutations,
  }
}
