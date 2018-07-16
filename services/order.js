export default (axios) => {
  return {
    createOrder(payload) {
      return axios.post('/orders', payload)
    },
    getOrderList(query) {
      return Promise.resolve({
        code: 0,
        data: {
          curr_page: 1,
          has_next: false,
          total: 1,
          total_page: 1,
          data: [{
            id: 1000001,
            item_id: 1,
            merchant_id: 1,
            user_id: 1,
            user_side: 'sell',
            merchant_side: 'sell',
            price: '100.00',
            coin_type: 'BCH',
            coin_amount: '1.00000000',
            cash_type: 'CNY',
            cash_amount: '1675463400.001',
            status: 'created',
            appeal_status: '',
            place_time: 1531232482,
            pay_time: 1531232482,
            complete_time: 1531232482,
            appeal_time: 1531232482,
            pay_method: {
              method: 'alipay',
              accouont_no: 'wuyanzu',
              account_name: '吴彦祖',
              bank: '招商银行',
              branch: '深圳支行',
            },
          }, {
            id: 1000002,
            item_id: 1,
            merchant_id: 1,
            user_id: 1,
            user_side: 'sell',
            merchant_side: 'sell',
            price: '100.00',
            coin_type: 'BCH',
            coin_amount: '199.0000',
            cash_type: 'CNY',
            cash_amount: '63400.001',
            status: 'created',
            appeal_status: '',
            place_time: 1531232482,
            pay_time: 1531232482,
            complete_time: 1531232482,
            appeal_time: 1531232482,
            pay_method: {
              method: 'alipay',
              accouont_no: 'wuyanzu',
              account_name: '吴彦祖',
              bank: '招商银行',
              branch: '深圳支行',
            },
          }],
        },
      })
      return axios.get('/orders', query)
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
    confirmReceipt(id) {
      return axios.post(`/orders/${id}/receipt`)
    },
    appeal(id, title, detail) {
      return axios.post(`/orders/${id}/appeal`, {title, detail})
    },
    cancelAppeal(id) {
      return axios.delete(`/orders/${id}/appeal`)
    },
    cancelOrder(id) {
      return axios.delete(`/order/${id}/cancel`)
    }
  }
}
