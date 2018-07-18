import Vue from 'vue'

export function formatMoney(str) {
  return str.formatMoney(8, '.', ',', true)
}
export function localTime(date) {
  return (new Date(date)).toLocaleString()
}

const filters = {
  formatMoney,
  localTime,
}

export default filters

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
