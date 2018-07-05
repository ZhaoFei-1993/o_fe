import Vuex from 'vuex'
import createLang from './lang'
import createUser from './user'
import createWebp from './webp'

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
    }
  })
}

export default createStore
