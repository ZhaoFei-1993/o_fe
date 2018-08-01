import Vue from 'vue'
import { getTimeText, formatDuration } from './utils'

export function formatMoney(str = '') {
  return `${str}`.formatMoney(8, '.', ',', true)
}

export function percentage(num) {
  return `${num * 100}`.round(2) + '%'
}

export function splitCardNumber(num) { // 按照四位来分割银行卡号
  return `${num}`.replace(/(\d{4}(?!\s))/g, '$1 ')
}

const filters = {
  formatMoney,
  getTimeText,
  percentage,
  formatDuration,
  splitCardNumber,
}

export default filters

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.mixin({
  methods: {
    formatMoney
  }
})
