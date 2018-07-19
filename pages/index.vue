<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-index {
    .announcement-bar {
      width: 100%;
      height: 40px;
      background-color: #fffcf6;
      .container {
        height: 100%;
        position: relative;
      }
      .announcement-title {
        color: $brandYellow;
        margin-left: 1rem;
        padding: 0 10px;
        &:not(:last-of-type) {
          border-right: 1px solid $brandYellow;
        }
      }
      .more {
        position: absolute;
        right: 0;
        color: $brandYellow;
      }
    }
    .layout-content {
      width: 1200px;
      margin: 40px auto;
      position: relative;
      .trade-choices {
        margin-bottom: 20px;
        .choice-block {
          background-color: white;
          box-shadow: 0 0 10px 0 #ececec;
          text-align: center;
          display: flex;
          .side {
            height: 50px;
            line-height: 50px;
            width: 120px;
            color: white;
            padding-right: 16px;
            background-image: linear-gradient(to left, #ffe070, #ffb900);
            font-size: 22px;
            i.iconfont {
              font-size: 22px;
              margin-right: 0.5rem;
            }
          }
          .coin-types {
            height: 50px;
            line-height: 50px;
            flex: 1;
            .coin-type {
              line-height: 50px;
              width: 80px;
              display: inline-block;
              cursor: pointer;
            }
          }
          &.active {
            .coin-type.active {
              border-bottom: 2px solid $brandYellow;
            }
            &.sell .coin-type.active {
              border-bottom: 2px solid $brandGreen;
            }
          }
          &.sell {
            .side {
              background-image: linear-gradient(to left, #22e6b8, #00c1ce);
            }
          }
        }
      }
      .items-list {
        box-shadow: 0 0 10px 0 #ececec;
        .list-title {
          display: flex;
          justify-content: space-between;
          padding: 24px 20px 8px;
          background-color: white;
          span:first-of-type {
            font-size: 18px;
          }
        }
        .list-header {
          padding: 0 20px;
          height: 40px;
          line-height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f9f9f9;
          .col-narrow, .col-wide {
            text-align: center;
          }
          .select-payment {
            height: 24px;
            border: 1px solid #dddddd;
          }
        }
        .list {
          &.sell .item-row:nth-of-type(even) {
            background-color: #fafffe;
          }
          .item-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: white;
            height: 90px;
            padding: 20px;
            &:nth-of-type(even) {
              background-color: #fffdfa;
            }
            .btn-order {
              width: 100px;
              height: 26px;
              border-radius: 100px;
              font-size: 14px;
              line-height: 22px;
            }
            .btn-order-disabled {
              width: 100px;
              height: 26px;
              border-radius: 100px;
              font-size: 14px;
              line-height: 22px;
              background-color: transparent;
              border-color: #cbcbcb;
              color: #cbcbcb;
            }
            .payment {
              i {
                margin: 0 4px;
              }
            }
          }
        }

        .col-narrow {
          width: 12%;
          padding: 0 16px;
        }
        .col-wide {
          flex: 1;
          padding: 0 16px;
        }
      }
    }
  }
</style>

<template>
  <div class="page-index">
    <div class="announcement-bar">
      <div class="container d-flex align-items-center">
        <span><i class="iconfont icon-announcement"></i>公告:</span>
        <span class="announcement-title">公告1</span>
        <span class="announcement-title">公告2</span>
        <span class="announcement-title">公告3</span>
        <b-link class="more" href="#">更多 &gt;</b-link>
      </div>
    </div>
    <div class="layout-content">
      <div class="trade-choices row">
        <div class="col-6">
          <div :class="['choice-block buy', {active:'BUY'===selectedSide}]">
            <div class="side"><i class="iconfont icon-arrow-down"></i>购买</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems('buy',coin)">{{coin}}</span>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div :class="['choice-block sell', {active:'sell'===selectedSide}]">
            <div class="side"><i class="iconfont icon-arrow-up"></i>出售</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems('sell',coin)">{{coin}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="items-list">
        <div class="list-title">
          <span>广告列表</span>
          <span>
            没有合适的？
            <b-btn variant="plain" class="c-brand-green" @click="onItemPublish">自己发布广告</b-btn>
          </span>
        </div>
        <div class="list-header">
          <span class="col-narrow">{{selectedSide==='buy'?'卖家':'买家'}}</span>
          <span class="col-narrow">30天成单/完成率</span>
          <span class="col-narrow">数量</span>
          <span class="col-wide">限额</span>
          <b-form-select class='select-payment col-narrow' v-model="selectedPayment"
                         :options="constant.PAYMENT_OPTIONS" @change="filterPayment"></b-form-select>
          <span :class="['sort-price col-wide',sortPrice]">单价</span>
          <span class="col-narrow">操作</span>
        </div>
        <div :class="['list',selectedSide.toLowerCase()]">
          <div class="item-row" v-for="item in items">
            <span class="col-narrow text-center fz-18 c-6f">{{item.user.name}}</span>
            <div class="col-narrow">
              <div class="fz-12 c-4a">1024单/50%</div>
              <div class="fz-12 c-6f">放行时间7分钟</div>
            </div>
            <span class="col-narrow text-right fz-12 c-6f">{{item.coin_amount+' '+selectedCoin}}</span>
            <span class="col-wide text-right pr-60 fz-12 c-6f">{{item.min_deal_cash_amount+ '-'+ item.max_deal_cash_amount + 'CNY'}}</span>
            <span class='payment col-narrow'>
              <UserPayments :payments="item.payment_methods"></UserPayments>
            </span>
            <span :class="['sort-price col-wide pr-60 text-right',sortPrice]">{{item.price + ' CNY'}}</span>
            <span class="col-narrow">
              <template v-if="user && user.id ===item.user_id">
                <button class="btn btn-order-disabled" :id="'button-order-'+item.id" v-b-tooltip.hover title="不能与自己交易"> {{(selectedSide==='buy'?'购买':'出售')+ selectedCoin}} </button>
              </template>
              <button
                v-else-if="qualified(item)"
                :class="['btn btn-order',{'btn-outline-yellow':selectedSide==='buy','btn-outline-green':selectedSide==='sell'}]"
                @click="placeOrder(item)"
              >
                {{(selectedSide==='buy'?'购买':'出售')+ selectedCoin}}
              </button>
              <template v-else>
                <button class="btn btn-order-disabled" :id="'button-order-'+item.id"> {{(selectedSide==='buy'?'购买':'出售')+ selectedCoin}} </button>
                <b-popover triggers="hover click" :target="'button-order-'+item.id"
                           title="商家交易限制">
                  <ol>
                    <li v-if="true||item.qualification">交易方必须完成过1次交易</li>
                    <li v-if="true||item.qualification">交易方必须通过手机认证</li>
                    <li v-if="true||item.qualification">交易方必须通过实名认证</li>
                  </ol>
                </b-popover>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
    <PlaceOrderModal
      v-if="selectedItem&&user.balance"
      :item="selectedItem"
      :balance="user.balance"
      v-model="showPlaceOrderModal"
    ></PlaceOrderModal>
    <PublishItemModal v-model="publishModalShowing" @published="onItemPublished"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  import PlaceOrderModal from '~/components/place-order-modal'
  import PublishItemModal from '~/components/publish-item-modal/index.vue'
  import UserPayments from '~/components/user-payments'

  export default {
    components: {
      PlaceOrderModal,
      PublishItemModal,
      UserPayments,
    },
    layout: 'fullwidth',
    data() {
      return {
        message: 'Hello OTC',
        selectedCoin: this.$route.query.coin || 'BTC',
        selectedSide: this.$route.query.side || 'buy',
        selectedPayment: this.$route.query.payment || 'ALL',
        sortPrice: this.$route.query.sort || this.selectedSide === 'buy' ? 'ASC' : 'DESC',
        items: [],
        selectedItem: null,
        showPlaceOrderModal: false,
        busy: false,
        publishModalShowing: true,
      }
    },
    computed: {
      ...mapState(['constant', 'user']),
    },
    beforeMount() {
      this.$store.dispatch('fetchUserQualification')
      this.$store.dispatch('fetchUserPayments')
      this.getItems()
      this.requestItems = setInterval(() => {
        this.getItems()
      }, 5000)
    },
    beforeDestroy() {
      clearInterval(this.requestItems)
    },
    methods: {
      showItems(side, coin) {
        this.selectedSide = side
        this.selectedCoin = coin
        this.$router.replace({
          query: {
            side,
            coin,
            payment: this.selectedPayment,
          },
        })
        this.getItems()
      },
      getItems() {
        this.busy = true
        this.axios.item.getItems({
          side: this.selectedSide,
          coin_type: this.selectedCoin,
          payment_method: this.selectedPayment === 'ALL' ? undefined : this.selectedPayment.toLowerCase(),
        }).then(response => {
          this.busy = false
          this.items = response.data.data.slice(0, 30)
        })
      },
      placeOrder(item) {
        this.verifyDynamicConstraint(item).then(res => {
          this.$store.dispatch('fetchUserBalance').then(_ => {
            this.selectedItem = item
            this.showPlaceOrderModal = true
          })
        }, rejected => {
          // 暂不处理
        })
      },
      filterPayment(payment) {
        this.$router.replace({
          query: {
            side: this.selectedSide,
            coin: this.selectedCoin,
            payment,
          },
        })
        Vue.nextTick(() => {
          this.getItems()
        })
      },
      qualified(item) {
        for (const limit of item.counterparty_limit) {
          if (!this.user.qualification || this.user.qualification.indexOf(limit) < 0) {
            return false
          }
        }
        return true
      },
      verifyHasPayment(item) {
        if (!this.user.payments) {
          return false
        }
        for (const pay of item.payment_methods) {
          if (this.user.payments.find(p => p.method === pay)) {
            return true
          }
        }
        return false
      },
      verifyDynamicConstraint(item) {
        if (item.user_side === this.constant.SIDE.SELL.value) {
          // 卖家需要有对应支付方式
          if (!this.verifyHasPayment(item)) {
            this.$showDialog({
              title: '交易限制',
              okOnly: true,
              content:
                <div>
                  您尚未添加该广告支持的支付方式，无法下单。
                  <p>
                    <b-link href="/my/payments">添加支付方式。</b-link>
                  </p>
                </div>,
            })
            return Promise.reject(item)
          }
        }
        return this.axios.user.dynamicConstraint().then(response => {
          const constraint = response.data
          if (constraint.cancel || constraint.kyc_time) {
            this.$showDialog({
              title: '交易限制',
              okOnly: true,
              content: constraint.cancel ? (
                <div>
                  您今天累计取消超过 3 次订单，被冻结交易功能。
                  <p>
                    <b-link href="#TODO">了解更多交易规则。</b-link>
                  </p>
                </div>) : (
                <div>
                  您尚未完成实名认证，每日限制下单次数为 3 次。
                  <p>
                    <b-link to="/my/merchant">去完成实名认证。</b-link>
                  </p>
                </div>),
            })
            return Promise.reject(constraint)
          } else {
            return Promise.resolve()
          }
        })
      },
      onItemPublish() {
        this.publishModalShowing = true
      },
      onItemPublished(item) {
        this.publishModalShowing = false
      }
    },
  }
</script>
