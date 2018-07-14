// 杂七杂八的接口
export default (axios) => {
  return {
    async sendSmsCode() {
      return Promise.resolve({data: {}, code: 0})
      return axios.post('/orders')
    },
    async sendEmailCode() {
      return Promise.resolve({data: {}, code: 0})
      return axios.post('/orders')
    },
  }
}
