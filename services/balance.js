export default (axios) => {
  return {
    otcBalance() {
      return Promise.resolve({
        code: 0,
        data: [{
          coin_type: 'BTC',
          available: '1113452111.00042442',
          frozen: '342354.44543544',
          total: '34265543.4532',
        }, {
          coin_type: 'BCH',
          available: '1113452111.00042442',
          frozen: '342354.44543544',
          total: '1546453',
        }, {
          coin_type: 'CET',
          available: '1113452111.00042442',
          frozen: '342354.44543544',
          total: '34216543',
        }]
      })
      return axios.get('/balance/otc')
    },

    coinexBalance() {
      return Promise.resolve({
        code: 0,
        data: [{
          coin_type: 'BTC',
          available: '1113452111.00042442',
          frozen: '342354.44543544',
          total: '34265543.4532',
        }, {
          coin_type: 'BCH',
          available: '1113452111.00042442',
          frozen: '342354.44543544',
          total: '1546453',
        }, {
          coin_type: 'CET',
          available: '1113452111.00042442',
          frozen: '342354.44543544',
          total: '34216543',
        }]
      })
      return axios.get('/balance/coinex')
    },

    otc2coinex(data) {
      return axios.post('/balance/otc2coinex', data)
    },

    coinex2otc(data) {
      return axios.post('/balance/coinex2otc', data)
    },

    history(query) {
      return Promise.resolve({
        code: 0,
        data: {
          curr_page: 1,
          has_next: false,
          total: 4,
          total_page: 1,
          data: [{
            coin_type: 'CET',
            amount: '-100.00000000',
            operation_type: 'freeze',
            business_type: 'order_succeed',
            available: '1113452111.00042442',
            frozen: '342354.44543544',
            total: '34216543',
            create_time: 1531232482,
          }, {
            coin_type: 'CET',
            amount: '-100.00000000',
            operation_type: 'unfreeze',
            business_type: 'order_succeed',
            available: '1113452111.00042442',
            frozen: '342354.44543544',
            total: '34216543',
            create_time: 1531232482,
          }, {
            coin_type: 'CET',
            amount: '-100.00000000',
            operation_type: 'increase',
            business_type: 'cancel_order',
            available: '1113452111.00042442',
            frozen: '342354.44543544',
            total: '34216543',
            create_time: 1531232482,
          }, {
            coin_type: 'CET',
            amount: '-16453600.00000000',
            operation_type: 'deduct_freeze',
            business_type: 'place_order',
            available: '1113452111.00042442',
            frozen: '342354.44543544',
            total: '34216543',
            create_time: 1531232482,
          }],
        },
      })
      return axios.get('/balance/history', {
        data: query,
      })
    },
  }
}
