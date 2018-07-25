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
        state.imClient = data
      }
    },
  }

  const actions = {
    newChatClient({ commit }, clientId) {
      console.log(clientId)
      AV.init(APP_ID, APP_KEY) // 初始化leancloud云存储
      const realtime = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
      })
      realtime.createIMClient(clientId).then(myClient => {
        commit('INIT_CHAT_CLIENT', myClient)
      })
    },
  }

  return {
    state,
    actions,
    mutations,
  }
}
