export default (axios) => {
  return {
    async getItems(params) {
      return axios.get('/items', {
        params: params,
      })
    },
  }
}
