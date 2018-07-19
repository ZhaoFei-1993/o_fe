import Vue from 'vue'

export function formatMoney(str) {
  return String(str).formatMoney(8, '.', ',', true)
}

const filters = {
  formatMoney,
}

export default filters

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
