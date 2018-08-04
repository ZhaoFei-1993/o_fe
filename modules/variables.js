// 默认都是正式环境的变量
let serverApiDomain = 'http://otc.coinex.com:443/res'
let clientApiDomain = '//otc.coinex.com/res'

let coinexDomain = '//www.coinex.com'       // 尽量不要用coinex，而是用coinexDomain。coinex语义并不明确
const MODE = process.env.MODE || 'production'
// 非正式环境(pre & dev)
if (MODE !== 'production') {
  coinexDomain = '//test2.coinex.com'
}

let loginPage = coinexDomain + '/account/signin'
let signupPage = coinexDomain + '/account/signup'
let webDomain = '//otc.coinex.com'

// pre
if (MODE === 'pre') {
  webDomain = '//test.otc.coinex.com:443'
  clientApiDomain = '//test.otc.coinex.com:443/res'
  serverApiDomain = '//test.otc.coinex.com:443/res'
}

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
  coinexDomain,
  clientApiDomain,
  serverApiDomain,
  loginPage,
  signupPage,
  webDomain,
}
