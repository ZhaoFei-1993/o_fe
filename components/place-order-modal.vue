<template>
  <b-modal v-if="item" :visible="value" ref="modal" @hide="$emit('input',false)" centered class="place-order-modal"
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
    </div>
    <div class="item-payment">
      <b-form v-if="form" @submit.prevent="onSubmit">
      </b-form>
    </div>
  </b-modal>
</template>
<style lang="scss">
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
          margin: 10px 0 30px;
          color: #6f6f6f;
          .emphasis {
            color: #27313e;
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

  Vue.use(Vuelidate)
  export default {
    props: ['item', 'balance', 'value'],
    data() {
      return {
        form: {
          coin_amount: null,
          cash_amount: null,
        },
        balanceTip: '',
        min_deal_coin_amount: this.item.min_deal_cash_amount / this.item.price,
        max_deal_coin_amount: Math.min(this.item.max_deal_cash_amount / this.item.price, this.balance[this.item.coin_type]),
      }
    },
    validations() {
      return {
        form: {
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
              minValue: minValue(this.min_deal_cash_amount),
              maxValue: maxValue(this.max_deal_cash_amount),
            },
            message: {
              required: '请填写购买金额',
              minValue: `最小下单数量为${this.min_deal_coin_amount}`,
              maxValue: `${this.balanceTip}最大下单数量为${this.max_deal_coin_amount}`,
            },
          },
        },
      }
    },
    computed: {
      title() {
        if (!this.item) return ''
        return '确认' + (this.item.side === 'BUY' ? '购买' : '出售') + ' ' + this.item.coin_type
      },
    },
    methods: {
      onSubmit() {

      },
    },
  }
</script>
