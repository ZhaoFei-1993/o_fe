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
              font-size: 18px;
              line-height: 50px;
              margin: 0 20px;
              display: inline-block;
              cursor: pointer;
            }
          }
          &.active {
            .coin-type.active {
              color: $brandYellow;
              border-bottom: 2px solid $brandYellow;
            }
            &.sell .coin-type.active {
              color: $brandGreen;
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
        .col-name {
          padding-left: 0;
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          .icon-certificated-merchant {
            color: #7dd322;
            margin-right: 4px;
          }
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
          <div :class="['choice-block buy', {active:constant.SIDE.BUY===selectedSide}]">
            <div class="side"><i class="iconfont icon-arrow-down"></i>购买</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems(constant.SIDE.BUY,coin)">{{coin}}</span>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div :class="['choice-block sell', {active:constant.SIDE.SELL===selectedSide}]">
            <div class="side"><i class="iconfont icon-arrow-up"></i>出售</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems(constant.SIDE.SELL,coin)">{{coin}}</span>
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
          <span class="col-narrow col-name">{{selectedSide === constant.SIDE.BUY ? '卖家' : '买家'}}</span>
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
            <span class="col-narrow col-name text-center fz-18 c-6f">
              <span v-b-tooltip.hover title="认证商家"><i class="iconfont icon-certificated-merchant"></i></span>{{item.user.name}}
            </span>
            <div class="col-narrow" v-if="item.user && item.user.user_stat">
              <div class="fz-12 c-4a" v-if="item.user.user_stat.order_count">
                {{item.user.user_stat.deal_count}}单 /
                {{(item.user.user_stat.deal_count / item.user.user_stat.order_count) | percentage}}
              </div>
              <div class="fz-12 c-4a" v-else>
                0单 / --
              </div>
              <div class="fz-12 c-6f">
                {{selectedSide ===
                constant.SIDE.BUY ? `放行时间${utils.formatDuration(item.user.user_stat.receipt_time)}` :
                `付款时间${utils.formatDuration(item.user.user_stat.pay_time)}`}}
              </div>
            </div>
            <span class="col-narrow text-right fz-12 c-6f">{{item.remain_coin_amount + ' ' + selectedCoin}}</span>
            <span
              class="col-wide text-right pr-60 fz-12 c-6f">{{item.min_deal_cash_amount + '-' + item.max_deal_cash_amount + balance.currentCash}}</span>
            <span class='payment col-narrow'>
              <UserPayments :payments="item.payment_methods"></UserPayments>
            </span>
            <span
              :class="['sort-price col-wide pr-60 text-right',sortPrice]">{{item.price + ' '+balance.currentCash}}</span>
            <span class="col-narrow">
              <template v-if="user && user.id ===item.user.id">
                <button class="btn btn-order-disabled" :id="'button-order-'+item.id" v-b-tooltip.hover title="不能与自己交易"> {{(selectedSide === constant.SIDE.BUY ? '购买' : '出售') + selectedCoin}} </button>
              </template>
              <button
                v-else-if="qualified(item)"
                :class="['btn btn-order',{'btn-outline-yellow':selectedSide===constant.SIDE.BUY,'btn-outline-green':selectedSide===constant.SIDE.SELL}]"
                @click="placeOrder(item)"
              >
                {{(selectedSide === constant.SIDE.BUY ? '购买' : '出售') + selectedCoin}}
              </button>
              <template v-else>
                <button class="btn btn-order-disabled"
                        :id="'button-order-'+item.id"> {{(selectedSide === constant.SIDE.BUY ? '购买' : '出售') + selectedCoin}} </button>
                <b-popover triggers="hover click" :target="'button-order-'+item.id"
                           title="商家交易限制">
                  <ol v-if="user && user.qualification">
                    <li v-if="checkQualification(item,constant.QUALIFICATIONS.ONE_DEAL)">交易方必须完成过1次交易</li>
                    <li v-if="checkQualification(item,constant.QUALIFICATIONS.BIND_PHONE)">交易方必须通过手机认证</li>
                    <li v-if="checkQualification(item,constant.QUALIFICATIONS.KYC)">交易方必须通过实名认证</li>
                  </ol>
                </b-popover>
              </template>
            </span>
          </div>
        </div>
      </div>
      <b-pagination :total-rows="pager.total" :value="pager.currentPage" :per-page="pager.limit"
                    @change="onPagerChange">
      </b-pagination>
    </div>
    <PlaceOrderModal
      v-if="selectedItem&&user.account"
      :item="selectedItem"
      v-model="showPlaceOrderModal"
    ></PlaceOrderModal>
    <!--todo: 根据现在状态发布币种、方向-->
    <PublishItemModal v-model="isItemPublishing" @published="onItemPublished"/>
    <b-modal id="no-payment-modal" :ok-only="true"
             v-model="showConstraintModal" title="交易限制"
             ok-variant="gradient-yellow"
             ok-title="确认"
             button-size="sm"
             class="text-center">
      <div>
        {{currentConstraint.content}}
        <p>
          <b-link v-if="currentConstraint.outLink" :href="currentConstraint.outLink">{{currentConstraint.linkText}}
          </b-link>
          <b-link v-else :to="currentConstraint.link">{{currentConstraint.linkText}}</b-link>
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  import {coinex, loginPage, webDomain} from '~/modules/variables'
  import PlaceOrderModal from '~/components/place-order-modal'
  import PublishItemModal from '~/components/publish-item-modal'
  import UserPayments from '~/components/user-payments'

  // const refreshInterval = 5000
  const PAGE_SIZE = 30
  const defaultPager = {
    limit: PAGE_SIZE,
    currentPage: 1,
    total: 0,
    totalPage: 1,
    hasNext: true
  }
  export default {
    components: {
      PlaceOrderModal,
      PublishItemModal,
      UserPayments,
    },
    layout: 'fullwidth',
    data() {
      return {
        loginPage: `${loginPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
        selectedCoin: this.$route.query.coin || 'BTC',
        selectedSide: this.$route.query.side || 'buy',
        selectedPayment: this.$route.query.payment || 'ALL',
        sortPrice: this.$route.query.sort || this.selectedSide === 'buy' ? 'ASC' : 'DESC',
        items: [],
        selectedItem: null,
        showPlaceOrderModal: false,
        showConstraintModal: false,
        currentConstraint: {
          content: '',
          linkText: '',
          link: '',
          outLink: null,
        },
        busy: false,
        isItemPublishing: false,
        coinex,
        pager: defaultPager,
      }
    },
    computed: {
      ...mapState(['constant', 'user', 'balance']),
    },
    fetch({store, app, req}) {
      app.axios.init(req)
      return Promise.all([
        store.dispatch('fetchUserQualification'),
        store.dispatch('fetchUserPayments'),
      ]).catch(() => {
        // 首页不做处理
      })
    },
    mounted() {
      this.getItems()
      // TODO 正式环境打开刷新
      // this.requestItems = setInterval(() => {
      //   this.getItems()
      // }, refreshInterval)
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
        const {limit, currentPage} = this.pager
        this.busy = true
        this.axios.item.getItems({
          limit,
          currentPage,
          // taker和maker的方向是反的
          side: this.selectedSide === this.constant.SIDE.BUY ? this.constant.SIDE.SELL : this.constant.SIDE.BUY,
          coin_type: this.selectedCoin,
          payment_method: this.selectedPayment === 'ALL' ? undefined : this.selectedPayment.toLowerCase(),
        }).then(response => {
          const data = response.data
          this.busy = false
          this.items = data.data
          this.pager = this.utils.extractPager(data)
        })
      },
      onPagerChange(currentPage) {
        this.pager.currentPage = currentPage
        this.getItems()
      },
      placeOrder(item) {
        if (!this.user.account) {
          window.location.href = this.loginPage
          return
        }
        this.verifyDynamicConstraint(item).then(res => {
          this.$store.dispatch('fetchOtcBalance').then(_ => {
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
        if (item.side === this.constant.SIDE.BUY) {
          // 卖家需要有对应支付方式
          if (!this.verifyHasPayment(item)) {
            this.currentConstraint = {
              content: '您尚未添加该广告支持的支付方式，无法下单。',
              linkText: '添加支付方式',
              link: '/my/payments',
            }
            this.showConstraintModal = true
            return Promise.reject(item)
          } else {
            return Promise.resolve()
          }
        }
        return this.axios.user.dynamicConstraint().then(response => {
          const constraint = response.data
          if (constraint.cancel_order_times_verified && constraint.kyc_place_order_verified) {
            return Promise.resolve()
          } else {
            this.currentConstraint = (!constraint.kyc_place_order_verified) ? {
              content: '您尚未完成实名认证，每日限制下单次数为 3 次。',
              linkText: '去完成实名认证',
              outLink: `${this.coinex}/my/info/security?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
            } : {
              content: '您今天累计取消超过 3 次订单，被冻结交易功能。',
              linkText: '了解更多交易规则',
              outLink: '//support.coinex.com',
            }
            this.showConstraintModal = true
            return Promise.reject(constraint)
          }
        })
      },
      onItemPublish() {
        this.isItemPublishing = true
      },
      onItemPublished(item) {
        this.isItemPublishing = false
      },
      checkQualification(item, qualification) {
        if (!item.counterparty_limit) return true
        if (!this.user || !this.user.qualification) return false
        return item.counterparty_limit.indexOf(qualification) >= 0 && this.user.qualification.indexOf(qualification) < 0
      }
    },
  }
</script>
