import Vuex from 'vuex'
import createLang from './lang'
import createUser from './user'
import createWebp from './webp'
import createBalance from './balance'
import createConstant from './constant'
import createChat from './chat'

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
      balance: createBalance(),
      chat: createChat(),
    },
  })
}

export default createStore
