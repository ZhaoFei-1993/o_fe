export default (axios) => {
  return {
    async getItems(params) {
      return axios.get('/items', {
        params: params,
      })
    },

    async createItem(item) {
      // return Promise.resolve({ data: 0, code: 0 })
      return axios.post('/items', item)
    },

    async updateItem(item) {
      return axios.put(`/items/${item.id}`, item)
    },
    async updateAndOnlineItem(item) {
      return axios.put(`/items/${item.id}`, item).then(() => {
        return axios.post(`/items/${item.id}/on`, {
          'coin_amount': item.coin_amount                        // 币量
        })
      })
    },

    /**
     * 获取我的广告列表
     * @param {ITEM_STATUS} status
     */
    async userItems(params) {
      // return Promise.resolve(require('./mock/item').userItems)
      return axios.get('/items/mine', {
        params
      })
    },

    /**
     * 下架广告
     * @param id
     */
    async offline(id) {
      return axios.post(`/items/${id}/off`)
    },

    async online(id, amount) {
      return axios.post(`/items/${id}/on`, {
        'coin_amount': amount                        // 币量
      })
    },
    async delete(id) {
      return axios.delete(`/items/${id}`)
    }
  }
}
