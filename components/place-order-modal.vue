<template>
  <b-modal v-if="item" :visible="value" @hide="hideModal" centered class="place-order-modal"
           hide-footer
           :title="title">
    <div class="merchant-info" v-if="item.user">
      <div class="profile d-flex align-items-center">
        <UserAvatar :username="item.user.name" :online="true"></UserAvatar>
        <span class="ml-10">{{item.user.name}}</span>
      </div>
      <div class="stats">
        <div class="stats-item">
          <span>30天成交量:</span>
          <span class="c-brand-yellow">{{item.user.user_stat.deal_count}}单</span>
        </div>
        <div class="stats-item">
          <span>30天完成率:</span>
          <span
            class="c-brand-yellow">{{(item.user.user_stat.deal_count/item.user.user_stat.order_count)|percentage}} </span>
        </div>
      </div>
      <div class="stats">
        <div class="stats-item">
          <span>平均付款时间:</span>
          <span class="c-brand-yellow">{{utils.formatDuration(item.user.user_stat.pay_time)}} </span>
        </div>
        <div class="stats-item">
          <span>平均放行时间:</span>
          <span class="c-brand-yellow">{{utils.formatDuration(item.user.user_stat.receipt_time)}} </span>
        </div>
      </div>
    </div>
    <div class="item-info">
      <div class="info-header">确认信息</div>
      <div class="info-detail">
        <span>单价：<span class="emphasis">{{item.price}}</span> {{balance.currentCash}}/{{item.coin_type}}
          <i v-if="item.pricing_type===constant.PRICING_TYPE.FLOAT" class="iconfont icon-tooltip" v-b-tooltip.hover
             title="当前数字货币价格为系统自动计算，实际价格以发起时的价格为准。"></i> </span>
        <span>限额：<span class="emphasis">{{item.min_deal_cash_amount + '-' + maxDealCashAmount}}</span> {{balance.currentCash}}</span>
        <span>支付方式：<span class="emphasis">{{paymentMethods}}</span></span>
      </div>
      <div class="item-payment">
        <b-form v-if="form" @submit.prevent="onSubmit">
          <div class="price-input">
            <div class="input-container">
              <div class="max-value">最高金额{{' '+ maxDealCashAmount+ ' '+balance.currentCash}}
                <span class="purchase-all"
                      @click="purchaseAll">全部{{sideText}}</span>
              </div>
              <b-input-group :append="balance.currentCash">
                <ExtendedInputNumber v-model="form.cash_amount" :name="item.id+'cash_amount'"
                                     @focus="()=>onFocus('cashAmount')"
                                     @input="cashAmountChanged"
                                     :placeholder="'可填写想'+sideText+'的金额'"/>
              </b-input-group>
              <EMsgs :result="$v.form.cash_amount" :msgs="invalidMessages.cash_amount"/>
            </div>
            <span class="separator"><i class="iconfont icon-exchange"></i></span>
            <div class="input-container">
              <div class="max-value">最高数量{{' '+ maxDealCoinAmount + ' '+ item.coin_type}}<span
                class="purchase-all"
                @click="purchaseAll">全部{{sideText}}</span>
              </div>
              <b-input-group :append="item.coin_type">
                <ExtendedInputNumber v-model="form.coin_amount" :name="item.id+'coin_amount'"
                                     @focus="()=>onFocus('coinAmount')"
                                     @input="coinAmountChanged"
                                     :placeholder="'可填写想'+sideText+'的数量'"/>
              </b-input-group>
              <EMsgs :result="$v.form.coin_amount" :msgs="invalidMessages.coin_amount"/>
            </div>
          </div>
          <div class="payment-tip">
            * 提交信息即生成订单，请在15分钟内完成打款。
            <b-link href="TODO">更多交易须知 ></b-link>
          </div>
          <div class="payment-tip" v-if="kycLimitAmount!==noKycLimit">
            * 您尚未完成实名认证，每次交易限额{{noKycLimit}}元。
            <b-link href="TODO">去完成实名认证 ></b-link>
          </div>
          <div class="actions">
            <button class="btn btn-outline-green btn-lg" @click="onCancel">取消</button>
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
  import UserAvatar from '~/components/user-avatar'
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
      UserAvatar,
    },
    data() {
      return {
        form: {
          coin_amount: null,
          cash_amount: null,
        },
        submitting: false,
        min_deal_coin_amount: this.item.min_deal_cash_amount / this.item.price,
        noKycLimit: 500,
      }
    },
    validations() {
      return {form: this.validationConf.validations}
    },
    computed: {
      ...mapState(['constant', 'balance', 'user']),
      kycLimitAmount() {
        return (this.user && this.user.account.kyc_status === this.constant.KYC_STATUS.PASS) ? Number.MAX_SAFE_INTEGER : this.noKycLimit
      },
      currentBalance() {
        return parseFloat(this.balance.otcBalance.find(b => b.coin_type === this.item.coin_type).available)
      },
      maxDealCoinAmount() {
        return ('' + this.maxDealCashAmount / this.item.price).setDigit(8)
      },
      maxDealCashAmount() {
        return Math.min(this.item.remain_coin_amount * this.item.price, (this.item.max_deal_cash_amount || Number.MAX_SAFE_INTEGER), this.currentBalance * this.item.price, this.kycLimitAmount)
      },
      sideText() {
        return this.item.side === 'BUY' ? '购买' : '出售'
      },
      title() {
        if (!this.item) return ''
        return '确认' + this.sideText + ' ' + this.item.coin_type
      },
      paymentMethods() {
        const payText = []
        this.item.payment_methods.forEach(p => {
          payText.push(this.constant.PAYMENT_OPTIONS.find(pay => pay.value === p).text)
        })
        return payText.join('，')
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
              maxValue: maxValue(this.maxDealCashAmount),
            },
            message: {
              required: '请填写购买金额',
              minValue: `最小下单金额为${this.item.min_deal_cash_amount}`,
              maxValue: `最大下单金额为${this.maxDealCashAmount}`,
            },
          },
          coin_amount: {
            validation: {
              required,
              minValue: minValue(this.min_deal_coin_amount),
              maxValue: maxValue(this.maxDealCoinAmount),
            },
            message: {
              required: '请填写购买金额',
              minValue: `最小下单数量为${this.min_deal_coin_amount}`,
              maxValue: `${this.balanceTip}最大下单数量为${this.maxDealCoinAmount}`,
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
          this.$showTips('广告信息已更新，请重新下单', 'error')
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
        this.form.cash_amount = this.maxDealCashAmount
        this.form.coin_amount = this.maxDealCoinAmount
      }
    },
  }
</script>
