// 和业务相关的一些辅助函数
import Vue from 'vue'

const helpers = {
  /**
   * 计算广告的下单限制
   * @param  {Object} item 广告
   * @param  {availableCoin} 跟广告对应的余额（只有出售时候才需要）
   * @return {Object} 返回一个对象，包含最大最小交易限制coin数量、最大最小交易限制cash金额和考虑余额的最大实际可成交额
   */
  getItemLimit(item, availableCoin = Number.MAX_SAFE_INTEGER) {
    // 在item本身添加 itemLimit属性
    item.remain_coin_amount = parseFloat(item.remain_coin_amount) // 防止出现0E-8这种情况
    // coin 更精确，优先用coin计算
    // 取以下各项的最小值（广告剩余量、广告限制最大额）
    let maxDealCoinAmount = Math.min(item.remain_coin_amount, (item.max_deal_cash_amount / item.price || Number.MAX_SAFE_INTEGER))
    maxDealCoinAmount = maxDealCoinAmount.setDigit(8)
    let maxDealCashAmount = maxDealCoinAmount * item.price
    const minDealCashAmount = item.min_deal_cash_amount.setDigit(2)
    // 最大值可能因为取小数位数的问题导致误差，有时候误差是 0.010000000056这种
    if (item.max_deal_cash_amount - maxDealCashAmount <= 0.015) {
      // 不存在更大的情况
      maxDealCashAmount = item.max_deal_cash_amount
    }
    maxDealCashAmount = maxDealCashAmount.setDigit(2)
    // 实际可成交额为广告可成交额与余额间的较小值
    const maxAvailableCoinAmount = Math.min(maxDealCoinAmount, availableCoin).setDigit(8)
    let maxAvailableCashAmount = (maxAvailableCoinAmount * item.price).setDigit(2)
    if (maxAvailableCashAmount > maxDealCashAmount) {
      maxAvailableCashAmount = maxDealCashAmount
    }
    // 最大值可能因为取小数位数的问题导致误差
    if (item.max_deal_cash_amount - maxAvailableCashAmount <= 0.015) {
      // 不存在更大的情况
      maxAvailableCashAmount = item.max_deal_cash_amount
    }
    return {
      // 前四项是考虑广告余量的限额
      maxDealCoinAmount,
      minDealCoinAmount: (item.min_deal_cash_amount / item.price).setDigit(8),
      maxDealCashAmount,
      minDealCashAmount,
      // 后两项为考虑用户余额时候的实际可成交额（出售时候需要考虑）
      maxAvailableCoinAmount,
      maxAvailableCashAmount,
      available: parseFloat(maxDealCashAmount) >= parseFloat(minDealCashAmount)
    }
  }
}

export default ({app, store}) => {
  app.helpers = Vue.prototype.helpers = helpers
}
