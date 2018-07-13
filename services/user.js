export default (axios) => {
  return {
    /**
     * 获取用户自己的信息
     * @return {Promise<void>}
     */
    account() {
      return Promise.resolve(require('./mock/user').account)
      return axios.get('/user/account')
    },

    payments() {
      return Promise.resolve(require('./mock/user').payments)
      return axios.get('/user/payment/method')
    },

    merchant() {
      return Promise.resolve(require('./mock/user').merchant)
      return axios.get('/user/merchant')
    },

    settings() {
      return Promise.resolve(require('./mock/user').settings)
      return axios.get('/user/settings')
    },

    setSettings() {
      return Promise.resolve(require('./mock/user').settings)
      return axios.get('/user/settings')
    },

    /**
     * 更改payment开启、关闭状态
     * @param id
     * @param status 'on' 'off' 开启/关闭
     */
    changePaymentStatus(id, status) {
      return Promise.resolve({data: {}, code: 0})
      return axios.patch(`/user/payment/method/${id}`, {
        status
      })
    },

    /**
     * 增加支付方式
     * @param payment
     * @return {*}
     */
    addPaymentMethod(payment) {
      console.log(payment)
      return Promise.resolve({data: {}, code: 0})
      return axios.patch(`/user/payment/method`, payment)
    },

    // todo:balance接口需要重新设计下
    balance() {
      return Promise.resolve(require('./mock/user').balance)
    },

    /**
     * 获取其他用户的信息
     * @param id
     */
    otherUserInfo(id) {
      return axios.get(`users/${id}`)
      // return Promise.resolve(require('./mock/user').otherUser)
    },

    getUserPaymentMethods(id) {
      return Promise.resolve(require('./mock/user').paymentMethods)
    },
  }
}
