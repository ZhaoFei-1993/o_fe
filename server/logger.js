const log4js = require('log4js')

let isDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'
const level = isDev ? 'DEBUG' : 'INFO'

let logConfig = {
  pm2: true,
  pm2InstanceVar: 'OTC',
  appenders: {
    console: { type: 'console' }
  },
  categories: { default: { appenders: ['console'], level: level } }
}

// production 发邮件
if (process.env.NODE_ENV === 'production' && process.env.MODE === 'production') {
  logConfig.categories.default.appenders.push('email')
  logConfig.appenders.email = {
    type: 'smtp',
    recipients: 'jingjianfu@viabtc.com,dengshen@viabtc.com',
    subject: 'otc.coinex.com latest log',
    sender: 'alert@viabtc.com',
    attachment: {
      enable: true,
      filename: 'otc.coinex.com-error.log',
      message: 'See the attachment for the latest logs'
    },
    transport: {
      plugin: 'smtp',
      options: {
        host: 'smtp.exmail.qq.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'alert@viabtc.com',
          pass: '4s7%pCDg1hR!'
        }
      }
    },
    html: false,
    sendInterval: 3600
  }
}

log4js.configure(logConfig)
const logger = log4js.getLogger('console')

console.log = console.info = logger.info.bind(logger)
console.error = logger.error.bind(logger)
console.debug = logger.debug.bind(logger)
console.warn = logger.warn.bind(logger)
console.trace = logger.trace.bind(logger)
console.fatal = logger.fatal.bind(logger)

module.exports = logger
