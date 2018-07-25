<template>
  <div class="page-order">
    <c-block>
      <header class="header">订单管理</header>
      <div class="filter-wapper">
        <div @click="onClickFilter(index)" v-for="(item, index) in filterOptions" class="filter-item"
             :class="{'filter-active': item.active}">{{ item.text }}
        </div>
      </div>
      <div class="order-table">
        <b-table :fields="orderTableFields" :items="orderTableItems">
          <template slot="HEAD__order_type" slot-scope="{ item }">
            <div>
              <span>类型</span>
              <b-dropdown variant="block" no-caret class="filter-dropdown" menu-class="filter-menu">
                <template slot="button-content">
                  <i class="iconfont icon-filter"></i>
                </template>
                <b-dropdown-item-button @click="onClickHeadFilter({ key: 'side', value: option.value })"
                                        v-for="(option, index) in orderTypeFilterOptions" :key="index">{{ option.text }}
                </b-dropdown-item-button>
              </b-dropdown>
            </div>
          </template>
          <template slot="HEAD_coin_type" slot-scope="{ item }">
            <div>
              <span>币种</span>
              <b-dropdown variant="block" no-caret class="filter-dropdown" menu-class="filter-menu">
                <template slot="button-content">
                  <i class="iconfont icon-filter"></i>
                </template>
                <b-dropdown-item-button @click="onClickHeadFilter({ key: 'coin_type', value: option.value })"
                                        v-for="(option, index) in coinTypeFilterOptions" :key="index">{{ option.text }}
                </b-dropdown-item-button>
              </b-dropdown>
            </div>
          </template>
          <template slot="id" slot-scope="{ item }">
            <b-link :to="`/orders/${item.id}`">{{ item.id }}</b-link>
          </template>
          <template slot="_order_type" slot-scope="{ item }">
            <span
              :class="['order-type', item._order_type === constant.SIDE.BUY ? 'order-type-buy' : 'order-type-sell']">
              {{ item._order_type === constant.SIDE.BUY ? '买' : '卖' }}
            </span>
          </template>
          <template slot="place_time" slot-scope="{ item }">
            {{ item.place_time | getTimeText }}
          </template>
          <template slot="coin_amount" slot-scope="{ item }">
            {{ item.coin_amount | formatMoney }}
          </template>
          <template slot="cash_amount" slot-scope="{ item }">
            {{ item.cash_amount | formatMoney }}
          </template>
          <template slot="status" slot-scope="{ item, detailsShowing, toggleDetails }">
            {{ constant?constant.ORDER_STATUS[item.status.toUpperCase()].text:'' }}
            <span @click.stop="toggleDetails"
                  v-if="item.status === constant.ORDER_STATUS.CREATED.value || item.status === constant.ORDER_STATUS.PAID.value"
                  class="detail"
                  :class="[ detailsShowing ? 'show-detail' : 'hidden-detail' ]"><i
              class="iconfont icon-detail"></i></span>
          </template>
          <template slot="row-details" slot-scope="{ item }">
            <div class="detail-wrapper">
              <div class="col1">
                <div class="detail-h1 detail-flex">
                  <span
                    :class="['arrow-icon', item._order_type === constant.SIDE.BUY ? 'buy-arrow-icon' : 'sell-arrow-icon']"></span>
                  <span>购买 {{ item.coin_type }}</span>
                </div>
                <div class="detail-h2">
                  向{{ item.merchant.name }}
                </div>
              </div>
              <div class="col2">
                <div class="detail-h1">
                  {{ item.cash_amount | formatMoney }} {{ item.cash_type }}
                </div>
                <div class="detail-h2">
                  {{ item.coin_amount | formatMoney }} {{ item.coin_type }}
                </div>
              </div>
              <div class="col3">
                <div class="payment-method"
                     v-if="item.status !== constant.ORDER_STATUS.CANCEL.value
                  && item.status !== constant.ORDER_STATUS.CLOSED.value">
                  <template v-if="item.status === constant.ORDER_STATUS.CREATED.value">
                    <i v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD"
                       class="iconfont icon-bankcard"></i>
                    <i v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.WECHAT"
                       class="iconfont icon-wechat-round"></i>
                    <i v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.ALIPAY"
                       class="iconfont icon-alipay"></i>
                    <select v-model="item._selected_payment_method">
                      <option v-for="payment in item.payment_methods" :value="payment">
                        <span v-if="payment.method === constant.PAYMENT_TYPES.BANKCARD">银行转帐</span>
                        <span v-if="payment.method === constant.PAYMENT_TYPES.WECHAT">微信支付</span>
                        <span v-if="payment.method === constant.PAYMENT_TYPES.ALIPAY">支付宝支付</span>
                      </option>
                    </select>
                  </template>
                </div>
              </div>
              <div class="col4">
                <div class="detail-text">
                  {{ item._selected_payment_method.account_name }}
                </div>
                <div class="detail-text">
                  {{ item._selected_payment_method.account_no }}
                  <b-popover :target="`qr-${item.id}`"
                             placement="top"
                             triggers="hover focus">
                    <img style="display: block;width: 120px;height: 120px;"
                         :src="item._selected_payment_method.qr_code_image">
                  </b-popover>
                  <span :id="`qr-${item.id}`" style="cursor: pointer;"
                        v-show="item._selected_payment_method.method !== 'bankcard'"><i
                    class="iconfont icon-qrcode"></i></span>
                </div>
                <div v-if="item._selected_payment_method.method === 'bankcard'" class="detail-text">
                  {{ item._selected_payment_method.bank }}，{{ item._selected_payment_method.branch }}
                </div>
                <div class="detail-text">
                  备注参考号：<span class="detail-code">{{ `${item.id}`.substr(`${item.id}`.length - 6) }}</span>
                </div>
                <div class="detail-text detail-warn-text">
                  转账时除参考号外请不要备注任何信息，防止卡被冻结!
                </div>
              </div>
              <div class="col5">
                <template v-if="item._order_type === constant.SIDE.BUY">
                  <template v-if="item.status === constant.ORDER_STATUS.CREATED.value">
                    <div class="detail-text detail-timer">
                      还剩{{ item._remaining_time | formatDuration }}
                    </div>
                    <div class="message-btn">
                      <i class="iconfont icon-message"></i>
                    </div>
                    <div class="detail-btn-wrapper">
                      <b-btn size="xs" variant="gradient-yellow" class="detail-btn" @click="confirmPay(item)">我已付款</b-btn>
                    </div>
                    <div class="detail-btn-wrapper">
                      <b-btn size="xs" variant="outline-green" class="detail-btn" @click="cancelOrder(item)">取消订单</b-btn>
                    </div>
                  </template>
                  <template v-if="item.status === constant.ORDER_STATUS.PAID.value">
                    <div class="message-btn">
                      <i class="iconfont icon-message"></i>
                    </div>
                    <div class="detail-btn-wrapper detail-waiting">
                      等待卖家收款
                    </div>
                    <div class="detail-btn-wrapper">
                      <b-btn size="xs" variant="outline-green" class="detail-btn" @click="cancelOrder(item)">取消订单</b-btn>
                    </div>
                  </template>
                  <template v-if="item.status === constant.ORDER_STATUS.CLOSED.value">
                    <div class="message-btn">
                      <i class="iconfont icon-message"></i>
                    </div>
                    <div class="detail-btn-wrapper detail-waiting">
                      已结束
                    </div>
                  </template>
                </template>
                <template v-if="item._order_type === constant.SIDE.SELL">
                  <template v-if="item.status === constant.ORDER_STATUS.CREATED.value">
                    <div class="detail-text detail-timer">
                      还剩{{ item._remaining_time | formatDuration }}
                    </div>
                    <div class="message-btn">
                      <i class="iconfont icon-message"></i>
                    </div>
                    <div class="detail-btn-wrapper detail-waiting">
                      等待买家付款
                    </div>
                  </template>
                  <template v-if="item.status === constant.ORDER_STATUS.PAID.value">
                    <div class="message-btn">
                      <i class="iconfont icon-message"></i>
                    </div>
                    <div class="detail-btn-wrapper">
                      <b-btn size="xs" variant="gradient-yellow" class="detail-btn" @click="confirmReceipt(item)">确认收款</b-btn>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </template>
        </b-table>
        <blank v-if="!orderTableItems.length"></blank>
        <b-pagination v-if="orderTableItems.length"
                      :total-rows="queryParams.totalRows"
                      v-model="queryParams.page"
                      :per-page="queryParams.limit">
        </b-pagination>
      </div>
    </c-block>
    <div class="bottom-tips">
      温馨提示：每日取消订单超过三笔，将被冻结当天下单权限。
    </div>
    <ConfirmReceipt :orderId="curReceiptOrderId" :show-confirm-receipt-modal="showConfirmReceiptModal"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import cBlock from '~/components/c-block'
  import Blank from '~/components/blank'
  import ConfirmReceipt from './_c/confirm-receipt'

  const LIMIT = 10
  const ORDER_PAY_TIME = 15 // 订单可付款时间

  export default {
    data() {
      return {
        curReceiptOrderId: null, // 当前选中的确认收款item
        showConfirmReceiptModal: false,
        timer: null, // 剩余时间定时器
        orderTypeFilterOptions: [{
          text: '全部',
          value: null,
        }, {
          text: '买',
          value: 'buy',
        }, {
          text: '卖',
          value: 'sell',
        }],
        paymentMethods: [],
        filterOptions: [{
          text: '进行中',
          value: 'processing',
          active: true,
        }, {
          text: '已结束',
          value: 'completed',
          active: false,
        }, {
          text: '申诉中',
          value: 'appeal',
          active: false,
        }],
        orderTableFields: {
          id: {
            label: '订单编号',
            sortable: false,
            thStyle: {
              width: '120px',
              paddingLeft: '30px',
            },
            thClass: ['text-left'],
            tdClass: ['text-center'],
          },
          _order_type: {
            label: '类型',
            thStyle: {
              width: '80px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          coin_type: {
            label: '币种',
            thStyle: {
              width: '120px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          coin_amount: {
            label: '数量',
            thStyle: {
              width: '160px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          price: {
            label: '单价',
            thClass: ['text-right'],
            tdClass: ['text-right'],
            thStyle: {
              width: '160px',
            },
            sortable: false,
          },
          cash_amount: {
            label: '总价',
            thClass: ['text-right'],
            tdClass: ['text-right'],
            thStyle: {
              width: '160px',
            },
            sortable: false,
          },
          place_time: {
            label: '下单时间',
            thClass: ['text-right'],
            tdClass: ['text-right'],
            thStyle: {
              width: '180px',
            },
            sortable: false,
          },
          status: {
            label: '状态',
            tdClass: ['text-center'],
            thStyle: {
              textAlign: 'center',
            },
            sortable: false,
          },
        },
        orderTableItems: [],
        queryParams: {
          coin_type: null,
          side: null,
          status: 'processing',
          page: 1,
          limit: LIMIT,
        },
      }
    },
    fetch({store, app, req, redirect, route}) {
      app.axios.init(req)
      return store.dispatch('fetchUserAccount').catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    created() {
      this.fetchOrderList()
      this.startTimer()
    },
    destroyed() {
      clearInterval(this.timer) // 清除定时器
    },
    components: {
      cBlock,
      Blank,
      ConfirmReceipt,
    },
    computed: {
      ...mapState(['user', 'constant']),
      coinTypeFilterOptions() {
        return [{text: '全部', value: null}, ...this.constant.COIN_TYPE_OPTIONS]
      },
    },
    watch: {
      'queryParams.page'() {
        this.fetchOrderList()
      },
    },
    methods: {
      onClickHeadFilter(data) {
        this.queryParams[data.key] = data.value
        this.fetchOrderList()
      },
      isMerchant(order) { // 是否商家
        return order.merchant_id === this.user.account.id
      },
      fetchOrderList() {
        const {status, page, limit, coin_type: coinType, side} = this.queryParams
        this.axios.order.getOrderList({
          coin_type: coinType,
          side,
          status,
          page,
          limit,
        })
          .then((res) => {
            if (res.code === 0 && res.data) {
              const {data, curr_page: currentPage, total: totalRows} = res.data
              this.queryParams.page = currentPage
              this.queryParams.totalRows = totalRows
              this.orderTableItems = data.map(item => {
                let orderType
                if (this.isMerchant(item)) { // 商家
                  orderType = item.merchant_side
                } else { // 普通用户
                  orderType = item.user_side
                }
                let selectedPaymentMethod = {}
                if (item.payment_methods && item.payment_methods.length) {
                  selectedPaymentMethod = {...item.payment_methods[0]}
                }
                const remainingTime = parseInt((item.place_time * 1000 + ORDER_PAY_TIME * 60000 - Date.now()) / 1000) // 订单付款截止时间 = 创建时间 + 可付款时间(15min)
                const { CREATED, PAID } = this.constant.ORDER_STATUS
                const { status } = item
                return {
                  ...item,
                  _order_type: orderType, // 下划线前缀均为自定义属性（下同）订单类型
                  _selected_payment_method: selectedPaymentMethod, // 用户选中的支付方式
                  _remaining_time: remainingTime,
                  status: (status === CREATED.value || status === PAID.value) && remainingTime <= 0 ? this.constant.CLOSED.value : item.status, // 前置判断超时关闭的订单
                }
              })
            } else {
              this.orderTableItems = []
            }
          })
          .catch(err => {
            console.log(err)
            this.axios.onError(err)
          })
      },
      startTimer() {
        clearInterval(this.timer) // 切换到其它tab需要清除定时器
        if (this.queryParams.status === 'processing') {
          // 进行中的订单启动定时器
          this.timer = setInterval(() => {
            if (!this.orderTableItems.length) { // 数组为空不需要定时器
              clearInterval(this.timer)
            } else {
              for (let i = 0; i < this.orderTableItems.length; i++) {
                const item = this.orderTableItems[i]
                const { status } = item
                let { _remaining_time: remainingTime } = item // 先创建_remaining_time临时变量，防止下面逻辑频繁修改数据导致页面频繁更新
                const { CREATED, PAID, CLOSED } = this.constant.ORDER_STATUS
                if (status === CREATED.value || status === PAID.value) { // 针对待付款和已付款订单
                  remainingTime -= 1 // 剩余时间，单位：秒
                  if (remainingTime < 0) {
                    item.status = CLOSED.value
                  } else {
                    item._remaining_time = remainingTime
                  }
                }
              }
            }
          }, 1000)
        }
      },
      confirmPay(item) {
        this.$showDialog({
          hideHeader: true,
          title: '确认付款',
          content: (<div>确认您已向买方付款？<span class="c-red">未付款点击“我已付款”将被冻结账户。</span></div>),
          onOk: () => {
            this.axios.order.confirmPay(item.id).then(res => {
              if (res.code === 0) { // 成功后跳转到`已结束`
                this.onClickFilter(1)
              } else {
                this.$errorTips(`提交失败code=${res.code}`)
              }
            }).catch(err => {
              this.$errorTips(`提交失败: ${err}`)
            })
          }
        })
      },
      cancelOrder(item) {
        this.$showDialog({
          hideHeader: true,
          title: '取消订单',
          content: (<div>确认取消订单？<span class="c-red">如您已向卖家付款，取消订单您将会损失付款资金。</span></div>),
          onOk: () => {
            this.axios.order.cancelOrder(item.id).then(res => {
              if (res.code === 0) { // 成功后跳转到`已结束`
                this.onClickFilter(1)
              } else {
                this.$errorTips(`提交失败code=${res.code}`)
              }
            }).catch(err => {
              this.$errorTips(`提交失败: ${err}`)
            })
          }
        })
      },
      confirmReceipt(item) {
        this.curReceiptOrderId = item.id
        this.showConfirmReceiptModal = true
      },
      onClickFilter(index) {
        for (let i = 0; i < this.filterOptions.length; i++) {
          if (i !== index) {
            this.filterOptions[i].active = false
          } else if (this.queryParams.status !== this.filterOptions[i].value) {
            this.filterOptions[i].active = true
            this.queryParams.status = this.filterOptions[i].value
            this.queryParams.coin_type = null
            this.queryParams.side = null
            this.fetchOrderList()
          }
        }
        this.startTimer()
      },
    }
  }
</script>

<style lang="scss">
  .page-order {
    .header {
      font-size: 18px;
      color: #192330;
    }
    .filter-wapper {
      display: flex;
      justify-content: space-between;
      width: 255px;
      margin-top: 28px;
    }
    .filter-item {
      width: 70px;
      height: 24px;
      line-height: 22px;
      border-radius: 100px;
      border: solid 1px #6f6f6f;
      color: #192330;
      text-align: center;
      font-size: 12px;
      cursor: pointer;
    }
    .filter-active {
      border: solid 1px #52cbca;
      color: #52cbca;
    }
    .bottom-tips {
      font-size: 14px;
      color: #6f6f6f;
      margin-top: 10px;
    }
    .order-table {
      margin: 20px -30px 0;
      .filter-menu {
        width: 100px;
        min-width: 0;
        .dropdown-item {
          height: 25px;
          line-height: 25px;
        }
      }
      .btn-block {
        padding: 0;
        border: 0;
        background-color: #f9f9f9;
      }
      .filter-dropdown {
        display: inline-block;
        .iconfont {
          color: #27313e;
        }
      }
      .table thead th {
        background: #f9f9f9;
      }
      .order-type {
        display: inline-block;
        width: 22px;
        height: 22px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 #ececec;
        border-radius: 100px;
        text-align: center;
        font-size: 12px;
        line-height: 22px;
      }
      .order-type-buy {
        color: #ffbc32;
      }
      .order-type-sell {
        color: #52cbca;
      }
      .detail {
        display: inline-block;
        color: #feb132;
        cursor: pointer;
      }
      .show-detail {
        transform: rotate(0deg);
      }
      .hidden-detail {
        transform: rotate(180deg);
      }
      .b-table-details {
        background-color: #f9f9f9;
        border-top: solid 1px #ffbc32;
      }
      .payment-method {
        margin-bottom: 20px;
        color: #6f6f6f;
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
      .detail-wrapper {
        display: flex;
        justify-content: space-between;
        .col1 {
          flex: 2;
          padding-left: 30px;
          text-align: left;
        }
        .col2 {
          flex: 2;
          text-align: left;
        }
        .col3 {
          flex: 2;
          text-align: left;
        }
        .col4 {
          flex: 3;
          text-align: left;
        }
        .col5 {
          flex: 1.5;
          text-align: right;
          padding-right: 30px;
        }
        .detail-text {
          font-size: 14px;
        }
        .message-btn {
          display: inline-block;
          border-radius: 100px;
          width: 28px;
          height: 28px;
          background-color: #fff;
          box-shadow: 0 0 10px 0 #ececec;
          text-align: center;
          color: #52cbca;
          line-height: 28px;
          margin-left: 6px;
        }
        .detail-timer {
          display: inline-block;
          color: #27313e;
        }
        .detail-btn {
          width: 120px;
          height: 30px;
        }
        .detail-h1 {
          font-size: 16px;
        }
        .detail-h2 {
          font-size: 14px;
          margin-top: 10px;
        }
        .detail-warn-text {
          color: #e35555;
        }
        .detail-code {
          color: #ffbc32;
        }
        .detail-btn-wrapper {
          margin-top: 16px;
        }
        .detail-flex {
          display: flex;
          align-items: center;
        }
        .arrow-icon {
          display: inline-block;
          width: 18px;
          height: 18px;
          background-size: conver;
          margin-right: 6px;
        }
        .buy-arrow-icon {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAMAAACKJ8VmAAAAflBMVEUAAAD/zz7/1k3/0kj/ugP/4Gv/3F7/yzD/vxD/wRb/3mX/2l//11n/1lL/xSD/zDT/yCf/0UD//2b/32z/0D//uQP/zz3/ugT/vQn/uwL/5oD/0UT/00r/2Fj/zz3/zTf/yjD/yCn/xiP/wxz/wRX/vw//vAj/22D/1lH/1lIYey49AAAAG3RSTlMAgD70zD4+sLCI9PT09LCIiHQF6djMxI2IbQrE6Zy3AAAAeUlEQVQY01XNWRKCMBRE0U6QqAwqOM+zSfa/QWkK6r2cr6770+jtJ53tEWL2o4MuX5rr8iFdFm9KyotWENMnJeVBS13uNJS2McZsbrTrVtMCNjuLzAJMlxED2TrEEEKMNUPPVVeqnHy50ntfOih54YscJGnNkDiN4w+x8Ay6E4hABAAAAABJRU5ErkJggg==)
        }
        .sell-arrow-icon {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAMAAACKJ8VmAAAAY1BMVEUAAAAp6MwU18IAw9Ia374e47sHyssExs0JzMgP08QN0McV18IW2sEY278U18IAxtIz/8wV18Ij5roCw84T1sMa3r0V2cAGyMoKzcgO0cUX278DxcwR1MMT1sEe4rsCw84Bws0sJ7b3AAAAFXRSTlMAC+YzwcGIsLCwiPbBwacfBeaMiIgIvV4AAAAAZUlEQVQY033IVw6AIBAAUXbtvXcF7n9KXaKhJb6vybAX9MAsEPEInMGtBeFEQnCGXlDtnwrUKGetfFZbI2JxkQKxq1umZCcZmZZtJP896Ur8E5tnIeZJ/HMQ6wghhRyM0wSkUX0DO0cKFxu0yBIAAAAASUVORK5CYII=)
        }
        .detail-waiting {
          font-size: 18px;
          color: #27313e;
        }
      }
    }
  }
</style>
