import {reportError} from '~/plugins/sentry'

const VALIDATE_CODE_REQUIRED = 10   // 需要输入验证码
const MISSING_PAY_METHODS = 71      // 发广告缺少支付方式
const ATLEAST_ONE_PAYMENT_METHOD = 606    // 最少需要一种支付方式
const REACH_ITEM_COUNT_LIMIT = 106    // 最少需要一种支付方式
const UNAUTHORIZED = 401
const NAME_USED = 72

const ECONNABORTED = 'ECONNABORTED'   // 大部分情况下，是接口超时
// 所有已知错误的map
export const ERROR_CODE = {
  VALIDATE_CODE_REQUIRED,
  MISSING_PAY_METHODS,
  ATLEAST_ONE_PAYMENT_METHOD,
  REACH_ITEM_COUNT_LIMIT,
  UNAUTHORIZED,
  NAME_USED,
}

// code对应的错误信息
export const errorCodeMessageMap = {
  [ECONNABORTED]: '网络连接超时，请刷新页面重试。',
}

/**
 * 在api出错时使用的办通用处理函数。调用位置，要在catch的末尾
 * 已经挂载到了this.axios上，所以要通过this.axios.onError来调用。这里仅做调用
 * @param err
 * @param vm
 */
export function onApiError(err, vm) {
  console.dir(err)
  let { message } = err
  const { response, code } = err // `code`是axios的状态
  if (!response) {
    // http请求失败，没有返回
    message = errorCodeMessageMap[code] || `网络连接失败，请刷新页面重试，code=${code}`
  } else {
    let status = response.status // http状态码
    if (response.data) { // http=200有返回数据的情况
      status = response.data.code // 取服务器返回状态码
    }
    if (status >= 500) {
      message = `系统繁忙，请刷新页面重试，code=${status}`
    } else {
      message = `网络连接失败，请刷新页面重试，code=${status}`
    }
  }
  vm.$showTips && vm.$showTips(message, 'error')
  reportError(err)
}

export class PlaceOrderError extends Error {
  constructor(message, errorType) {
    super(message)
    this.message = message
    this.errorType = errorType
  }
}
