import { Realtime } from 'leancloud-realtime'
import AV from 'leancloud-storage'

export default () => {
  const APP_ID = 'OibOYNHFsWoqChdhAlebT7rS-gzGzoHsz'
  const APP_KEY = 'IEIfsx2I6LkRajvtP2jcoCIW'

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
        // const self = this
        return realtime.createIMClient(clientId, {
          // signatureFactory() {
          //   return self.app.axios.chat.sign({
          //     sign_type: 'signin',
          //   }).then(res => {
          //     if (res.code === 0) {
          //       return res.data
          //     }
          //   })
          // },
        }).then(myClient => {
          commit('INIT_CHAT_CLIENT', myClient)
          return myClient
        })
      }
      return state.imClient
    },
  }

  return {
    state,
    actions,
    mutations,
  }
}
