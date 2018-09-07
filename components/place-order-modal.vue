<template>
  <b-modal v-if="item" :visible="value" @hide="hideModal" centered class="place-order-modal"
           hide-footer
           :noCloseOnBackdrop="true"
           :title="title">
    <div class="item-info">
      <div class="info-header">确认信息</div>
      <div class="info-detail">
        <span>单价：<span class="emphasis">{{item.price}}</span> {{balance.currentCash}}/{{item.coin_type}}
          <i v-if="item.pricing_type===constant.PRICING_TYPE.FLOAT" class="iconfont icon-tooltip" v-b-tooltip.hover
             title="当前数字货币价格为系统自动计算，实际价格以发起时的价格为准。"></i> </span>
        <span>限额：<span class="emphasis">{{itemLimit.minDealCashAmount + '-' + itemLimit.maxDealCashAmount}}</span> {{balance.currentCash}}</span>
        <span>支付方式：<span class="emphasis">{{paymentMethods}}</span></span>
      </div>
      <div class="item-payment">
        <b-form v-if="form" @submit.prevent="">
          <div class="price-input">
            <div class="input-container">
              <div class="max-value">最多{{item.side=== constant.SIDE.BUY?'可卖':'可买'}}
                {{' '+ itemLimit.maxAvailableCashAmount+ ' '+balance.currentCash}}
                <span class="purchase-all"
                      @click="purchaseAll">全部{{sideText}}</span>
              </div>
              <b-input-group :append="balance.currentCash">
                <ExtendedInputNumber v-model="form.cash_amount" :name="item.id+'cash_amount'"
                                     @focus="()=>onFocus('cashAmount')"
                                     :decimalDigit="2"
                                     @input="cashAmountChanged"
                                     :placeholder="'请输入'+sideText+'金额'"/>
              </b-input-group>
              <EMsgs :result="$v.form.cash_amount" :msgs="invalidMessages.cash_amount"/>
            </div>
            <span class="separator"><i class="iconfont icon-exchange"></i></span>
            <div class="input-container">
              <div class="max-value">最多{{item.side=== constant.SIDE.BUY ?'可卖':'可买'}}{{' '+
                itemLimit.maxAvailableCoinAmount + ' '+
                item.coin_type}}<span
                  class="purchase-all"
                  @click="purchaseAll">全部{{sideText}}</span>
              </div>
              <b-input-group :append="item.coin_type">
                <ExtendedInputNumber v-model="form.coin_amount" :name="item.id+'coin_amount'"
                                     @focus="()=>onFocus('coinAmount')"
                                     @input="coinAmountChanged"
                                     :placeholder="coinAmountPlaceholder"/>
              </b-input-group>
              <EMsgs :result="$v.form.coin_amount" :msgs="invalidMessages.coin_amount"/>
            </div>
          </div>
          <div class="merchant-remark" v-if="item.remark">
            <span style="color: #6f6f6f;">商家备注：</span>
            <span>{{ item.remark }}</span>
          </div>
          <div class="payment-tip">
            <span v-if="this.item.side === this.constant.SIDE.SELL">* 提交信息即生成订单，请在15分钟内完成打款。</span>
            <span v-else>* 提交信息即生成订单，在订单结算期间您的数字货币会被冻结。</span>
            <b-link href="https://support.coinex.com/hc/articles/360007643734" target="_blank">更多交易须知 ></b-link>
          </div>
          <div class="actions">
            <button class="btn btn-outline-green btn-lg" @click="onCancel">取消</button>
            <button class="btn btn-gradient-yellow btn-lg" :disabled="submitting||$v.$invalid" @click="onSubmit">确定
            </button>
          </div>
        </b-form>
      </div>
    </div>
  </b-modal>
</template>
<style lang="scss">
  @import "~assets/scss/variables.scss";

  .place-order-modal {
    .modal-dialog {
      width: 940px;
      max-width: 940px;
      .modal-body {
        padding: 0;
      }
      .merchant-info {
        height: 120px;
        background-color: #f9f9f9;
        display: flex;
        padding: 30px 50px;
        align-items: center;
        justify-content: space-between;
        .profile {
          width: 240px;
        }
        .stats {
          width: 180px;
          .stats-item {
            display: flex;
            justify-content: space-between;
          }
        }
      }
      .item-info {
        padding: 20px 50px;
        .info-header {
          font-size: 18px;
          color: #192330;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 10px;
        }
        .info-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0 20px;
          color: #9b9b9b;
          .emphasis {
            color: #27313e;
            font-size: 16px;
          }
          .icon-tooltip {
            font-size: 14px;
          }
        }
        .item-payment {
          .merchant-remark {
            font-size: 16px;
            margin-bottom: 30px;
          }
          .price-input {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .input-container {
              width: 390px;
              input {
                border: solid 1px #dddddd;
                padding-right: 60px;
                font-size: 16px;
                height: 40px;
                &:focus {
                  border: solid 1px $brandGreen;
                }
              }
              .input-group-append {
                position: absolute;
                right: 1px;
                top: 1px;
                height: 38px;
                z-index: 100;
                .input-group-text {
                  border: none;
                  background-color: transparent;
                  color: $brandGreen;
                }
              }
              .max-value {
                margin: 8px 0;
                color: #6f6f6f;
                .purchase-all {
                  color: $brandGreen;
                  cursor: pointer;
                  margin-left: 1rem;
                }
              }
            }
            .separator {
              margin: 29px 0;
              line-height: 40px;
            }
          }
          .payment-tip {
            color: #9b9b9b;
            &:first-of-type {
              margin-top: 30px;
            }
          }
          .actions {
            margin-top: 40px;
            text-align: center;
            .btn {
              margin: 0 10px;
            }
          }
        }
      }
    }
  }
</style>
<script>
  import Vue from 'vue'
  import Vuelidate from 'vuelidate'
  import {required, minValue, maxValue} from 'vuelidate/lib/validators'
  import EMsgs from '~/components/error-message.vue'
  import ExtendedInputNumber from '~/components/extended-input-number.vue'
  import {mapState} from 'vuex'

  Vue.use(Vuelidate)
  export default {
    props: {
      item: {
        required: true,
        type: Object,
      },
      value: {
        required: true,
        type: Boolean,
      },
    },
    components: {
      ExtendedInputNumber,
      EMsgs,
    },
    data() {
      return {
        form: {
          coin_amount: null,
          cash_amount: null,
        },
        submitting: false,
      }
    },
    validations() {
      return {form: this.validationConf.validations}
    },
    computed: {
      ...mapState(['constant', 'balance', 'user']),
      currentBalance() {
        return parseFloat(this.balance.otcBalance.find(b => b.coin_type === this.item.coin_type).available)
      },
      itemLimit() {
        return this.helpers.getItemLimit(this.item, this.sideMaxCoin)
      },
      sideMaxCoin() {
        // 用户买单和balance无关，卖单需要有足够余额
        return this.item.side === this.constant.SIDE.SELL ? Number.MAX_SAFE_INTEGER : this.currentBalance
      },
      sideText() {
        // user看到的是与merchant反的
        return this.item.side === this.constant.SIDE.BUY ? '出售' : '购买'
      },
      title() {
        if (!this.item) return ''
        return '确认' + this.sideText + ' ' + this.item.coin_type
      },
      paymentMethods() {
        const payText = []
        this.item.payment_methods.forEach(p => {
          if (p.method === this.constant.PAYMENT_TYPES.BANKCARD && p.bank_name) {
            payText.push(p.bank_name)
          } else {
            payText.push(this.constant.PAYMENT_OPTIONS.find(pay => pay.value === p.method).text)
          }
        })
        return payText.join('，')
      },
      validationConf() {
        return this.utils.processValidationConfig({
          cash_amount: {
            validation: {
              required,
              minValue: minValue(this.itemLimit.minDealCashAmount),
              maxValue: maxValue(this.itemLimit.maxDealCashAmount),
            },
            message: {
              required: `请填写${this.sideText}金额`,
              minValue: `商家限制最小下单金额${this.itemLimit.minDealCashAmount} CNY`,
              maxValue: `商家限制最大下单金额${this.itemLimit.maxDealCashAmount} CNY`,
            },
          },
          coin_amount: {
            validation: {
              required,
              minValue: minValue(this.itemLimit.minDealCoinAmount),
              maxValue: (value) => {
                if (!value) return true
                if (this.item.side === this.constant.SIDE.BUY && this.itemLimit.maxDealCoinAmount.gt(this.currentBalance)) {
                  return true // 要出售，而且实际限制为余额，不需要考虑这个条件了
                }
                return value.lte(this.itemLimit.maxDealCoinAmount)
              },
              maxAvailable: (value) => {
                if (!value) return true
                if (this.item.side === this.constant.SIDE.SELL || this.itemLimit.maxDealCoinAmount.lte(this.currentBalance)) {
                  return true // 购买，或者余额充足，不需要考虑这个条件
                }
                return value.lte(this.currentBalance)
              },
            },
            message: {
              required: `请填写${this.sideText}数量`,
              minValue: `商家限制最小下单数量${this.itemLimit.minDealCoinAmount} ${this.item.coin_type}`,
              maxValue: `商家限制最大下单数量${this.itemLimit.maxDealCoinAmount} ${this.item.coin_type}`,
              maxAvailable: `账户余额${this.currentBalance} ${this.item.coin_type}`,
            },
          },
        })
      },
      invalidMessages() {
        return this.validationConf.invalidMessages
      },
      coinAmountPlaceholder() {
        // 广告本身和看到的人是反方向的
        return this.item.side === this.constant.SIDE.SELL ? '请输入购买数量' : `余额  ${this.currentBalance}`
      }
    },
    methods: {
      onSubmit() {
        this.$v.form.$touch()
        if (this.$v.form.$invalid) {
          return this.$showTips('请检查表单并正确输入内容', 'error')
        }
        if (this.submitting) {
          // disabled 可能不能完全限制？
          return
        }
        this.submitting = true
        this.axios.order.createOrder({
          item_id: this.item.id,
          coin_amount: this.form.coin_amount,
          cash_amount: this.form.cash_amount,
          coin_type: this.item.coin_type,
          cash_type: this.balance.currentCash,
          price: this.item.price,
        }).then(response => {
          this.$store.dispatch('fetchOtcBalance')
          this.submitting = false
          this.hideModal()
          this.$router.push(`/orders/${response.data.id}`)
        }).catch(err => {
          this.submitting = false
          this.$showTips(`下单失败 ${err.message}`, 'error')
          this.hideModal()
        })
      },
      hideModal() {
        this.$emit('input', false)
        this.form = {
          coin_amount: null,
          cash_amount: null,
        }
        this.$v.$reset()
      },
      onCancel(event) {
        event.preventDefault()
        this.hideModal()
      },
      cashAmountChanged() {
        this.$v.form.cash_amount.$touch()
        if (this.form.focusInput === 'cashAmount') {
          this.form.coin_amount = this.form.cash_amount === '' ? null : `${this.form.cash_amount.decimalDiv(this.item.price)}`.setDigit(8)
        }
        this.$v.form.coin_amount.$touch()
      },
      coinAmountChanged() {
        this.$v.form.coin_amount.$touch()
        if (this.form.focusInput === 'coinAmount') {
          this.form.cash_amount = this.form.coin_amount === '' ? null : `${this.form.coin_amount.decimalMul(this.item.price)}`.setDigit(2)
        }
        this.$v.form.cash_amount.$touch()
      },
      onFocus(inputName) {
        this.form.focusInput = inputName
      },
      purchaseAll() {
        this.form.cash_amount = this.itemLimit.maxAvailableCashAmount
        this.form.coin_amount = this.itemLimit.maxAvailableCoinAmount
        this.$v.form.coin_amount.$touch()
        this.$v.form.cash_amount.$touch()
      }
    },
  }
</script>
