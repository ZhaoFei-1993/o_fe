const MISSING_PAY_METHODS = 71      // 发广告缺少支付方式
// 所有已知错误的map
export const ERROR_CODE = {
  MISSING_PAY_METHODS,
}

// 由于后台现在错误信息有多语言，因此如果不是特殊情况，前端就不用展示自己的错误信息了
export const errorCodeMessageMap = {
}

/**
 * 在api出错时使用的办通用处理函数。调用位置，要在catch的末尾
 * 已经挂载到了this.axios上，所以要通过this.axios.onError来调用。这里仅做调用
 * @param err
 * @param vm
 */
export function onApiError(err, vm) {
  const message = err.message

  vm.$showTips && vm.$showTips(message, 'error')
}
