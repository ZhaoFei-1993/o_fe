// 杂七杂八的接口
export default (axios) => {
  return {
    /**
     * 发短信验证码
     * @param smsType
     * @param isVoice
     */
    async sendSmsCode(smsType, isVoice) {
      // return Promise.resolve({data: {}, code: 0})
      return axios.get('/user/sms', {
        params: {
          sms_type: smsType,
          is_voice: isVoice ? 1 : 0
        }
      })
    },
    /**
     * 发邮件验证码
     * @param emailType
     */
    async sendEmailCode(emailType) {
      // return Promise.resolve({data: {}, code: 0})
      return axios.get('/user/email/code', {
        params: {
          email_type: emailType,
        }
      })
    },

    async systemConstant() {
      // return Promise.resolve(require('./mock/misc').constant)
      return axios.get('/system/constant')
    },

    upload(file) {
      const fd = new FormData()
      fd.append('my_file', file)

      return axios.post('/user/file', fd, {
        timeout: 20000,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
  }
}
