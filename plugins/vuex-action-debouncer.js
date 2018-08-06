/**
 * 防止同时发出vuex的action（主要是减少网络请求）
 * @param store
 */
export default function ({store}) {
  const dispatchBackup = store.dispatch
  const actionCache = {}

  store.dispatch = function (...args) {
    const [actionName] = args

    if (!actionCache[actionName]) {
      actionCache[actionName] = dispatchBackup.apply(store, args).then(data => {
        delete actionCache[actionName]
        return data
      })
    }

    return actionCache[actionName]
  }
}
