// plugin的配置，引用该组件以和loader共享配置

module.exports = {
  srcRoot: 'src',
  exclude: /node_modules/,
  i18nRoot: 'locales',
  hashLength: 4,
  writeFile: true,
  originalLang: 'zh_Hans_CN',
  targetLangs: ['zh_Hant_HK', 'en_US'],
  regexp: /[\u4e00-\u9fa5]/,
  deprecatedMark: '****DEPRECATED****',
  replacerMap: {
    'vueTemplate': '_vm.$t',
    'vueScript': 'this.$t',
  },
}
