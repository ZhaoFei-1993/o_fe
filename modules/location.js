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
    city: city
  }
}

// todo:这里不单单location用到了，其他地方也用到了，需要迁移到合适的地方
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

// todo: 用这个来代替前面的resolveLocationText
export function resolveI18nLocationText(location, countries, lang) {
  const loc = resolveLocationText(location, countries)

  return ['country', 'province', 'city'].map(type => _translateName(loc[type], lang)).join(' ').trim()
}
