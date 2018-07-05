import {KYC_TYPE} from '~/modules/constant'

export default (axios) => {
  return {
    /**
     * 获取用户自己的信息
     * @param {Number} force 1/0 是否强制从矿池那里获取用户的信息并更新商城的后端缓存。在用户数据比较敏感，如支付的时候需要使用该参数
     * @return {Promise<void>}
     */
    info(force) {
      // return Promise.resolve(require('./mock/user').userData)
      return axios.get('/user', {
        params: {
          is_force_sync: force ? 1 : 0
        }
      })
    }
  }
}
