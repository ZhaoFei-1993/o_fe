import Vuex from 'vuex'
import createLang from './lang'
import createUser from './user'
import createWebp from './webp'
import createConstant from './constant'

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
    },
  })
}

export default createStore
