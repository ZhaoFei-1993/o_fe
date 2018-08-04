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

    announcements() {
      // return Promise.resolve(require('./mock/misc').announcements)
      // https://static.coinex.com/viaconfig/otc-frontend/announcements/endpoint.json
      // 实际上最好用上面的cdn链接，但是因为cdn的header需要配置，不然会有跨域问题，所以只能暂时用s3的源链接了（s3已经配置了跨域头）
      return Promise.resolve(
        {
          'announcements': [{
            'title': '场外交易（OTC）隆重上线 交易、发布广告限时零费率',
            'href': 'https://support.coinex.com/hc/zh-cn/articles/360007646574'
          }]
        })
    }
  }
}
