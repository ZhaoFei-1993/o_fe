<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-index {
    .announcement-bar {
      width: 100%;
      height: 40px;
      background-color: #fffcf6;

      .announcement-container {
        display: flex;
        align-items: center;
        position: relative;
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        line-height: 16px;
      }
      .announcement-titles-container {
        position: relative;
        width: 1000px;
        height: 20px;
        .announcement-title {
          display: inline-block;
          padding: 0 20px;
          line-height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: $brandYellow;

          &:not(:first-of-type) {
            border-left: 1px solid $brandYellow;
          }
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
        margin-bottom: 10px;
        .choice-block {
          background-color: white;
          box-shadow: 0 0 10px 0 #ececec;
          text-align: center;
          display: flex;
          .side {
            height: 50px;
            line-height: 50px;
            width: 120px;
            background-color: #f9f9f9;
            padding-right: 16px;
            color: #27313e;
            font-size: 22px;
            cursor: pointer;
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
              position: relative;
              font-size: 18px;
              line-height: 50px;
              margin: 0 20px;
              display: inline-block;
              cursor: pointer;
              .new-icon {
                display: inline-block;
                font-size: 16px;
                width: 20px;
                height: 14px;
                position: absolute;
                top: -5px;
                right: -21px;
              }
            }
          }
          &.active {
            &.buy {
              .side {
                color: white;
                background-image: linear-gradient(to left, #ffe070, #ffb900);
              }
            }
            &.sell {
              .side {
                color: white;
                background-image: linear-gradient(to left, #22e6b8, #00c1ce);
              }
            }
            .coin-type.active {
              color: $brandYellow;
              border-bottom: 2px solid $brandYellow;
            }
            &.sell .coin-type.active {
              color: $brandGreen;
              border-bottom: 2px solid $brandGreen;
            }
          }

        }
      }
      .items-list {
        background-color: white;
        box-shadow: 0 0 10px 0 #ececec;
        .list-title {
          display: flex;
          justify-content: flex-end;
          padding: 20px 30px;
          background-color: white;
        }

        .list-header {
          display: flex;
          padding: 0 20px;
          height: 40px;
          line-height: 40px;
          align-items: center;
          justify-content: space-between;
          background-color: #f9f9f9;

          .col-name {
            text-align: left;
          }

          .select-payment {
            height: 24px;
            font-weight: 500;
            border: 1px solid #dddddd;
            &:focus {
              outline: none;
              box-shadow: none;
              border: 1px solid $brandGreen;
            }
          }
        }

        .list {
          .item-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: white;
            height: 90px;
            padding: 20px;
            border-bottom: 1px solid #eeeeee;
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
            .col-price {
              font-size: 18px;
              font-weight: 500;
              color: $brandGreen;
            }
            .col-name {
              font-size: 16px;
              color: #27313e;
              display: inline-flex;
              align-items: center;
              .username {
                max-width: 150px;
                overflow: hidden;
                display: inline-block;
                text-overflow: ellipsis;
              }
              .icon-certificated-merchant {
                margin-left: 6px;
              }
            }
          }
        }

        .col-narrow {
          display: inline-block;
          width: 120px;
          padding-right: 16px;
        }
        .col-wide {
          display: inline-block;
          width: 190px;
          padding-right: 16px;
        }
        .col-price {
          display: inline-block;
          width: 200px;
          padding-right: 16px;
        }
        .col-name {
        }
        .col-amount {
          width: 180px;
        }
        .col-price-limit {
          width: 180px;
        }
        .col-action {
          width: 10%;
          padding-right: 0;
        }
        .number {
          font-size: 14px;
          color: #27313e;
        }
        .unit {
          margin-top: 5px;
          font-size: 12px;
          color: #9b9b9b;
        }
      }
    }
  }
</style>

<template>
  <div class="page-index">
    <div class="announcement-bar">
      <div class="announcement-container">
        <i class="iconfont icon-announcement mr-10"></i>公告：
        <div class="announcement-titles-container">
          <b-link v-for="(announcement, index) in announcements" class="announcement-title"
                  :style="{maxWidth:announcements.length?`${Math.floor(100/announcements.length)}%`:'600px'}"
                  :href="announcement.href"
                  target="_blank" :key="index">
            {{announcement.title}}
          </b-link>
        </div>
        <b-link class="more" href="https://support.coinex.com/hc/sections/360001631693" target="_blank">更多 &gt;
        </b-link>
      </div>
    </div>
    <div class="layout-content">
      <div class="trade-choices row">
        <div class="col-6">
          <div :class="['choice-block buy', {active:constant.SIDE.BUY===selectedSide}]">
            <div class="side" @click="showItems(constant.SIDE.BUY)"><i class="iconfont icon-arrow-down"></i>购买</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems(constant.SIDE.BUY,coin)">{{coin}}<span v-if="coin === 'USDC'" class="new-icon"><i
                class="iconfont icon-new-icon"></i></span></span>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div :class="['choice-block sell', {active:constant.SIDE.SELL===selectedSide}]">
            <div class="side" @click="showItems(constant.SIDE.SELL)"><i class="iconfont icon-arrow-up"></i>出售</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems(constant.SIDE.SELL,coin)">{{coin}}<span v-if="coin === 'USDC'" class="new-icon"><i
                class="iconfont icon-new-icon"></i></span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="items-list">
        <div class="list-title">
          <span>
            没有合适的？
            <PublishItemButton>
              <b-btn variant="plain" class="c-brand-green fz-14">自己发布广告</b-btn>
            </PublishItemButton>
          </span>
        </div>
        <div class="list-header">
          <span class="col-wide col-name">商家</span>
          <span class="col-wide">30天成单/完成率</span>
          <span class="col-wide col-amount">数量</span>
          <span class="col-wide col-price-limit">限额</span>
          <b-form-select hidden class='select-payment col-narrow' v-model="selectedPayment"
                         :options="constant.PAYMENT_OPTIONS" @change="filterPayment"></b-form-select>
          <span :class="['col-price col-wide',sortPrice]">单价</span>
          <span class="col-narrow">支付方式</span>
          <span class="col-narrow col-action">操作</span>
        </div>
        <div :class="['list',selectedSide.toLowerCase()]">
          <Blank v-if="!items||!items.length"/>
          <div v-else class="item-row" v-for="item in items">
            <span class="col-wide col-name">
              <span class="username">{{item.user.name}}</span><span v-b-tooltip.hover title="认证商家"><i
              class="iconfont icon-certificated-merchant"></i></span>
            </span>
            <div class="col-wide" v-if="item.user && item.user.user_stat">
              <div class="number" v-if="item.user.user_stat.order_count">
                {{item.user.user_stat.deal_count}} /
                {{(item.user.user_stat.deal_count / item.user.user_stat.order_count) | percentage}}
              </div>
              <div class="number" v-else>
                0 / --
              </div>
              <div class="unit">
                {{selectedSide ===
                constant.SIDE.BUY ? `放行时间${utils.formatDuration(item.user.user_stat.receipt_time)}` :
                `付款时间${utils.formatDuration(item.user.user_stat.pay_time)}`}}
              </div>
            </div>

            <span class="col-narrow col-amount">
              <div class="number">{{item.remain_coin_amount}}</div>
              <div class="unit">{{ selectedCoin}}</div>
            </span>

            <span class="col-wide col-price-limit">
              <div class="number">{{item.itemLimit.minDealCashAmount + '-' + item.itemLimit.maxDealCashAmount}}</div>
              <div class="unit">{{balance.currentCash}}</div>
            </span>

            <span :class="['col-price',sortPrice]">{{item.price + ' '+balance.currentCash}}</span>

            <span class='payment col-narrow'>
              <UserPayments :payments="item.payment_methods" size="14"/>
            </span>

            <span class="col-narrow  col-action">
              <template v-if="user && user.account && user.account.id === item.user.id">
                <button class="btn btn-order-disabled" :id="'button-order-'+item.id" v-b-tooltip.hover title="不能与自己交易"> {{(selectedSide === constant.SIDE.BUY ? '购买' : '出售') + selectedCoin}} </button>
              </template>
              <button
                v-else-if="!user || !user.account || qualified(item)"
                :class="['btn btn-order',{'btn-outline-yellow':selectedSide===constant.SIDE.BUY,'btn-outline-green':selectedSide===constant.SIDE.SELL}]"
                @click="placeOrder(item)"
              >
                {{(selectedSide === constant.SIDE.BUY ? '购买' : '出售') + selectedCoin}}
              </button>
              <template v-else>
                <button class="btn btn-order-disabled"
                        :id="'button-order-'+item.id"> {{(selectedSide === constant.SIDE.BUY ? '购买' : '出售') + selectedCoin}} </button>
                <b-popover triggers="hover" :target="'button-order-'+item.id"
                           title="商家交易限制">
                  <ol v-if="user && user.qualification">
                    <!--todo:这里的文案可以用constant里面的常量代替-->
                    <li v-if="checkQualification(item,constant.QUALIFICATIONS.ONE_DEAL)">交易方必须完成过1次交易</li>
                    <li v-if="checkQualification(item,constant.QUALIFICATIONS.BIND_PHONE)">交易方必须通过手机认证</li>
                  </ol>
                </b-popover>
              </template>
            </span>
          </div>
        </div>
        <ViaPagination :total-rows="pager.total" :current-page="pager.currentPage" :per-page="pager.limit"
                       @change="onPagerChange">
        </ViaPagination>
      </div>

    </div>
    <PlaceOrderModal
      :item="selectedItem"
      v-model="showPlaceOrderModal"/>
    <LinkModal v-bind="currentConstraint" v-model="showConstraintModal"></LinkModal>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {coinexDomain, loginPage, webDomain} from '~/modules/variables'
  import PlaceOrderModal from '~/components/place-order-modal'
  import ViaPagination from '~/components/via-pagination'
  import UserPayments from '~/components/user-payments'
  import PublishItemButton from '~/components/publish-item-modal/publish-item-button'
  import Blank from '~/components/blank'
  import LinkModal from '~/components/link-modal'
  import {PlaceOrderError} from '~/modules/error-code'

  // 从路由数据中获取需要的列表数据
  function resolveDataFromRoute($route, constant) {
    const side = $route.query.side || constant.SIDE.BUY
    return {
      selectedCoin: $route.query.coin || 'USDT',
      selectedSide: side, // 我的买卖方向
      selectedPayment: $route.query.payment || 'ALL',
      sortPrice: $route.query.sort || side === constant.SIDE.BUY ? 'ASC' : 'DESC',
    }
  }

  const refreshInterval = 20000
  const PAGE_SIZE = 10
  const defaultPager = {
    limit: PAGE_SIZE,
    currentPage: 1,
    total: 0,
    totalPage: 1,
    hasNext: true
  }
  const NO_KYC_LIMIT = 500
  export default {
    components: {
      PlaceOrderModal,
      UserPayments,
      PublishItemButton,
      ViaPagination,
      Blank,
      LinkModal,
    },
    data() {
      return {
        loginPage: `${loginPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
        items: [],
        selectedItem: null,
        showPlaceOrderModal: false,
        showConstraintModal: false,
        currentConstraint: {
          content: '',
          linkText: '',
          link: '',
          isOutLink: false,
        },
        busy: false,
        coinexDomain,
        pager: defaultPager,
        noKycLimit: NO_KYC_LIMIT,
        requestItems: null,
        announcements: [],
        orderLimitReason: null,
        kycModalData: { // 实名认证弹窗提示参数
          title: '实名认证',
          content: '您需先完成高级实名认证，才可进行交易。',
          linkText: '去认证',
          link: '/my/security',
          isOutLink: false,
        },
        paymentModalData: { // 支付方式弹窗提示参数
          title: '开启支付方式',
          content: '您需要开启该广告支持的支付方式后，才可以进行交易。',
          linkText: '去开启',
          link: '/my/payments',
          isOutLink: false,
        },
      }
    },
    asyncData({app, store, route}) {
      return resolveDataFromRoute(route, store.state.constant)
    },
    computed: {
      ...mapState(['constant', 'user', 'balance']),
      ...mapGetters(['kycPassed']),
    },
    head() {
      return {
        title: '首页' + this.$t('global.pageTitle.common')
      }
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
      this.getAnnouncements()
      this.requestItems = setInterval(this.getItems, refreshInterval)
      // browser only
      this.Visibility = require('visibilityjs')
      this.Visibility.change(this.onVisibilityChange)
      if (this.selectedCoin === 'BCH') {
        this.checkBCH()
      }
    },
    beforeRouteUpdate(to, from, next) {
      next()
      // 每次在路由更新之后，根据新的路由参数来获取数据
      Object.assign(this, resolveDataFromRoute(this.$route, this.constant))
      this.getItems()
    },
    beforeDestroy() {
      clearInterval(this.requestItems)
      this.Visibility.unbind(this.onVisibilityChange)
    },
    methods: {
      onVisibilityChange() {
        if (!this.Visibility.hidden()) {
          clearInterval(this.requestItems)
          this.requestItems = setInterval(this.getItems, refreshInterval)
        } else {
          clearInterval(this.requestItems)
        }
      },
      getAnnouncements() {
        this.axios.misc.announcements().then(response => {
          this.announcements = response.data.slice(0, 3)
        })
      },
      showItems(side, coin) {
        if (coin === 'BCH') {
          this.checkBCH()
        }
        // 重置page
        this.pager.currentPage = 1

        this.$router.replace({
          query: {
            side,
            coin: coin || this.selectedCoin,
            payment: this.selectedPayment,
          },
        })
      },
      checkBCH() {
        // 临时代码
        if (!sessionStorage.getItem('bchWarning')) {
          this.$showDialog({
            title: '注意！',
            content: (<div>CoinEx已在11月14日24:00（HKT）完成BCH的资产快照，CoinEx所有交易区的BCH即代表BCHABC。详情见
              <a
                href="https://www.coinex.com/announcement/detail?id=156">最新公告
              </a>
            </div>),
            okTitle: '我已知晓',
            okOnly: true,
          })
          sessionStorage.setItem('bchWarning', true)
        }
      },
      filterPayment(payment) {
        this.$router.replace({
          query: {
            side: this.selectedSide,
            coin: this.selectedCoin,
            payment,
          },
        })
      },
      getItems() {
        const {limit, currentPage} = this.pager
        this.busy = true
        this.axios.item.getItems({
          limit,
          page: currentPage,
          // taker和maker的方向是反的
          side: this.selectedSide === this.constant.SIDE.BUY ? this.constant.SIDE.SELL : this.constant.SIDE.BUY,
          coin_type: this.selectedCoin,
          payment_method: (this.selectedPayment === 'ALL' || !this.selectedPayment) ? undefined : this.selectedPayment.toLowerCase(),
        }).then(response => {
          const data = response.data
          this.busy = false
          data.data.forEach(item => {
            item.itemLimit = this.helpers.getItemLimit(item)
          })
          this.items = data.data
          this.pager = this.utils.extractPager(data)
        })
      },
      onPagerChange(currentPage) {
        this.pager.currentPage = currentPage
        this.getItems()
      },
      async checkPrice(item) {
        const limit = 0.1 // 价格偏离比例
        const res = await this.$store.dispatch('fetchExchangeRate')
        const CNY = res.CNY[item.coin_type]
        const percent = (item.price / CNY).toFixed(4)
        const isBuy = this.selectedSide === this.constant.SIDE.BUY // 不能用item.side判断买卖方
        const canOrder = isBuy ? percent <= (1 + limit) : percent >= (1 - limit)
        if (!canOrder) {
          this.$showDialog({
            title: '价格警告',
            content: `该广告价格（${item.price}）${isBuy ? '高于' : '低于'}当前市场价格（${CNY}）的${(Math.abs(percent - 1) * 100).toFixed(2)}%，请确认是否以该价格进行下单`,
            okTitle: '确认下单',
            okOnly: false,
            onOk: () => {
              setTimeout(() => {
                this.order(item) // 加延时防止无法弹窗
              }, 300)
            }
          })
        }
        return canOrder
      },
      async placeOrder(item) {
        if (!this.user.account) {
          window.location.href = this.loginPage
          return
        }
        // 预判条件，需要全部为true才能发起请求
        const conditions = [() => {
          if (!this.kycPassed) { // 要求必须完成高级kyc才能交易
            this.currentConstraint = this.kycModalData
            this.showConstraintModal = true
            return false
          }
          return true
        }, () => {
          const {account: {user_kyc: {country}}, payments} = this.user
          if (country !== 'CHN' && !(Array.isArray(payments) && payments.length > 0)) { // kyc国籍为非中国大陆地区且没有绑定支付方式需要弹窗提示
            this.currentConstraint = this.paymentModalData
            this.showConstraintModal = true
            return false
          }
          return true
        }]

        if (conditions.every(fn => fn() === true)) {
          const priceAllow = await this.checkPrice(item) // 检查价格偏离
          if (priceAllow) {
            this.order(item) // 下单
          }
        }
      },
      async order(item) {
        this.verifyDynamicConstraint(item).then(res => {
          this.$store.dispatch('fetchOtcBalance').then(_ => {
            const available = parseFloat(this.balance.otcBalance.find(b => b.coin_type === item.coin_type).available)
            if (item.side === this.constant.SIDE.BUY && available < (item.min_deal_cash_amount / item.price)) {
              this.currentConstraint = {
                title: '交易限制',
                content: `您的余额为${available} ${item.coin_type}小于该广告最低限额`,
                linkText: '去划转',
                link: `/wallet`,
                isOutLink: false,
              }
              this.showConstraintModal = true
              return
            }
            this.selectedItem = item
            this.showPlaceOrderModal = true
          })
        }).catch(err => {
          if (err.errorType) {
            switch (err.errorType) {
              case this.constant.PLACE_ORDER_ERROR.PAYMENT_LIMIT:
                this.currentConstraint = this.paymentModalData
                break
              case this.constant.PLACE_ORDER_ERROR.NO_KYC_LIMIT:
                this.currentConstraint = this.kycModalData
                break
              case this.constant.PLACE_ORDER_ERROR.CANCEL_LIMIT:
                this.currentConstraint = {
                  title: '交易限制',
                  content: this.orderLimitReason || '您今天累计取消超过 3 次订单，被冻结交易功能。',
                  linkText: '查看规则',
                  link: '//support.coinex.com/hc/articles/360007643734',
                  isOutLink: true,
                }
                break
              default:
                this.$showDialog({
                  title: '下单失败',
                  content: err.message,
                  okTitle: '确定',
                  okOnly: true,
                })
            }
            this.showConstraintModal = true
          } else {
            this.$showDialog({
              title: '下单失败',
              content: err.message,
              okTitle: '确定',
              okOnly: true,
            })
          }
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
      /**
       * 校验用户是否有广告对应的支付方式
       * @param item
       */
      verifyHasPayment(item) {
        return this.$store.dispatch('fetchUserPayments').then(() => {
          // 卖家需要有对应支付方式
          if (!this.user.payments) throw new Error('获取支付方式失败')

          for (const pay of item.payment_methods) {
            if (this.user.payments.find(p => p.status === 'on' && p.method === pay.method)) return 'passed'    // 没有意义的返回值，只是为了标明通过该条件
          }

          throw new PlaceOrderError('尚未添加该广告支持的支付方式', this.constant.PLACE_ORDER_ERROR.PAYMENT_LIMIT)
        })
      },
      async verifyDynamicConstraint(item) {
        // 未完成kyc验证不可以交易
        if (!this.kycPassed) {
          return Promise.reject(new PlaceOrderError('未完成实名认证', this.constant.PLACE_ORDER_ERROR.NO_KYC_LIMIT))
        }
        if (item.side === this.constant.SIDE.BUY) {
          await this.verifyHasPayment(item)
        }
        return this.axios.user.dynamicConstraint().then(response => {
          const constraint = response.data
          if (!constraint.can_place_order) {
            this.orderLimitReason = constraint.order_limit_reason
            return Promise.reject(new PlaceOrderError('限制交易', this.constant.PLACE_ORDER_ERROR.CANCEL_LIMIT))
          } else {
            return Promise.resolve()
          }
        })
      },
      checkQualification(item, qualification) {
        if (!item.counterparty_limit) return true
        if (!this.user || !this.user.qualification) return false
        return item.counterparty_limit.indexOf(qualification) >= 0 && this.user.qualification.indexOf(qualification) < 0
      },
    },
  }
</script>
