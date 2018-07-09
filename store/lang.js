/**
 * 暂时没用上多语言 jeff 20180705
 * @type {{en_US: string, zh_Hans_CN: string, zh_Hant_HK: string}}
 */
const shortLangMap = {
  'en_US': 'en',
  'zh_Hans_CN': 'cn',
  'zh_Hant_HK': 'hk',
}

export default () => {
  const state = {
    locales: [
      {val: 'en_US', text: 'English'},
      {val: 'zh_Hans_CN', text: '简体中文'},
      {val: 'zh_Hant_HK', text: '繁体中文'},
    ], // available languages
    lang: null,           // en_US格式的lang
    short: '',            // 简略版本的lang，比如en、cn
    i18n: {
      zh_Hans_CN: null,
      zh_Hant_HK: null,
      en_US: null,
    },
  }

  const mutations = {
    SET_LANG(state, lang) {
      state.lang = lang
      state.short = shortLangMap[lang] || 'en'
    },
    SET_I18N(state, {lang, value}) {
      state.i18n[lang] = value
    },
  }

  const actions = {
    setLang({state, commit}, lang) {
      commit('SET_LANG', lang)

      if (!state.i18n[lang]) {
        return import(`~/locales/${lang}.json`).then(data => {
          return commit('SET_I18N', {lang, value: data})
        })
      }
    },
  }

  return {
    state,
    actions,
    mutations,
  }
}
