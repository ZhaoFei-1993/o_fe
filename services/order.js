export default (axios) => {
  return {
    createOrder(payload) {
      return axios.post('/orders', payload)
    },
    getOrderById(id) {
      return axios.get(`/orders/${id}`)
    },
    refreshOrderStatus(id) {
      return axios.get(`/orders/${id}`)
    }
  }
}
