export default (axios) => {
  return {
    getTodayRankRank() {
      return axios.get('/mining/rank')
    },

    getAllHistory(query = null) {
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
