export default (axios) => {
  return {
    sign(query) {
      return axios.get('/system/leancloud/sign', {
        params: query,
      })
    },
  }
}
