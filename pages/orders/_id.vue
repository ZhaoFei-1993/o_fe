<template>
  <div v-if="order&&merchant" class="page-order-detail">
    <div class="main-content">
      <div class="order-basic-info">
        <div class="info-header">
          <span class="c-19">订单#{{order.id+' '}}详情</span>
          <span class="c-6f">交易状态：<span class="c-brand-yellow fz-18">{{orderStatus}}</span></span>
        </div>
        <div class="info-detail">
          <div class="title">{{paymentTitle}}</div>
          <div class="content" v-if="isMaker">
            {{tradeText.counterparty}}<a :href="'/users/'+counterparty.id">{{counterparty.name}}</a>从我的{{paymentOrigin}}
          </div>
          <div class="content" v-else>
            我从{{tradeText.counterparty}}<a :href="'/users/'+counterparty.id">{{counterparty.name}}</a>
            的{{paymentOrigin}}
          </div>
        </div>
        <div class="payment-info">
          <div class="payment-method" v-if="!isMaker && selectedMethod">
            <i v-if="selectedMethod.method === 'wechat'" class="iconfont icon-wechat-round"></i>
            <i v-if="selectedMethod.method === 'bankcard'" class="iconfont icon-bank"></i>
            <i v-if="selectedMethod.method === 'alipay'" class="iconfont icon-alipay"></i>
            <select v-model="selectedMethod">
              <option v-for="payment in paymentMethods" :value="payment" :class="payment.method">
                <span v-if="payment.method === 'bankcard'">银行转帐</span>
                <span v-if="payment.method === 'wechat'">微信支付</span>
                <span v-if="payment.method === 'alipay'">支付宝支付</span>
              </option>
            </select>
            <span>{{selectedMethod.account_name + ' '+ selectedMethod.account_no}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar">
      <CBlock class="my-sidebar-info" :x="0" :y="20">
        <UserStatsProfile :user-data="counterparty" v-if="counterparty"/>
      </CBlock>
    </div>
  </div>
</template>
<style lang="scss">
  .page-order-detail {
    padding: 40px 0 118px 0px;
    width: 1200px;
    margin: 0 auto;
    min-height: 900px;
    display: flex;
    .main-content {
      flex: 1;
      margin: -10px; //解决内容边界有阴影被隐藏的问题
      padding: 10px;
      overflow: hidden;
      background-color: #ffffff;
      box-shadow: 0 0 10px 0 #ececec;
      .order-basic-info {
        padding: 30px 30px 10px;
        .info-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eeeeee;
        }
        .info-detail {
          .title {
            font-size: 20px;
            color: #27313e;
            margin-top: 20px;
          }
          .content {
            font-size: 16px;
            color: #6f6f6f;
            margin-top: 10px;
            a {
              color: #6f6f6f;
              margin: 0 0.5rem;
            }
          }
        }
        .payment-info {
          .payment-method {
            select {
              border: none;
              background-color: transparent;
              color: #6f6f6f;
              &:focus {
                outline: none;
              }
              option {
                width: 120px;
              }
            }
          }
        }
      }
    }
    .sidebar {
      width: 400px;
      margin-left: 20px;
    }
  }
</style>
<script>
  import UserStatsProfile from '~/components/user-stats-profile.vue'
  import {ORDER_STATUS} from '~/modules/constant'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        id: this.$route.params.id,
        counterparty: null,
        merchant: null,
        counterpartyId: null,
        order: null,
        paymentMethods: null,
        selectedMethod: null,
      }
    },
    components: {
      UserStatsProfile,
    },
    mounted() {
      this.axios.order.getOrderById(this.id).then(response => {
        if (response.code === 0) {
          this.order = response.data
          // 随机测试maker,taker
          if (Math.random() < 0.5) {
            this.order.merchant_id = this.user.id
          } else {
            this.order.user_id = this.user.id
          }
          // TODO 删除以上测试用代码
          if (this.user.id === this.order.user_id) {
            this.counterpartyId = this.order.merchant_id
            this.axios.user.otherUserInfo(this.counterpartyId).then(res => {
              this.counterparty = res.data
              this.merchant = this.counterparty
              this.axios.user.getUserPaymentMethods(this.merchant.id).then(methods => {
                this.paymentMethods = methods.data
                this.selectedMethod = this.paymentMethods[0]
              })
            })
          } else {
            this.counterpartyId = this.order.user_id
            this.axios.user.otherUserInfo(this.counterpartyId).then(res => {
              this.counterparty = res.data
              this.merchant = this.user
            })
          }
        }
      })
    },
    computed: {
      ...mapState(['user']),
      orderStatus() {
        return Object.values(ORDER_STATUS).find(s => s.value === this.order.status).text
      },
      isBuySide() {
        return this.order.user_side === 'BUY' ? (this.user.id === this.order.user_id) : (this.user.id !== this.order.user_id)
      },
      isMaker() {
        return this.merchant.id === this.user.id
      },
      tradeText() {
        if (!this.counterparty) return {}
        if (this.isBuySide) {
          return {
            side: '购买',
            payment: '需支付',
            need: '请于',
            counterparty: '卖家',
          }
        }
        return {
          side: '出售',
          payment: '对方需支付',
          need: this.counterparty.name + ' 需在',
          counterparty: '买家'
        }
      },
      paymentTitle() {
        return this.tradeText.side + ' ' + this.order.coin_amount + ' ' + this.order.coin_type + ', ' + this.tradeText.payment + ' ' + this.order.cash_amount + ' ' + this.order.cash_type
      },
      paymentOrigin() {
        return '交易广告 #' + this.order.item_id + ' 进入，单价 ' + this.order.price + ' CNY/ ' + this.order.coin_type
      },
    }
  }
</script>
