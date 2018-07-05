import cookieParser from '~/plugins/cookies'

export default function ({store, query, error, req, res, replace, hotReload}) {
  if (hotReload) return

  // 从query读取lang并设给cookie，防止跳转后丢lang
  let langs = store.state.lang.locales.map((item) => item.val)

  if (query.lang && (langs.indexOf(query.lang) !== -1)) {
    if (process.client) {
      cookieParser.setItem(window.document, 'lang', query.lang, 30 * 24 * 60 * 60, '/')
    } else {
      res.setHeader('Set-Cookie', `lang=${query.lang}; max-age=${30 * 24 * 60 * 60}`)
    }
  }

  let preferLanguage = 'en_US'
  let cookies = {lang: ''}
  let acceptLanguage = ''

  if (process.SERVER_BUILD) {
    acceptLanguage = req.headers['accept-language']
    preferLanguage = store.state.lang.lang || acceptLanguage || 'en_US'

    const content = req.headers.cookie || ''
    cookies = cookieParser.parse(content)
  } else {
    cookies = cookieParser.parse(document.cookie || '')
    acceptLanguage = store.state.lang.lang || navigator.language || navigator.browserLanguage
  }

  if (acceptLanguage) {
    preferLanguage = acceptLanguage

    if (/cn/i.test(preferLanguage)) {
      preferLanguage = 'zh_Hans_CN'
    } else if (/en/i.test(preferLanguage)) {
      preferLanguage = 'en_US'
    } else if (/hk|tw/i.test(preferLanguage)) {
      preferLanguage = 'zh_Hant_HK'
    } else {
      preferLanguage = 'en_US'
    }
  }

  const lang = query.lang || cookies.lang || preferLanguage

  if (!store.state.lang.locales.find(item => item.val === lang)) {
    return store.dispatch('setLang', 'en_US')
  }

  return store.dispatch('setLang', lang)
}
