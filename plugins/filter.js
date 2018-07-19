import Vue from 'vue'
import {getTimeText} from './utils'
export function formatMoney(str) {
  return str.formatMoney(8, '.', ',', true)
}

const filters = {
  formatMoney,
  getTimeText,
}

export default filters

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
