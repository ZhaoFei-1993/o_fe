export default (axios) => {
  return {
    async getItems(params) {
      return axios.get('/items', {
        params: params,
      })
    },
    async createItem(item) {
      return Promise.resolve({ data: 0, code: 0 })
      return axios.post('/items', {
        'side': item.side,                               // 方向 buy/sell
        'coin_type': item.coin_type,                          // 币种
        'cash_type': item.cash_type,                          // 法币类型
        'pricing_type': item.pricing_type,                     // 定价方式 fixed/float
        'float_rate': item.float_rate,                       // 浮动比例, float定价类型必填
        'price_limit': item.price_limit,                     // 价格限制, float定价类型必填
        'price': item.price,                             // 单价，fixed定价类型必填
        'coin_amount': item.coin_amount,                       // 币量
        'counterparty_limit': item.counterparty_limit,
        'max_deal_cash_amount': item.max_deal_cash_amount,           // 最大成交额
        'min_deal_cash_amount': item.min_deal_cash_amount,           // 最小成交额
        'auto_reply_content': item.auto_reply_content,                     // 自动回复内容
      })
    },
  }
}
