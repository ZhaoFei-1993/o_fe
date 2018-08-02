/**
 * 根据location参数，生成location的可读格式
 * @param location {countryCode, provinceCode, cityCode}
 * @param countries constant.globalCities
 * @return {*}
 */
export function resolveLocationText(location, countries) {
  if (!countries || !countries.length) return {}

  let country, province, city
  if (location.countryCode) {
    country = countries.find(country => country.code === location.countryCode)

    if (country && country.level2 && location.provinceCode) {
      province = country.level2.find(province => province.code === location.provinceCode)

      if (province && province.level3 && location.cityCode) {
        city = province.level3.find(city => city.code === location.cityCode)
      }
    }
  }
  return {
    country: country,
    province: province,
    city: city,
  }
}

/**
 * 从多语言数据中获取指定的语言信息
 * @param location {cn_name: String, en_name: String, hk_name: String} 多语言源
 * @param lang  {lang: String}  多语言store
 * @return String 最终的多语言文本
 */
export const _translateName = (location, lang) => {
  if (!location) return ''
  let name
  switch (lang.lang) {
    case 'zh_Hans_CN':
      name = location.cn_name
      break
    case 'zh_Hant_HK':
      name = location.hk_name
      break
    case 'en_US':
    default:
      name = location.en_name
  }
  return name || location.name
}

/**
 * 多语言版本的获取地理位置文本
 * @param location
 * @param countries
 * @param lang
 * @return {string}
 */
export function resolveI18nLocationText(location, countries, lang) {
  const loc = resolveLocationText(location, countries)

  return ['country', 'province', 'city'].map(type => _translateName(loc[type], lang)).join(' ').trim()
}
