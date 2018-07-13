export default (axios) => {
  return {
    async createOrder(payload) {
      return axios.post('/orders', payload)
    },
  }
}
