
// 所有已知错误的map
export const ERROR_CODE = {

}

// 由于后台现在错误信息有多语言，因此如果不是特殊情况，前端就不用展示自己的错误信息了
export const errorCodeMessageMap = {
}

// todo:挂载到axios上去
/**
 * 在api出错时使用的办通用处理函数。调用位置，要在catch的末尾
 * @param err
 * @param vm
 * @return {boolean} true，说明被正确处理过了; false说明未知错误
 */
export function onApiError() {
}
