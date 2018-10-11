<template>
  <div class="page-content-container">
    <div class="page-order">
      <c-block>
        <header class="header">订单管理</header>
        <div class="filter-wapper">
          <b-btn v-for="(item, index) in filterOptions"
                 :variant="queryParams.status === item.value ? 'outline-green' : 'outline-gray'"
                 :key="index" size="xxs" class="mr-20"
                 @click="onClickFilter(index)">
            <i v-if="item.value===ORDERS_FILTERS.APPEAL" class="iconfont icon-appeal"></i>{{item.text}}
          </b-btn>
        </div>
        <div class="order-table">
          <b-table :fields="queryParams.status === ORDERS_FILTERS.APPEAL?appealTableFields:orderTableFields"
                   :items="orderTableItems" @row-clicked="onRowClick"
                   :tbody-tr-class="queryParams.status === ORDERS_FILTERS.PROCESSING ? 'order-row-class' : ''">
            <template slot="HEAD__isBuySide" slot-scope="{ item }">
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
              <b-link class="id-text" @click.stop="onClickItemId(item.id)">
                <span>{{ item.id }}</span>
                <span class="message-btn">
                <i
                  :class="['iconfont', 'icon-message', item._unreadMessageCount > 0 ? 'shake-rotate' : '']"></i>
                <sup class="message-badge" v-if="item._unreadMessageCount > 0"></sup>
              </span>
              </b-link>
            </template>
            <template slot="_isBuySide" slot-scope="{ item }">
            <span
              :class="['order-type', item._isBuySide ? 'order-type-buy' : 'order-type-sell']">
              {{ item._isBuySide ? '买' : '卖' }}
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
            <template slot="_counterpartyName" slot-scope="{ item }">
              {{ item._counterpartyName }}
            </template>
            <template slot="status" slot-scope="{ item, detailsShowing, toggleDetails }">
              <span class="status-icon">
                <i
                  v-if="showAppealMark(item)"
                  class="iconfont icon-appeal fz-12 c-brand-green"
                  v-b-tooltip.hover title="申诉中"
                ></i>
                <i v-if="statusIconMap[item.status]" class="iconfont"
                   :class="statusIconMap[item.status].class"
                   :style="{fontSize: '12px', color: statusIconMap[item.status].color}"></i>
              </span>
              <span>{{ constant?constant.ORDER_STATUS[item.status.toUpperCase()].text:'' }}</span>
              <span
                v-if="item.status === constant.ORDER_STATUS.CREATED.value || item.status === constant.ORDER_STATUS.PAID.value && queryParams.status === 'processing'"
                class="detail"
                :class="[ detailsShowing ? 'show-detail' : 'hidden-detail' ]">
                <i class="iconfont icon-detail"></i>
              </span>
            </template>
            <template slot="row-details" slot-scope="{ item }" class="buy-side-detail">
              <div :class="['order-detail', item._isBuySide ? 'buy-side-detail' : 'sell-side-detail']">
                <div class="details-wrapper">
                  <div class="order-step">
                    <template v-if="item._isBuySide">
                      <template v-if="item.status === constant.ORDER_STATUS.CREATED.value">
                        请支付{{item.cash_amount}}{{item.cash_type}}，剩余时间为{{ item._remaining_time | formatDuration
                        }}，付款参考号：
                        <span class="warning-text">{{item.id}}</span>
                      </template>
                      <template v-if="item.status === constant.ORDER_STATUS.PAID.value">
                        等待对方确认收款，付款参考号：<span class="warning-text">{{item.id}}</span>
                      </template>
                    </template>
                    <template v-if="!item._isBuySide">
                      <template v-if="item.status === constant.ORDER_STATUS.CREATED.value">
                        等待对方支付{{item.cash_amount}}{{item.cash_type}},剩余时间为{{ item._remaining_time | formatDuration
                        }}，付款参考号：
                        <span class="warning-text">{{item.id}}</span>
                      </template>
                      <template v-if="item.status === constant.ORDER_STATUS.PAID.value">
                        对方已支付{{item.cash_amount}}{{item.cash_type}}，请查收并放币，付款参考号:
                        <span class="warning-text">{{item.id}}</span>
                      </template>
                    </template>
                  </div>
                  <div class="order-other-side" v-if="item.status === constant.ORDER_STATUS.PAID.value">
                      <span class="other-name" v-if="!item._isBuySide">
                        对方实名：{{ item._counterparty.kyc_name }}
                      </span>
                      <b-link :disabled="!item.network_phone" @click="clickNetPhone(item)">
                        <i class="iconfont icon-netphone" v-b-tooltip.hover :title="item.network_phone_reason"></i>
                        <span style="margin-left: 5px;">联系对方</span>
                      </b-link>
                  </div>
                  <div class="payment-warning">
                    <template v-if="item._isBuySide&&item.status === constant.ORDER_STATUS.CREATED.value">
                      请使用实名付款，转账时除参考号外请不要备注任何信息
                    </template>
                    <template v-if="!item._isBuySide&&item.status === constant.ORDER_STATUS.PAID.value">
                      请务必查看您的收款账户，并核实买家是否实名付款。
                    </template>
                  </div>
                  <div class="payment-method">
                    <template v-if="item.status ===constant.ORDER_STATUS.CREATED.value">
                        <div v-if="item._isBuySide" class="select-wrap" v-click-outside="onClickOutsidePayment">
                          <div class="select-head" @click="isShowPaymentMethod = !isShowPaymentMethod" >
                            <i v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.WECHAT"
                               class="iconfont icon-wechat-round"></i>
                            <i v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD"
                               class="iconfont icon-bankcard"></i>
                            <i v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.ALIPAY"
                               class="iconfont icon-alipay"></i>
                            <span v-model="item._selected_payment_method">
                              <span v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD">银行卡</span>
                              <span v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.WECHAT">微信</span>
                              <span v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.ALIPAY">支付宝</span>
                            </span>
                            <i class="iconfont icon-xialajiantou"></i>
                          </div>
                          <ul id="select-op" class="select-option" v-show="isShowPaymentMethod">
                            <li v-for="(payment,index) in item.payment_methods" :value="payment" @click="choosePayment({item,index,payment})" :class="{'selected' : item._selected_payment_method.account_no === payment.account_no}">
                              <span class="select-item-placeholder"><i class="iconfont icon-tick" v-show="item._selected_payment_method.account_no === payment.account_no"></i></span>
                              <span v-if="payment.method === constant.PAYMENT_TYPES.BANKCARD">银行卡</span>
                              <span v-if="payment.method === constant.PAYMENT_TYPES.WECHAT">微信</span>
                              <span v-if="payment.method === constant.PAYMENT_TYPES.ALIPAY">支付宝</span>
                            </li>
                          </ul>
                        </div>
                    </template>
                    <template v-else>
                        <span v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD" class="payments">
                          <i class="mr-10 iconfont icon-bankcard"></i>银行卡</span>
                      <span v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.WECHAT" class="payments">
                          <i class="mr-10 iconfont icon-wechat-round"></i>微信</span>
                      <span v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.ALIPAY" class="payments">
                          <i class="mr-10 iconfont icon-alipay"></i>支付宝</span>
                    </template>
                    <span class="payment-account" v-if="!(item.status === constant.ORDER_STATUS.CREATED.value && !item._isBuySide)">
                        <span class="payment-account-col">{{item._selected_payment_method.account_name + ' '}}</span>
                        <span class="payment-account-col" v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD && item._selected_payment_method.bank_name">
                          {{ item._selected_payment_method.bank_name }}
                        </span>
                        <span class="payment-account-col" v-if="item._selected_payment_method.account_no">
                          <span  v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD">
                            {{ item._selected_payment_method.account_no | splitCardNumber }}
                          </span>
                          <span v-else>{{ item._selected_payment_method.account_no }}</span>
                          <i id="icon-copy" class="iconfont icon-copy order-payment-copy" v-clipboard:copy="item._selected_payment_method.account_no" v-clipboard:success="copySuccess"></i>
                          <b-tooltip target="icon-copy" content="已复制" :show="copyed" :triggers="'false'" placement="top">已复制</b-tooltip>
                        </span>
                        <span class="payment-account-col" v-if="item._selected_payment_method.method === constant.PAYMENT_TYPES.BANKCARD && item._selected_payment_method.branch">
                           {{ item._selected_payment_method.branch }}
                        </span>
                        <QrcodePopover v-if="item._selected_payment_method.method !== constant.PAYMENT_TYPES.BANKCARD && item._selected_payment_method.qr_code_image"
                                     :src="item._selected_payment_method.qr_code_image_url"/>
                    </span>
                  </div>
                </div>
                <div class="payment-wrapper">
                  <template v-if="item._isBuySide">
                    <template v-if="item.status === constant.ORDER_STATUS.CREATED.value">
                      <template v-if="item._remaining_time>0">
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
                      <div class="detail-btn-wrapper detail-waiting waitcoin">
                        等待卖方放币<i class="iconfont icon-sangedian1"></i>
                      </div>
                      <div class="detail-btn-wrapper">
                        <b-link class="cancel-order-btn" @click="cancelOrder(item)">取消订单</b-link>
                      </div>
                    </template>
                    <template v-if="item.status === constant.ORDER_STATUS.CLOSED.value">
                      <div class="detail-btn-wrapper detail-waiting">
                        已结束
                      </div>
                    </template>
                  </template>
                  <template v-if="!item._isBuySide">
                    <template v-if="item.status === constant.ORDER_STATUS.PAID.value">
                      <div class="detail-btn-wrapper">
                        <b-btn size="xs" variant="gradient-yellow" class="detail-btn"
                               @click="confirmReceipt(item)">确认收款并放币
                        </b-btn>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </template>
            <!--以下为申诉列表的信息-->
            <template slot="appeal_time" slot-scope="{ item }">
              {{ item.appeal_time | getTimeText }}
            </template>
            <template slot="appeal_status" slot-scope="{ item }">
              {{
              constant.APPEAL_STATUS_MAP[item.appeal_status]?constant.APPEAL_STATUS_MAP[item.appeal_status].text:'-'}}
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
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import cBlock from '~/components/c-block'
  import Blank from '~/components/blank'
  import ConfirmReceipt from './_c/confirm-receipt'
  import TableHeadDropdown from '~/components/table-head-dropdown'
  import ViaPagination from '~/components/via-pagination'
  import QrcodePopover from '~/components/qrcode-popover'
  import ClickOutside from 'vue-click-outside'

  const LIMIT = 10
  const ORDER_PAY_TIME = 15 // 订单可付款时间
  const REFRESH_ORDER_INTERVAL = 5000
  const ORDERS_FILTERS = {
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    APPEAL: 'appeal',
  }
  export default {
    data() {
      return {
        copyed: false,
        isShowPaymentMethod: false,
        showSideType: false,
        ORDERS_FILTERS,
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
          value: ORDERS_FILTERS.PROCESSING,
          active: true,
        }, {
          text: '已结束',
          value: ORDERS_FILTERS.COMPLETED,
          active: false,
        }, {
          text: '申诉订单',
          value: ORDERS_FILTERS.APPEAL,
          active: false,
        }],
        orderTableItems: [],
        queryParams: {
          coin_type: null,
          side: null,
          status: ORDERS_FILTERS.PROCESSING,
          page: 1,
          limit: LIMIT,
        },
      }
    },
    directives: {
      ClickOutside,
    },
    fetch({store, app, req, redirect, route}) {
      app.axios.init(req)
      return store.dispatch('fetchUserAccount').catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    head() {
      return {
        title: '订单管理' +
        this.$t('global.pageTitle.common')
      }
    },
    components: {
      cBlock,
      Blank,
      ConfirmReceipt,
      ViaPagination,
      TableHeadDropdown,
      QrcodePopover,
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
      commonTableFields() {
        return {
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
          _isBuySide: {
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
              width: '120px',
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
              width: '130px',
            },
            sortable: false,
          },
          cash_amount: {
            label: '总价',
            thClass: ['text-center'],
            tdClass: ['text-center'],
            thStyle: {
              width: '140px',
            },
            sortable: false,
          },
          _counterpartyName: {
            label: '交易对象',
            thClass: ['text-center'],
            tdClass: ['text-center'],
            thStyle: {
              width: '150px',
            },
            sortable: false,
          },
        }
      },
      orderTableFields() {
        const orderFields = {
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
            tdClass: ['text-right', 'pr-30', 'order-status'],
            thStyle: {
              textAlign: 'center',
            },
            sortable: false,
          },
        }
        return Object.assign({}, this.commonTableFields, orderFields)
      },
      appealTableFields() {
        const orderFields = {
          appeal_time: {
            label: '申诉时间',
            thClass: ['text-center'],
            tdClass: ['text-center'],
            thStyle: {
              width: '190px',
            },
            sortable: false,
          },
          appeal_status: {
            label: '申诉状态',
            thClass: ['text-center'],
            tdClass: ['text-center'],
            sortable: false,
          },
        }
        return Object.assign({}, this.commonTableFields, orderFields)
      }
    },
    mounted() {
      // browser only
      this.Visibility = require('visibilityjs')
      this.Visibility.change(this.onVisibilityChange)
      this.initOrderList()
      this.startTimer()
      this.startRefreshOrders()
      this.$nuxt.$on('IM.Event.UNREAD_MESSAGES_COUNT_UPDATE', conversations => {
        conversations.forEach(conv => {
          const findItem = this.orderTableItems.find(item => {
            return item.conversation_id === conv.id
          })
          if (findItem) {
            this.$set(findItem, '_unreadMessageCount', conv.unreadMessagesCount)
          }
        })
      })
    },
    beforeDestroy() {
      clearInterval(this.timer) // 清除定时器
      this.stopRefreshOrders()
      this.Visibility.unbind(this.onVisibilityChange)
      this.$nuxt.$off('IM.Event.UNREAD_MESSAGES_COUNT_UPDATE')
    },
    watch: {
      'chat.imClient'(newVal, oldVal) {
        if (newVal && !oldVal) { // 直接刷新页面情况可能出现IM还没初始化，需要延迟获取未读消息
          this.getUnreadMsgCount()
        }
      },
    },
    methods: {
      onVisibilityChange() {
        if (!this.Visibility.hidden()) {
          this.startRefreshOrders()
        } else {
          this.stopRefreshOrders()
        }
      },
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
      getUnreadMsgCount() {
        if (this.chat.imClient) {
          const task = this.orderTableItems.map(item => {
            if (item.conversation_id) {
              return this.chat.imClient.getConversation(item.conversation_id)
            }
            return Promise.resolve({unreadMessagesCount: 0})
          })
          Promise.all(task).then(res => {
            res.forEach((item, index) => {
              if (item) {
                this.orderTableItems[index]._unreadMessageCount = item.unreadMessagesCount
              }
            })
          }).catch(console.error)
        }
      },
      initOrderList() {
        this.asyncFetchOrderList().then((res) => {
          if (res.code === 0 && res.data) {
            const {data, curr_page: currentPage, total: totalRows} = res.data
            this.queryParams.page = currentPage
            this.queryParams.totalRows = totalRows
            this.orderTableItems = data.map(item => this.preprocessOrder(item))
            this.getUnreadMsgCount()
          } else {
            this.orderTableItems = []
          }
        }).catch(err => {
          console.log(err)
          this.axios.onError(err)
        })
      },
      preprocessOrder(item) {
        let counterparty
        if (this.isMerchant(item)) { // 商家
          counterparty = item.user
        } else { // 普通用户
          counterparty = item.merchant
        }
        let selectedPaymentMethod = {}
        if (item.payment_methods && item.payment_methods.length) {
          selectedPaymentMethod = {...item.payment_methods[0]}
        }
        const expireTime = item.place_time * 1000 + ORDER_PAY_TIME * 60000
        const remainingTime = parseInt((expireTime - Date.now()) / 1000) // 订单付款截止时间 = 创建时间 + 可付款时间(15min)
        return {
          ...item,
          _selected_payment_method: selectedPaymentMethod, // 下划线前缀均为自定义属性（下同）用户选中的支付方式
          _remaining_time: remainingTime,
          _expire_time: expireTime,
          _expired: remainingTime <= 0 && item.status === this.constant.ORDER_STATUS.CREATED.value,
          _isBuySide: (item.merchant_id === this.user.account.id) === (item.merchant_side === this.constant.SIDE.BUY),
          _counterparty: counterparty, // 对手方
          _counterpartyName: counterparty.name, // 交易对象
          _unreadMessageCount: 0, // 未读消息数量
        }
      },
      onClickItemId(id) {
        this.$router.push(`/orders/${id}`)
      },
      onRowClick(record, index, event) {
        if (this.queryParams.status === 'processing') {
          if (!record._showDetails) {
            this.$set(record, '_showDetails', true) // 首次添加属性需要调用set方法
          } else {
            record._showDetails = !record._showDetails
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
          }, 10000)
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
            <div class="text-left"><p class="c-red">如您已向卖家付款，取消订单您将会损失付款资金。</p>
              <p>温馨提示：买方每日累计取消订单超过3笔，将被限制当日交易功能和广告功能。</p>
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
            this.getUnreadMsgCount()
          } else {
            this.orderTableItems = []
          }
        }).catch(err => {
          console.log(err)
          this.axios.onError(err)
        })
      },
      showAppealMark(item) {
        return this.queryParams.status !== this.ORDERS_FILTERS.APPEAL && (item.appeal_status === this.constant.APPEAL_STATUS.CREATED || item.appeal_status === this.constant.APPEAL_STATUS.PENDING || item.appeal_status === this.constant.APPEAL_STATUS.PROCESSING)
      },
      copySuccess() {
        this.copyed = true
        setTimeout(() => {
          this.copyed = false
        }, 2000)
      },
      clickNetPhone(item) {
        if (item.network_phone && item.network_phone.length) {
          this.$showDialog({
            title: '联系对方',
            content: (<div>
              <p class="c-dark fz-20">{item.network_phone}</p>
              <p class="c-gray">平台会对双方号码做隐私保护，请务必使用{this.user.account.mobile}拨打，否则将无法接通</p>
            </div>),
            okTitle: '我知道了',
            okOnly: true,
          })
        }
      },
      onClickOutsidePayment() {
        if (this.isShowPaymentMethod) {
          this.isShowPaymentMethod = false
        }
      },
      choosePayment({item, index, payment}) {
        this.isShowPaymentMethod = false
        item._selected_payment_method = {...payment}
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
      margin-top: 28px;
      position: relative;
      &:before {
        content: '';
        border-left: 1px solid #9b9b9b;
        position: absolute;
        left: 166px;
        height: 26px;
      }
      button {
        /* 这种border变gradient的按钮如果不指定高宽会抖动 */
        width: 62px;
        height: 26px;
        position: relative;
        margin-right: 24px;
        &:last-of-type {
          width: 90px;
          padding: 0 6px;
          margin-left: 24px;
          i {
            font-size: 12px;
          }
        }
      }
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
      .message-btn {
        display: inline-block;
        position: relative;
        width: 28px;
        height: 28px;
        text-align: center;
        color: #52cbca;
        line-height: 28px;
        .iconfont {
          font-size: 13px;
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
          right: 12px;
          height: 6px;
          width: 6px;
          border-radius: 50%;
          top: 8px;
          transform: translate3d(100%, -50%, 0);
          background-color: #e35555;
          border: solid 1px #fff;
          display: inline-block;
        }
      }
      .detail-warn-text {
        height: 38px;
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
      .order-status{
        min-width: 140px;
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
        td {
          padding: 0 !important;
          .buy-side-detail {
            border-top: solid 1px #ffbc32;
          }
          .sell-side-detail {
            border-top: solid 1px #52cbca;
          }
        }
      }

      .order-detail {
        display: flex;
        justify-content: space-between;
        padding: 30px;
        .details-wrapper {
          flex: 5;
        }
        .payment-wrapper {
          flex: 1;
        }
      }
      .details-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .order-step {
          color: #27313e;
          font-size: 18px;
          font-weight: 500;
          .warning-text {
            color: #e35555;
          }
        }
        .payment-warning {
          margin-top: 10px;
          color: #e35555;
          font-size: 14px;
        }
        .order-other-side {
          margin-top: 10px;
          .other-name {
            margin-right: 10px;
          }
        }
        .payment-method {
          margin-top: 10px;
          .payment-account {
            margin-left: 30px;
            font-size: 14px;
            color: #192330;
            .payment-account-col {
              display: inline-block;
              margin: 0 10px;
            }
          }
          .order-payment-copy {
            color: #52cbca;
            cursor: pointer;
            font-size: 15px;
          }
          .select-wrap {
            position: relative;
            display: inline-block;
            width: 80px;
            color: #192330;
            font-size: 14px;
          }
          .select-head {
            span {
              display: inline-block;
              width: 46px;
            }
          }
          .select-option {
            position: absolute;
            width: 80px;
            background-color: #fff;
            z-index: 5;
            box-shadow: 0 0 20px 0 #ececec;
            li {
              line-height: 30px;
              padding-left: 5px;
              text-align: left;
              cursor: pointer;
              &:not(:last-child) {
                border-bottom: 1px solid #e9ecef;
              }
            }
            .select-item-placeholder {
              display: inline-block;
              width: 16px;
              height: 16px;
              line-height: 16px;
            }
            .selected {
              color: #52cbca;
              .icon-tick {
                visibility: visible;
              }
            }
          }

          .show {
            display: block;
          }
          .payments {
            font-size: 14px;
            color: #192330;
          }
        }

      }
      .payment-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .detail-btn-wrapper {
          margin-top: 16px;
          .cancel-order-btn {
            font-size: 14px;
          }
        }
        .detail-btn {
          padding: 3px 24px;
          height: 30px;
        }
        .detail-waiting {
          font-size: 18px;
          color: #27313e;
        }
        .waitcoin{
          padding: 7px 19px;
          border: 1px solid #ddd;
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
