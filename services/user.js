export default (axios) => {
  return {
    /**
     * 获取用户自己的信息
     * @return {Promise<void>}
     */
    account() {
      // return Promise.resolve(require('./mock/user').account)
      return axios.get('/user/account')
    },

    /**
     * 用户支付方式
     * @return {Promise<any>}
     */
    payments() {
      // return Promise.resolve(require('./mock/user').paymentMethods)
      return axios.get('/user/payment/method')
    },

    merchant() {
      // return Promise.resolve(require('./mock/user').merchant)
      return axios.get('/user/merchant')
    },

    /**
     * 申请成为商家
     * @param wechat
     * @return {*}
     */
    applyMerchant({wechat}) {
      // require('./mock/user').merchant.data.status = 'created'
      // return Promise.resolve(require('./mock/user').merchant)
      return axios.post('/user/merchant', {
        wechat
      })
    },

    /**
     * 根据参数不同，可用于取消商家认证申请(还未成为商家)、取消商家身份(已经成为商家)
     * 暂时后台只做了取消认证申请 jeff 20180716
     */
    cancelMerchant() {
      // require('./mock/user').merchant.data.status = 'cancel'
      // return Promise.resolve({data: {}, code: 0})
      return axios.delete('/user/merchant')
    },

    /**
     * 更改用户的接单状态
     * @param bool
     */
    changeMerchantAvailable(bool) {
      // return Promise.resolve({data: {}, code: 0})
      return axios.post('/user/merchant/enable', {
        'is_available': bool
      })
    },
    settings() {
      // return Promise.resolve(require('./mock/user').settings)
      return axios.get('/user/settings')
    },

    qualification() {
      return axios.get('/user/qualification')
    },

    setSettings() {
      // return Promise.resolve(require('./mock/user').settings)
      return axios.get('/user/settings')
    },
    signOut() {
      return axios.post('/user/sign/out')
    },

    /**
     * 更改payment开启、关闭状态
     * @param id
     * @param status 'on' 'off' 开启/关闭
     */
    changePaymentStatus(id, status) {
      // return Promise.resolve({data: {}, code: 0})
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
      // 测试环境用的代码
      // const payments = require('./mock/user').paymentMethods.data
      // payment.status = 'on'
      // payments.push(payment)
      // return Promise.resolve({data: {}, code: 0})

      return axios.post(`/user/payment/method`, payment)
    },

    /**
     * 更新payment
     * @param payment
     * @return {*}
     */
    updatePaymentMethod(payment) {
      // const payments = require('./mock/user').paymentMethods.data
      // payments.forEach(item => {
      //   if (item.id === payment.id) Object.assign(item, payment)
      // })
      // return Promise.resolve({data: {}, code: 0})
      return axios.put(`/user/payment/method/${payment.id}`, payment)
    },

    /**
     * 确认用户昵称
     * @param name
     * @return {*}
     */
    updateName(name) {
      return axios.patch(`/user/account`, {name})
    },

    dynamicConstraint() {
      return axios.get('/user/today/limit')
    },

    /**
     * 获取其他用户的信息
     * @param id
     */
    otherUserInfo(id) {
      return axios.get(`/users/${id}`)
      // return Promise.resolve(require('./mock/user').otherUser)
    },
  }
}
