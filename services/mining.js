export default (axios) => {
  return {
    getRank() {
      return axios.get('/mining/rank')
    },

    getHistory(query = null) {
      return axios.get('/mining/history', {
        params: query,
      })
    },

    getMyRank() {
      return axios.get('/mining/rank/my')
    },

    getMyHistory(query = null) {
      return axios.get('/mining/history/my', {
        params: query,
      })
    },

  }
}
