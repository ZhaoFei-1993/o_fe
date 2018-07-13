import {
  COIN_TYPES,
  PAYMENT_OPTIONS,
  COUNTERPARTY_LIMIT_OPTIONS,
  KYC_STATUS_PASS,
} from '~/modules/constant'

export default () => {
  const state = {
    PRICING_TYPE: {
      FLOAT: 'float',
      FIXED: 'fixed'
    },
    COIN_TYPES, // 暂时简单的字符串，之后根据后端情况改
    PAYMENT_OPTIONS,
    COUNTERPARTY_LIMIT_OPTIONS,
    KYC_STATUS_PASS,
  }

  const mutations = {

  }

  const actions = {

  }

  return {
    state,
    actions,
    mutations,
  }
}
