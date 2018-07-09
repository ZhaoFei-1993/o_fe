import Vue from 'vue'

export default async ({app, store}) => {
  Vue.prototype.$t = function (key, lang) {
    const state = store.state.lang
    const keys = key.split('.')
    lang = lang || state.lang
    let value = store.state.lang.i18n[lang]
    try {
      keys.forEach((k, index) => {
        if (k && k.length) {
          value = value[k]
        }
      })
    } catch (e) {
      return keys[keys.length - 1]
    }
    return value || keys[keys.length - 1]
  }
  app.$t = Vue.prototype.$t

  if (process.client) {
    window.$t_i18n = app.$t
  } else {
    global.$t_i18n = app.$t
  }

  return app.$t
}
