const MISSING_PAY_METHODS = 71      // 发广告缺少支付方式
const ATLEAST_ONE_PAYMENT_METHOD = 606    // 最少需要一种支付方式
const REACH_ITEM_COUNT_LIMIT = 106    // 最少需要一种支付方式
const UNAUTHORIZED = 401
const NAME_USED = 72

const ECONNABORTED = 'ECONNABORTED'   // 大部分情况下，是接口超时
// 所有已知错误的map
export const ERROR_CODE = {
  MISSING_PAY_METHODS,
  ATLEAST_ONE_PAYMENT_METHOD,
  REACH_ITEM_COUNT_LIMIT,
  UNAUTHORIZED,
  NAME_USED,
}

// code对应的错误信息
export const errorCodeMessageMap = {
  [REACH_ITEM_COUNT_LIMIT]: '每个币种每个类型的广告最多只能上架2条',
  [ECONNABORTED]: '接口超时',
}

/**
 * 在api出错时使用的办通用处理函数。调用位置，要在catch的末尾
 * 已经挂载到了this.axios上，所以要通过this.axios.onError来调用。这里仅做调用
 * @param err
 * @param vm
 */
export function onApiError(err, vm) {
  let message = err.message

  // 覆盖默认的错误信息
  if (errorCodeMessageMap[err.code]) {
    message = errorCodeMessageMap[err.code]
  }

  vm.$showTips && vm.$showTips(message, 'error')
}

export class PlaceOrderError extends Error {
  constructor(message, errorType) {
    super(message)
    this.message = message
    this.errorType = errorType
  }
}
