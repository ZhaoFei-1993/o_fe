export default (axios) => {
  return {
    sign(query) {
      return axios.get('/system/leancloud/sign', {
        params: query,
      })
    },
    online(query) { // user_ids: 用户id列表，逗号分隔，1,2,3
      return axios.get('/system/leancloud/online', {
        params: query,
      })
    },
  }
}
