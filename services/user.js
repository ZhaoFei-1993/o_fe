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

    // todo:balance接口需要重新设计下
    balance() {
      return Promise.resolve(require('./mock/user').balance)
    },

    /**
     * 获取其他用户的信息
     * @param id
     */
    otherUserInfo(id) {
      return Promise.resolve(require('./mock/user').otherUser)
    },
  }
}
