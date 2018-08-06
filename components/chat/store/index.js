import { Realtime } from 'leancloud-realtime'
import AV from 'leancloud-storage'

const MODE = process.env.MODE || 'production'

export default () => {
  let APP_ID = 'XXfwCSLsOXhw0p44dq8f8R43-9Nh9j0Va' // 华东测试key
  let APP_KEY = 'upNarPTHhl0i2aYNnFrVvvb4'
  if (MODE === 'production') {
    APP_ID = 'yeIzHy3DnjcFwsBXWg61onrU-gzGzoHsz' // 正式key
    APP_KEY = '3ncyYb7rdSog1Yyvj0UVwydU'
  }

  const state = {
    imClient: null, // leancloud实时通讯实例
  }

  const mutations = {
    INIT_CHAT_CLIENT(state, data) {
      if (!state.imClient) {
        AV.init(APP_ID, APP_KEY) // 初始化leancloud云存储
        state.imClient = data
      }
    },
  }

  const actions = {
    newChatClient({ commit, state }, clientId) {
      if (!state.imClient) {
        const realtime = new Realtime({
          appId: APP_ID,
          appKey: APP_KEY,
        })
        const self = this
        return realtime.createIMClient(clientId, {
          signatureFactory() {
            return self.app.axios.chat.sign({
              sign_type: 'signin',
            }).then(res => {
              if (res.code === 0) {
                return res.data
              }
            })
          },
        }).then(myClient => {
          commit('INIT_CHAT_CLIENT', myClient)
          return Promise.resolve(myClient)
        }).catch(err => {
          return Promise.reject(err)
        })
      }
      return state.imClient
    },

    logout({ state }) {
      return state.imClient.close()
    },
  }

  return {
    namespaced: true,
    state,
    actions,
    mutations,
  }
}
