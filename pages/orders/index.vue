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
        <b-table :fields="orderTableFields" :items="orderTableItems" @row-clicked="fetchUnreadMessageCount" :tbody-tr-class="queryParams.status === 'processing' ? 'order-row-class' : ''">
          <template slot="HEAD__order_type" slot-scope="{ item }">
            <div>
              <TableHeadDropdown :options="orderTypeFilterOptions" label="类型"
                                 @click="onClickSideDropdown"></TableHeadDropdown>
            </div>
          </template>
          <template slot="HEAD_coin_type" slot-scope="{ item }">
            <div>
              <TableHeadDropdown :options="coinTypeFilterOptions" label="币种"
                                 @click="onClickCoinTypeDropdown"></TableHeadDropdown>
            </div>
          </template>
          <template slot="id" slot-scope="{ item }">
            <b-link class="id-text" :to="`/orders/${item.id}`">{{ item.id }}</b-link>
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
          <template slot="price" slot-scope="{ item }">
            {{ item.price }} CNY
          </template>
          <template slot="cash_amount" slot-scope="{ item }">
            {{ item.cash_amount | formatMoney }} CNY
          </template>
          <template slot="status" slot-scope="{ item, detailsShowing, toggleDetails }">
            <span class="status-icon"><i v-if="statusIconMap[item.status]" class="iconfont" :class="statusIconMap[item.status].class" :style="{fontSize: '12px', color: statusIconMap[item.status].color}"></i></span>
            <span>{{ constant?constant.ORDER_STATUS[item.status.toUpperCase()].text:'' }}</span>
            <span v-if="item.status === constant.ORDER_STATUS.CREATED.value || item.status === constant.ORDER_STATUS.PAID.value && queryParams.status === 'processing'"
                  class="detail"
                  :class="[ detailsShowing ? 'show-detail' : 'hidden-detail' ]">
              <i class="iconfont icon-detail"></i>
            </span>
          </template>
          <template slot="row-details" slot-scope="{ item }">
            <div class="detail-wrapper">
              <div class="col1">
                <div class="detail-h1 detail-flex">
                  <span
                    :class="['arrow-icon', item._order_type === constant.SIDE.BUY ? 'buy-arrow-icon' : 'sell-arrow-icon']"></span>
                  <span>{{ item._order_type === constant.SIDE.BUY ? '购买' : '出售' }} {{ item.coin_type }}</span>
                </div>
                <div class="detail-h2">
                  <span style="display: inline-block;width: 24px;"></span>
                  <span style="display: inline-block;margin-right: 3px;">向</span>{{ item._order_type ===
                  constant.SIDE.BUY ? item.merchant.name : item.user.name }}
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
                  && item.status !== constant.ORDER_STATUS.CLOSED.value && !item._expired">
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
                  <template v-else>
                    <span v-if="item._selected_payment_method.method === 'bankcard'">
                      <i class="iconfont icon-bankcard"></i><span class="payment-text">银行转帐</span>
                    </span>
                    <span v-if="item._selected_payment_method.method === 'wechat'">
                      <i class="iconfont icon-wechat-round"></i><span class="payment-text">微信支付</span>
                    </span>
                    <span v-if="item._selected_payment_method.method === 'alipay'">
                      <i class="iconfont icon-alipay"></i><span class="payment-text">支付宝支付</span>
                    </span>
                  </template>
                </div>
              </div>
              <div class="col4" v-if="item._selected_payment_method">
                <template v-if="!item._expired">
                  <div class="detail-text" style="color: #27313e;">
                    {{ item._selected_payment_method.account_name }}
                  </div>
                  <div class="detail-text">
                    <span v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD">{{ item._selected_payment_method.account_no | splitCardNumber }}</span>
                    <span v-else>{{ item._selected_payment_method.account_no }}</span>
                    <b-popover :target="`qr-${item.id}`"
                               placement="top"
                               triggers="hover">
                      <img style="display: block;max-width: 360px;max-height: 360px;width: 100%;height: 100%;"
                           :src="item._selected_payment_method.qr_code_image_url">
                    </b-popover>
                    <span :id="`qr-${item.id}`" style="cursor: pointer;"
                          v-show="item._selected_payment_method.method !== constant.PAYMENT_TYPES.BANKCARD"><i
                      class="iconfont icon-qrcode"></i></span>
                  </div>
                  <div v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD"
                       class="detail-text">
                    {{ item._selected_payment_method.bank_name }}
                    <span v-if="item._selected_payment_method.branch&&item._selected_payment_method.branch.length">, {{ item._selected_payment_method.branch }}</span>
                  </div>
                  <div class="detail-text">
                    备注参考号：<span class="detail-code">{{ `${item.id}`.substr(`${item.id}`.length - 6) }}</span>
                  </div>
                </template>
              </div>
              <div class="col5">
                <template v-if="item._order_type === constant.SIDE.BUY">
                  <template v-if="item.status === constant.ORDER_STATUS.CREATED.value">
                    <template v-if="item._remaining_time>0">
                      <div class="detail-text detail-timer">
                        还剩{{ item._remaining_time | formatDuration }}
                      </div>
                      <div class="message-btn">
                        <b-link :to="`/orders/${item.id}`" class="message-link">
                          <i
                            :class="['iconfont', 'icon-message', item._unreadMessageCount > 0 ? 'shake-rotate' : '']"></i>
                          <sup class="message-badge" v-if="item._unreadMessageCount > 0"></sup>
                        </b-link>
                      </div>
                      <div class="detail-btn-wrapper">
                        <b-btn size="xs" variant="gradient-yellow" class="detail-btn" @click="confirmPay(item)">我已付款
                        </b-btn>
                      </div>
                      <div class="detail-btn-wrapper">
                        <b-link class="cancel-order-btn" @click="cancelOrder(item)">取消订单</b-link>
                      </div>
                    </template>
                    <template v-else>
                      <div class="detail-btn-wrapper detail-waiting">
                        已超时
                      </div>
                    </template>
                  </template>
                  <template v-if="item.status === constant.ORDER_STATUS.PAID.value">
                    <div class="message-btn">
                      <b-link :to="`/orders/${item.id}`" class="message-link">
                        <i
                          :class="['iconfont', 'icon-message', item._unreadMessageCount > 0 ? 'shake-rotate' : '']"></i>
                        <sup class="message-badge" v-if="item._unreadMessageCount > 0"></sup>
                      </b-link>
                    </div>
                    <div class="detail-btn-wrapper detail-waiting">
                      等待卖家收款
                    </div>
                    <div class="detail-btn-wrapper">
                      <b-link class="cancel-order-btn" @click="cancelOrder(item)">取消订单</b-link>
                    </div>
                  </template>
                  <template v-if="item.status === constant.ORDER_STATUS.CLOSED.value">
                    <div class="message-btn">
                      <b-link :to="`/orders/${item.id}`" class="message-link">
                        <i
                          :class="['iconfont', 'icon-message', item._unreadMessageCount > 0 ? 'shake-rotate' : '']"></i>
                        <sup class="message-badge" v-if="item._unreadMessageCount > 0"></sup>
                      </b-link>
                    </div>
                    <div class="detail-btn-wrapper detail-waiting">
                      已结束
                    </div>
                  </template>
                </template>
                <template v-if="item._order_type === constant.SIDE.SELL">
                  <template v-if="item.status === constant.ORDER_STATUS.CREATED.value">
                    <template v-if="item._remaining_time>0">
                      <div class="detail-text detail-timer">
                        还剩{{ item._remaining_time | formatDuration }}
                      </div>
                      <div class="message-btn">
                        <b-link :to="`/orders/${item.id}`" class="message-link">
                          <i
                            :class="['iconfont', 'icon-message', item._unreadMessageCount > 0 ? 'shake-rotate' : '']"></i>
                          <sup class="message-badge" v-if="item._unreadMessageCount > 0"></sup>
                        </b-link>
                      </div>
                      <div class="detail-btn-wrapper detail-waiting">
                        等待买家付款
                      </div>
                    </template>
                    <template v-else>
                      <div class="detail-btn-wrapper detail-waiting">
                        已超时
                      </div>
                    </template>
                  </template>
                  <template v-if="item.status === constant.ORDER_STATUS.PAID.value">
                    <div class="message-btn">
                      <b-link :to="`/orders/${item.id}`" class="message-link">
                        <i
                          :class="['iconfont', 'icon-message', item._unreadMessageCount > 0 ? 'shake-rotate' : '']"></i>
                        <sup class="message-badge" v-if="item._unreadMessageCount > 0"></sup>
                      </b-link>
                    </div>
                    <div class="detail-btn-wrapper">
                      <b-btn size="xs" variant="gradient-yellow" class="detail-btn" @click="confirmReceipt(item)">确认收款
                      </b-btn>
                    </div>
                  </template>
                </template>
              </div>
            </div>
            <div v-if="item._isBuySide && item.status === constant.ORDER_STATUS.CREATED.value" class="detail-warn-text">
              <span>* 请使用实名付款，转账时除参考号外请不要备注任何信息！</span>
            </div>
            <div v-else-if="!item._isBuySide && item.status === constant.ORDER_STATUS.PAID.value" class="detail-warn-text">
              <span><span v-if="item.user.kyc_name" class="user-kyc-name">* 买方实名：{{ item.user.kyc_name }}</span>请务必确认收到款项后确认收款，并核实买家是否实名付款！</span>
            </div>
          </template>
        </b-table>
        <blank v-if="!orderTableItems.length"></blank>
        <ViaPagination v-if="orderTableItems.length"
                       :total-rows="queryParams.totalRows"
                       :current-page="queryParams.page"
                       @change="changePage"
                       :per-page="queryParams.limit">
        </ViaPagination>
      </div>
    </c-block>
    <div class="bottom-tips">
      温馨提示：每日取消订单超过3笔，将被限制当日交易功能。
    </div>
    <ConfirmReceipt :orderId="curReceiptOrderId" :show-confirm-receipt-modal="showConfirmReceiptModal"
                    @confirmReceipt="markOrderSuccess"
                    @cancelReceipt="showConfirmReceiptModal=false"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import cBlock from '~/components/c-block'
  import Blank from '~/components/blank'
  import ConfirmReceipt from './_c/confirm-receipt'
  import TableHeadDropdown from './_c/table-head-dropdown'
  import ViaPagination from '~/components/via-pagination'

  const LIMIT = 10
  const ORDER_PAY_TIME = 15 // 订单可付款时间
  const REFRESH_ORDER_INTERVAL = 5000

  export default {
    data() {
      return {
        showSideType: false,
        statusIconMap: {
          created: {
            class: 'icon-pay-waiting-buyer',
            color: 'rgb(223, 75, 75)',
          },
          paid: {
            class: 'icon-pay-waiting-seller',
            color: 'rgb(255, 179, 44)',
          },
          success: {
            class: 'icon-pay-finish',
            color: 'rgb(0, 178, 117)',
          },
          closed: {
            class: 'icon-pay-close',
            color: 'rgb(100, 100, 100)',
          },
          cancel: {
            class: 'icon-pay-cancel',
            color: 'rgb(216, 216, 216)',
          },
        },
        curReceiptOrderId: null, // 当前选中的确认收款item
        showConfirmReceiptModal: false,
        timer: null, // 剩余时间定时器
        orderTypeFilterOptions: [{
          active: true,
          text: '不限',
          value: null,
        }, {
          active: false,
          text: '买',
          value: 'buy',
        }, {
          active: false,
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
            tdClass: ['text-left', 'pl-30'],
          },
          _order_type: {
            label: '类型',
            thStyle: {
              width: '100px',
            },
            thClass: ['text-center'],
            tdClass: ['text-center'],
            sortable: false,
          },
          coin_type: {
            label: '币种',
            thStyle: {
              width: '120px',
            },
            thClass: ['text-center'],
            tdClass: ['text-center'],
            sortable: false,
          },
          coin_amount: {
            label: '数量',
            thStyle: {
              width: '185px',
            },
            thClass: ['text-center'],
            tdClass: ['text-center'],
            sortable: false,
          },
          price: {
            label: '单价',
            thClass: ['text-center'],
            tdClass: ['text-center'],
            thStyle: {
              width: '185px',
            },
            sortable: false,
          },
          cash_amount: {
            label: '总价',
            thClass: ['text-center'],
            tdClass: ['text-center'],
            thStyle: {
              width: '185px',
            },
            sortable: false,
          },
          place_time: {
            label: '下单时间',
            thClass: ['text-center'],
            tdClass: ['text-center'],
            thStyle: {
              width: '190px',
            },
            sortable: false,
          },
          status: {
            label: '状态',
            tdClass: ['text-right', 'pr-30'],
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
    destroyed() {
      clearInterval(this.timer) // 清除定时器
      this.stopRefreshOrders()
    },
    components: {
      cBlock,
      Blank,
      ConfirmReceipt,
      ViaPagination,
      TableHeadDropdown,
    },
    computed: {
      ...mapState(['user', 'constant', 'chat']),
      coinTypeFilterOptions() {
        const defaultOption = {
          active: true,
          text: '不限',
          value: null,
        }
        return [defaultOption, ...this.constant.COIN_TYPE_OPTIONS.map(item => ({active: false, ...item}))]
      },
    },
    mounted() {
      // browser only
      this.Visibility = require('visibilityjs')
      this.Visibility.change(() => {
        if (this.Visibility.visible) {
          this.startRefreshOrders()
        } else {
          this.stopRefreshOrders()
        }
      })
      this.initOrderList()
      this.startTimer()
      this.startRefreshOrders()
    },
    methods: {
      changePage(page) {
        this.queryParams.page = page
        this.initOrderList()
      },
      onClickSideDropdown(item) {
        this.queryParams.side = item.value
        this.initOrderList()
      },
      onClickCoinTypeDropdown(item) {
        this.queryParams.coin_type = item.value
        this.initOrderList()
      },
      isMerchant(order) { // 是否商家
        return order.merchant_id === this.user.account.id
      },
      asyncFetchOrderList() {
        // 只获取不处理数据，返回promise，调用者各自处理返回结果（init和update时候不一样）
        const {status, page, limit, coin_type: coinType, side} = this.queryParams
        return this.axios.order.getOrderList({
          coin_type: coinType,
          side,
          status,
          page,
          limit,
        })
      },
      initOrderList() {
        this.asyncFetchOrderList().then((res) => {
          if (res.code === 0 && res.data) {
            const {data, curr_page: currentPage, total: totalRows} = res.data
            this.queryParams.page = currentPage
            this.queryParams.totalRows = totalRows
            this.orderTableItems = data.map(item => this.preprocessOrder(item))
          } else {
            this.orderTableItems = []
          }
        }).catch(err => {
          console.log(err)
          this.axios.onError(err)
        })
      },
      preprocessOrder(item) {
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
        const expireTime = item.place_time * 1000 + ORDER_PAY_TIME * 60000
        const remainingTime = parseInt((expireTime - Date.now()) / 1000) // 订单付款截止时间 = 创建时间 + 可付款时间(15min)
        return {
          ...item,
          _order_type: orderType, // 下划线前缀均为自定义属性（下同）订单类型
          _selected_payment_method: selectedPaymentMethod, // 用户选中的支付方式
          _remaining_time: remainingTime,
          _expire_time: expireTime,
          _expired: remainingTime <= 0 && item.status === this.constant.ORDER_STATUS.CREATED.value,
          _isBuySide: (item.merchant_id === this.user.account.id) === (item.merchant_side === this.constant.SIDE.BUY),
          _unreadMessageCount: 0, // 未读消息数量
        }
      },
      fetchUnreadMessageCount(record, index, event) {
        if (event.target.tagName.toLowerCase() === 'a') return
        if (this.queryParams.status === 'processing') {
          if (!record._showDetails) {
            this.$set(record, '_showDetails', true) // 首次添加属性需要调用set方法
          } else {
            record._showDetails = !record._showDetails
          }
          if (!record.conversation_id) return
          if (this.chat.imClient) {
            this.chat.imClient.getConversation(record.conversation_id).then(conversation => {
              record._unreadMessageCount = conversation.unreadMessagesCount
            }).catch(console.error)
          }
        }
      },
      startTimer() {
        clearInterval(this.timer) // 切换到其它tab需要清除定时器
        this.stopRefreshOrders() // 切换到其它tab需要清除刷新
        if (this.queryParams.status === 'processing') {
          // 进行中的订单启动定时器
          this.timer = setInterval(() => {
            if (!this.orderTableItems.length) { // 数组为空不需要定时器
              clearInterval(this.timer)
            } else {
              for (let i = 0; i < this.orderTableItems.length; i++) {
                const item = this.orderTableItems[i]
                const {status} = item
                let {_remaining_time: remainingTime} = item // 先创建_remaining_time临时变量，防止下面逻辑频繁修改数据导致页面频繁更新
                const {CREATED} = this.constant.ORDER_STATUS
                if (status === CREATED.value) { // 针对待付款
                  remainingTime = Math.floor((item._expire_time - Date.now()) / 1000) // 剩余时间，单位：秒
                  if (remainingTime >= 0) {
                    item._remaining_time = remainingTime
                  }
                }
              }
            }
          }, 1000)
          // 刷新订单状态
          this.startRefreshOrders()
        }
      },
      confirmPay(item) {
        this.$showDialog({
          hideHeader: true,
          title: '确认付款',
          content: (<div class="text-left">请确认已向卖方付款。<p class="c-red">未付款点击“我已付款”将被冻结账户。</p></div>),
          okTitle: '我已付款',
          cancelTitle: '取消',
          onOk: () => {
            this.axios.order.confirmPay(item.id, item._selected_payment_method).then(res => {
              if (res.code === 0) {
                item.status = this.constant.ORDER_STATUS.PAID.value
              } else {
                this.$errorTips(`提交失败code=${res.code}`)
              }
              this.refreshOrder(item.id)
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
          content: (
            <div class="text-left"><p class="c-red">如您已向卖家付款，取消订单您将会损失付款资金。</p><p>温馨提示：买方每日累计取消订单超过3笔，将被限制当日交易功能。</p>
            </div>),
          onOk: () => {
            this.axios.order.cancelOrder(item.id).then(res => {
              if (res.code === 0) {
                item.status = this.constant.ORDER_STATUS.CANCEL.value
              } else {
                this.$errorTips(`提交失败code=${res.code}`)
              }
              this.refreshOrder(item.id)
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
      markOrderSuccess() {
        this.refreshOrder(this.curReceiptOrderId)
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
            this.queryParams.page = 1 // 重置分页
            this.initOrderList()
          }
        }
        this.startTimer()
      },
      refreshOrder(orderId) {
        // 进行中的订单才有操作
        this.axios.order.refreshOrderStatus(orderId).then(response => {
          this.updateOrderInList(orderId, response.data)
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      updateOrderInList(orderId, newOrder) {
        if (newOrder.status === this.constant.ORDER_STATUS.SUCCESS.value || newOrder.status === this.constant.ORDER_STATUS.CANCEL.value) {
          // 被移动到已结束的列表中
          this.orderTableItems = this.orderTableItems.filter(i => i.id !== orderId)
        }
        if (newOrder.status === this.constant.ORDER_STATUS.PAID.value) {
          newOrder._selected_payment_method = newOrder.payment_methods[0]
          this.orderTableItems.forEach(item => {
            if (item.id === orderId) {
              Object.assign(item, newOrder)
            }
          })
        }
      },
      startRefreshOrders() {
        this.stopRefreshOrders()
        this.refreshInterval = this.Visibility.every(REFRESH_ORDER_INTERVAL, () => {
          this.refreshOrderList()
        })
      },
      stopRefreshOrders() {
        this.Visibility.stop(this.refreshInterval)
      },
      refreshOrderList() {
        // 不能直接替换整个列表，体验不好
        this.asyncFetchOrderList().then((res) => {
          if (res.code === 0 && res.data) {
            const {data, curr_page: currentPage, total: totalRows} = res.data
            this.queryParams.page = currentPage
            this.queryParams.totalRows = totalRows
            const newOrderIds = []
            data.forEach(order => {
              newOrderIds.push(order.id)
              const oldOrder = this.orderTableItems.find(i => i.id === order.id)
              if (!oldOrder) {
                this.orderTableItems.unshift(this.preprocessOrder(order))
              }
              if (oldOrder && oldOrder.status !== order.status) {
                this.updateOrderInList(order.id, order)
              }
            })
            this.orderTableItems = this.orderTableItems.filter(i => newOrderIds.indexOf(i.id) >= 0)
          } else {
            this.orderTableItems = []
          }
        }).catch(err => {
          console.log(err)
          this.axios.onError(err)
        })
      }
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
      .detail-warn-text {
        height: 24px;
        width: 100%;
        border-top: solid 1px #eeeeee;
        line-height: 38px;
        font-size: 14px;
        color: #e35555;
        text-align: left;
        padding-left: 30px;
        .user-kyc-name {
          margin-right: 10px;
          color: #27313e;
        }
      }
      .id-text {
        &:hover {
          text-decoration: underline;
        }
      }
      .order-row-class {
        cursor: pointer;
      }
      .b-table-details {
        cursor: default;
      }
      .status-icon {
        display: inline-block;
        margin-right: 4px;
      }
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
        margin-left: 9px;
        .iconfont {
          display: inline-block;
          transform: scale(0.775);
          font-size: 12px;
        }
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
        font-size: 14px;
        .payment-text {
          color: #27313e;
          display: inline-block;
          margin-left: 9px;
        }
        select {
          border: none;
          background-color: transparent;
          color: #27313e;
          &:focus {
            outline: none;
          }
          option {
            width: 120px;
          }
        }
      }
      .detail-wrapper {
        margin-top: 16px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        .col1 {
          width: 200px;
          padding-left: 30px;
          text-align: left;
        }
        .col2 {
          flex: 1.2;
          text-align: left;
          margin-left: 15px;
        }
        .col3 {
          flex: 1.2;
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
          color: #9b9b9b;
        }
        .message-btn {
          display: inline-block;
          position: relative;
          border-radius: 100px;
          width: 28px;
          height: 28px;
          background-color: #fff;
          box-shadow: 0 0 10px 0 #ececec;
          text-align: center;
          color: #52cbca;
          line-height: 28px;
          margin-left: 6px;
          a.message-link {
            &:hover {
              text-decoration: none !important;
            }
            .iconfont {
              font-size: 14px;
            }
          }
          .shake-rotate {
            display: inline-block;
            transform-origin: center center;
            animation-name: shake-rotate;
            animation-duration: 100ms;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-delay: 0s;
          }
          .message-badge {
            position: absolute;
            right: 8px;
            height: 8px;
            width: 8px;
            border-radius: 50%;
            top: 3px;
            transform: translate3d(100%, -50%, 0);
            background-color: #f56c6c;
            display: inline-block;
          }
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
          color: #27313e;
          font-size: 16px;
        }
        .detail-h2 {
          font-size: 14px;
          margin-top: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #9b9b9b;
        }
        .detail-code {
          color: #ffbc32;
        }
        .detail-btn-wrapper {
          margin-top: 16px;
          .cancel-order-btn {
            font-size: 14px;
          }
        }
        .detail-flex {
          display: flex;
          align-items: center;
        }
        .arrow-icon {
          display: inline-block;
          width: 18px;
          height: 18px;
          background-size: cover;
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
    @mixin shake($x, $y, $rot, $name, $steps:10, $opacity:false) {
      $r: 0deg;
      $h: 0px;
      $v: 0px;

      $interval: $steps;
      $step: 0%;

      @keyframes #{$name}{
        @while $step < 100% {
          @if ($rot != 0deg) {
            $r: random($rot) - $rot/2;
          } @else {
            $r: 0deg;
          }
          @if ($x != 0px) {
            $h: random($x) - $x/2;
          } @else {
            $h: 0px;
          }
          @if ($y != 0px) {
            $v: random($y) - $y/2;
          } @else {
            $v: 0px;
          }

          @if ($step == 0%) {
            #{$step} {
              transform: translate(0px, 0px) rotate(0deg);
              @if ($opacity) {
                opacity: random(10)*.1;
              }
            }
          } @else {
            #{$step} {
              transform: translate($h, $v) rotate($r);
              @if ($opacity) {
                opacity: random(10)*.1;
              }
            }
          }
          $step: $step + $interval;
        }

      }
    }
    @include shake(0px, 0px, 25deg, 'shake-rotate', 2);
  }
</style>
