export default (axios) => {
  return {
    /**
     * 获取用户自己的信息
     * @return {Promise<void>}
     */
    userInfo() {
      return Promise.resolve(require('./mock/user').userData)
      return axios.get('/user', {
        params: {
        },
      })
    },

    /**
     * 获取其他用户的信息
     * @param id
     */
    otherUserInfo(id) {
      return Promise.resolve(require('./mock/user').otherUser)
    },

    balance() {
      return Promise.resolve(require('./mock/user').balance)
    }
  }
}
