import Vue from 'vue'
import {getTimeText} from './utils'
export function formatMoney(str) {
  return String(str).formatMoney(8, '.', ',', true)
}

const filters = {
  formatMoney,
  getTimeText,
  percentage(num) {
    return (num * 100 + '').round(2) + '%'
  }
}

export default filters

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
