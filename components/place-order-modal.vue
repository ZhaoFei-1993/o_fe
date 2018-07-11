<template>
  <b-modal v-if="item" :visible="value" @hide="hideModal" centered class="place-order-modal"
           hide-footer
           :title="title">
    <div class="merchant-info" v-if="item.user">
      <div class="profile">{{item.user.name}}</div>
      <div class="stats">
        <div class="stats-item">
          <span>30天成交量:</span>
          <span><span class="c-brand-yellow">130 </span>单</span>
        </div>
        <div class="stats-item">
          <span>30天完成率:</span>
          <span><span class="c-brand-yellow">99.8% </span></span>
        </div>
      </div>
      <div class="stats">
        <div class="stats-item">
          <span>平均付款时间:</span>
          <span><span class="c-brand-yellow">20 </span>分钟</span>
        </div>
        <div class="stats-item">
          <span>平均放行时间:</span>
          <span><span class="c-brand-yellow">0.87 </span>分钟</span>
        </div>
      </div>
    </div>
    <div class="item-info">
      <div class="info-header">确认信息</div>
      <div class="info-detail">
        <span>单价：<span class="emphasis">{{item.price}}</span> CNY/{{item.coin_type}}</span>
        <span>限额：<span class="emphasis">{{item.min_deal_cash_amount+ '-'+ item.max_deal_cash_amount}}</span> CNY</span>
        <span>支付方式：<span class="emphasis">银行卡、支付宝、微信TODO</span></span>
      </div>
      <div class="item-payment">
        <b-form v-if="form" @submit.prevent="onSubmit">
          <div class="price-input">
            <div class="input-container">
              <EMsgs :result="$v.form.cash_amount" :msgs="invalidMessages.cash_amount"/>
              <b-input-group append="CNY">
                <ExtendedInputNumber v-model="form.cash_amount" :name="item.id+'cash_amount'"
                                     @focus="()=>onFocus('cashAmount')"
                                     @change="cashAmountChanged"
                                     placeholder="可填写想买的金额"/>
              </b-input-group>
              <div class="max-value">最高金额{{' '+item.max_deal_cash_amount+ ' '}}CNY<span class="purchase-all"
                                                                                        @click="purchaseAll">全部购买</span>
              </div>
            </div>
            <span class="separator"><i class="iconfont icon-exchange"></i></span>
            <div class="input-container">
              <EMsgs :result="$v.form.coin_amount" :msgs="invalidMessages.coin_amount"/>
              <b-input-group :append="item.coin_type">
                <ExtendedInputNumber v-model="form.coin_amount" :name="item.id+'coin_amount'"
                                     @focus="()=>onFocus('coinAmount')"
                                     @change="coinAmountChanged"
                                     placeholder="可填写想买的数量"/>
              </b-input-group>
              <div class="max-value">最高数量{{' '+(item.max_deal_cash_amount/item.price)+ ' '+ item.coin_type}}<span
                class="purchase-all"
                @click="purchaseAll">全部购买</span>
              </div>
            </div>
          </div>
          <div class="payment-tip">
            * 提交信息即生成订单，请在15分钟内完成打款。
            <b-link href="TODO">更多交易须知 &gt;</b-link>
          </div>
          <div class="actions">
            <button class="btn btn-outline-green btn-lg" @click="hideModal">取消</button>
            <button class="btn btn-gradient-yellow btn-lg" :disabled="submitting" @click="onSubmit">确定</button>
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
          color: #6f6f6f;
          .emphasis {
            color: #27313e;
            font-size: 16px;
          }
        }
        .item-payment {
          .price-input {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .input-container {
              width: 390px;
              input {
                background-color: #f9f9f9;
                border: solid 1px #dddddd;
                padding-right: 60px;
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
                  color: $brandGreen;
                }
              }
              .max-value {
                margin-top: 8px;
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
            margin-top: 30px;
            color: #9b9b9b;
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

  Vue.use(Vuelidate)
  export default {
    props: ['item', 'balance', 'value'],
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
        min_deal_coin_amount: this.item.min_deal_cash_amount / this.item.price,
        max_deal_coin_amount: Math.min(this.item.max_deal_cash_amount / this.item.price, this.balance[this.item.coin_type]),
      }
    },
    validations() {
      return {form: this.validationConf.validations}
    },
    computed: {
      title() {
        if (!this.item) return ''
        return '确认' + (this.item.side === 'BUY' ? '购买' : '出售') + ' ' + this.item.coin_type
      },
      balanceTip() {
        return this.form.coin_amount > this.balance[this.item.coin_type] ? '余额不足，' : ''
      },
      validationConf() {
        return this.utils.processValidationConfig({
          cash_amount: {
            validation: {
              required,
              minValue: minValue(this.item.min_deal_cash_amount),
              maxValue: maxValue(this.item.max_deal_cash_amount),
            },
            message: {
              required: '请填写购买金额',
              minValue: `最小下单金额为${this.item.min_deal_cash_amount}`,
              maxValue: `最大下单金额为${this.item.max_deal_cash_amount}`,
            },
          },
          coin_amount: {
            validation: {
              required,
              minValue: minValue(this.min_deal_coin_amount),
              maxValue: maxValue(this.max_deal_coin_amount),
            },
            message: {
              required: '请填写购买金额',
              minValue: `最小下单数量为${this.min_deal_coin_amount}`,
              maxValue: `${this.balanceTip}最大下单数量为${this.max_deal_coin_amount}`,
            },
          },
        })
      },
      invalidMessages() {
        return this.validationConf.invalidMessages
      },
    },
    methods: {
      onSubmit() {
        this.$v.form.$touch()
        if (this.$v.form.$invalid) {
          return this.$showTips('请检查表单并正确输入内容', 'error')
        }
        this.submitting = true
        // this.axios.order
      },
      hideModal() {
        this.$emit('input', false)
        this.$v.$reset()
        this.form = {
          coin_amount: null,
          cash_amount: null,
        }
      },
      cashAmountChanged(value) {
        this.$v.form.cash_amount.$touch()
        if (this.form.focusInput === 'cashAmount') {
          this.form.coin_amount = this.form.cash_amount === '' ? null : (this.form.cash_amount / this.item.price)
        }
      },
      coinAmountChanged() {
        this.$v.form.coin_amount.$touch()
        if (this.form.focusInput === 'coinAmount') {
          this.form.cash_amount = this.form.coin_amount === '' ? null : (this.form.coin_amount * this.item.price)
        }
      },
      onFocus(inputName) {
        this.form.focusInput = inputName
      },
      purchaseAll() {
        this.form.cash_amount = this.item.max_deal_cash_amount
        this.form.coin_amount = this.item.max_deal_cash_amount / this.item.price
      }
    },
  }
</script>
