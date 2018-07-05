export default function ({ store, query, error, req, replace, hotReload }) {
  if (process.SERVER_BUILD) {
    var accept = req.headers['accept']
    if (/html/i.test(accept) && /webp/i.test(accept)) {
      store.commit('SET_WEBP', true)
    }
  }
}
