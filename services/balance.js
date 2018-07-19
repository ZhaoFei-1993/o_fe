export default (axios) => {
  return {
    otcBalance() {
      // return Promise.resolve(require('./mock/balance').otcBalance)
      return axios.get('/balance/otc')
    },

    coinexBalance() {
      // return Promise.resolve(require('./mock/balance').coinexBalance)
      return axios.get('/balance/coinex')
    },

    otc2coinex(data) {
      return axios.post('/balance/otc2coinex', data)
    },

    coinex2otc(data) {
      return axios.post('/balance/coinex2otc', data)
    },

    history(query) {
      // return Promise.resolve(require('./mock/balance').history)
      return axios.get('/balance/history', {
        params: query,
      })
    },

    /**
     * 获取汇率
     */
    exchangeRate() {
      return Promise.resolve(require('./mock/balance').exchangeRate)
      return axios.get('/system/price')
    }
  }
}
