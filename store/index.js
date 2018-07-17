import Vuex from 'vuex'
import createLang from './lang'
import createUser from './user'
import createWebp from './webp'
import createBalance from './balance'
import createConstant from './constant'
import createCurrency from './currency'

const createStore = () => {
  return new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
      lang: createLang(),
      user: createUser(),
      webp: createWebp(),
      constant: createConstant(),
      currency: createCurrency(),
      balance: createBalance(),
    },
  })
}

export default createStore
