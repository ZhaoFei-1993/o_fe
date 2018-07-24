// 默认都是正式环境的变量
let serverApiDomain = '//otc.coinex.com/res'
let clientApiDomain = '//otc.coinex.com/res'

let coinex = '//www.coinex.com'
const MODE = process.env.MODE || 'production'
// 非正式环境(pre & dev)
if (MODE !== 'production') {
  coinex = '//test2.coinex.com'
}

let loginPage = coinex + '/account/signin'
let signupPage = coinex + '/account/signup'
let webDomain = '//otc.coinex.com'

// pre
if (MODE === 'pre') {
  webDomain = '//test.otc.coinex.com'
  clientApiDomain = '//test.otc.coinex.com/res'
  serverApiDomain = '//test.otc.coinex.com/res'
}

// 这个配置host到本地nginx之后就可以转发到想用的mock server了(localhost:4006)
if (MODE === 'development') {
  webDomain = '//dev.otc.coinex.com'
  clientApiDomain = '//dev.otc.coinex.com/res'
  serverApiDomain = '//dev.otc.coinex.com/res'
}

const protocol = process.client ? window.location.protocol : 'http:'

webDomain = protocol + webDomain
signupPage = protocol + signupPage
loginPage = protocol + loginPage
serverApiDomain = protocol + serverApiDomain
clientApiDomain = protocol + clientApiDomain

export {
  coinex,
  clientApiDomain,
  serverApiDomain,
  loginPage,
  signupPage,
  webDomain,
}
