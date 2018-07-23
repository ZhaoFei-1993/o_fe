export default (axios) => {
  return {
    createOrder(payload) {
      return axios.post('/orders', payload)
    },
    getOrderList(query) {
      // return Promise.resolve(require('./mock/order').orderList)
      return axios.get('/orders', {
        params: query,
      })
    },
    getOrderById(id) {
      return axios.get(`/orders/${id}`)
    },
    getOrders() {
      return axios.get(`/orders`)
    },
    refreshOrderStatus(id) {
      return axios.get(`/orders/${id}`)
    },
    updatePayMethod(id, method) {
      return axios.post(`/orders/${id}`, {method})
    },
    confirmPay(id) {
      return axios.post(`/orders/${id}/pay`)
    },
    confirmReceipt(id, payload) {
      return axios.post(`/orders/${id}/receipt`, payload)
    },
    appeal(id, title, detail) {
      return axios.post(`/orders/${id}/appeal`, {title, detail})
    },
    getAppeal(id) {
      return axios.get(`/orders/${id}/appeal`)
    },
    submitAppeal(id, title, detail) {
      return axios.post(`/orders/${id}/appeal`, {title, detail})
    },
    cancelAppeal(id) {
      return axios.delete(`/orders/${id}/appeal`)
    },
    cancelOrder(id) {
      return axios.post(`/orders/${id}/cancel`)
    }
  }
}
