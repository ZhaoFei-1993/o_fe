import {
  COIN_TYPES,
  PAYMENT_OPTIONS,
  PAYMENT_STATUS,
  PAYMENT_MAP,
  PAYMENT_TYPES,
  COUNTERPARTY_LIMIT_OPTIONS,
  KYC_STATUS_PASS,
  VERIFY_CODE_TYPE,
} from '~/modules/constant'

export default () => {
  const state = {
    PRICING_TYPE: {
      FLOAT: 'float',
      FIXED: 'fixed'
    },
    COIN_TYPES, // 暂时简单的字符串，之后根据后端情况改
    PAYMENT_OPTIONS,
    PAYMENT_STATUS,
    PAYMENT_MAP,
    PAYMENT_TYPES,
    COUNTERPARTY_LIMIT_OPTIONS,
    KYC_STATUS_PASS,
    VERIFY_CODE_TYPE,
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
