import Vue from 'vue'

export default async ({app, store}) => {
  /**
   * 将模板字符串中的占位符用值来代替，支持多参数、对象、数组
   * @example $tt('{0} is {1}', 'name', 'jeff') 多参数情况下，template 以外的参数，从0开始索引
   * @example $$('{key1} is {value1}', {key1: 'name', value1: 'jeff'}) 以对象key来作为索引
   * @example $$('{1} is {0}', ['name', 'jeff']) 数组情况下，以下标作为索引
   * @param template
   * @param args
   */
  Vue.prototype.$tt = function (template, ...args) {
    // 支持多参数、数组、对象
    if (typeof args[0] === 'object') args = args[0]

    return template.replace(/\{(.*?)\}/g, ($0, $1) => {
      let value = args[$1]
      if (typeof value === 'undefined') value = ''

      return value
    })
  }

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
