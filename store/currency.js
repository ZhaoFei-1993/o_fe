
export default () => {
  const state = {
    coinOptions: [{
      text: 'USDT',
      value: 'usdt'
    }, {
      text: 'BCH',
      value: 'bch'
    }, {
      text: 'BTC',
      value: 'btc'
    }, {
      text: 'ETH',
      value: 'eth'
    }, {
      text: 'CET',
      value: 'cet'
    }, {
      text: 'EOS',
      value: 'eos'
    }],
    cashOptions: [{
      text: 'CNY',
      value: 'cny'
    }],
    currentCash: 'cny',
    currentCoinPrices: {
      'usdt': '100.0',
      'eth': '200.0',
      'bch': '300.0',
      'btc': '9999',
    }
    // exchangeRate: {
    //
    // }
  }
  const mutations = {

  }
  const actions = {

  }

  return {
    state,
    actions,
    mutations,
  }
}
