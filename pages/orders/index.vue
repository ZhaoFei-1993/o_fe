<template>
  <div class="page-order">
    <c-block>
      <header class="header">订单管理</header>
      <div class="filter-wapper">
        <div @click="onClickFilter(index)" v-for="(item, index) in filterOptions" class="filter-item" :class="{'filter-active': item.active}">{{ item.text }}</div>
      </div>
      <div class="order-table">
        <b-table :fields="orderTableFields" :items="orderTableItems">
          <template slot="id" slot-scope="{ item }">
            <b-link>{{ item.id }}</b-link>
          </template>
          <template slot="_order_type" slot-scope="{ item }">
            <!-- 自定义的属性 -->
            <span :class="['order-type', item._order_type === 'buy' ? 'order-type-buy' : 'order-type-sell']">
              {{ item._order_type === 'buy' ? '买' : '卖' }}
            </span>
          </template>
          <template slot="coin_amount" slot-scope="{ item }">
            {{ item.coin_amount | formatMoney }}
          </template>
          <template slot="cash_amount" slot-scope="{ item }">
            {{ item.cash_amount | formatMoney }}
          </template>
          <template slot="status" slot-scope="{ item, detailsShowing, toggleDetails }">
            {{ orderStatus[item.status.toUpperCase()].text }}
            <span @click.stop="toggleDetails" v-if="item.status === 'created'" class="detail" :class="[ detailsShowing ? 'show-detail' : 'hidden-detail' ]"><i class="iconfont icon-detail"></i></span>
          </template>
          <template slot="row-details" slot-scope="{ item }">
            <div class="detail-wrapper">
              <div class="col1">
                <div class="detail-h1">
                  <i class="iconfont icon-arrow-up"></i>
                  <span>购买 {{ item.coin_type }}</span>
                </div>
                <div class="detail-h2">
                  向<b-link>{{ item.pay_method.accouont_no }}</b-link>
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
                <div class="payment-method">
                  <i v-if="item._payment_method.method === 'wechat'" class="iconfont icon-wechat-round"></i>
                  <i v-if="item._payment_method.method === 'bankcard'" class="iconfont icon-bankcard"></i>
                  <i v-if="item._payment_method.method === 'alipay'" class="iconfont icon-alipay"></i>
                  <select v-model="item._payment_method">
                    <option v-for="payment in item.merchantPaymentMethods" :value="payment">
                      <span v-if="payment.method === 'bankcard'">银行转帐</span>
                      <span v-if="payment.method === 'wechat'">微信支付</span>
                      <span v-if="payment.method === 'alipay'">支付宝支付</span>
                    </option>
                  </select>
                </div>
              </div>
              <div class="col4">
                <div class="detail-text">
                  {{ item._payment_method.account_name }}
                </div>
                <div class="detail-text">
                  {{ item._payment_method.account_no }}
                  <b-popover :target="`qr-${item.id}`"
                    placement="top"
                    triggers="hover focus">
                    <img style="display: block;width: 120px;height: 120px;" :src="item._payment_method.qr_code_image">
                  </b-popover>
                  <span :id="`qr-${item.id}`" style="cursor: pointer;" v-show="item._payment_method.method !== 'bankcard'"><i class="iconfont icon-qrcode"></i></span>
                </div>
                <div v-if="item._payment_method.method === 'bankcard'" class="detail-text">
                  {{ item._payment_method.bank }}，{{ item._payment_method.branch }}
                </div>
                <div class="detail-text">
                  备注参考号：<span class="detail-code">{{ `${item.id}`.substr(`${item.id}`.length - 6) }}</span>
                </div>
                <div class="detail-text detail-warn-text">
                  转账时除参考号外请不要备注任何信息，防止卡被冻结!
                </div>
              </div>
              <div class="col5">
                <div class="detail-text detail-timer">
                  还剩11分10秒
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
              </div>
            </div>
          </template>
        </b-table>
        <blank v-if="!orderTableItems.length"></blank>
      </div>
    </c-block>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import cBlock from '~/components/c-block'
  import Blank from '~/components/blank'
  import { ORDER_STATUS } from '~/modules/constant'

  export default {
    data() {
      return {
        selectedPaymentMethod: {},
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
            thClass: [ 'text-left' ],
            tdClass: [ 'text-center' ],
          },
          _order_type: {
            label: '类型',
            thStyle: {
              width: '80px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          coin_type: {
            label: '币种',
            thStyle: {
              width: '120px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          coin_amount: {
            label: '数量',
            thStyle: {
              width: '160px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          price: {
            label: '单价',
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            thStyle: {
              width: '160px',
            },
            sortable: false,
          },
          cash_amount: {
            label: '总价',
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            thStyle: {
              width: '180px',
            },
            sortable: false,
          },
          place_time: {
            label: '下单时间',
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            thStyle: {
              width: '160px',
            },
            sortable: false,
          },
          status: {
            label: '状态',
            tdClass: [ 'text-center' ],
            thStyle: {
              textAlign: 'center',
            },
            sortable: false,
          },
        },
        orderTableItems: [],
        queryParams: {},
        orderStatus: ORDER_STATUS,
      }
    },
    async asyncData({ app, req, redirect, route }) {
      try {
        const user = { id: 1 }
        const merchant = { id: 111 }
        const queryParams = {
          status: 'processing',
          page: 1,
          limit: 30,
        }
        app.axios.init(req)
        const [orderData, paymentData] = await Promise.all([
          app.axios.order.getOrderList(queryParams),
          app.axios.user.payments(merchant.id),
        ])
        console.log(orderData)
        let orderTableItems = []
        let paymentMethods = []
        let selectedPaymentMethod = {}
        if (paymentData.code === 0 && paymentData.data) {
          paymentMethods = paymentData.data
          selectedPaymentMethod = paymentMethods[0]
        }
        if (orderData.code === 0 && orderData.data) {
          orderTableItems = orderData.data.data.map(item => {
            let orderType
            if (user.id === item.user_id) { // taker
              orderType = item.user_side
            } else if (user.id === item.merchant_id) {
              orderType = item.merchant_side
            }
            return {
              ...item,
              _order_type: orderType,
              _payment_method: selectedPaymentMethod,
              merchantPaymentMethods: require('../../services/mock/user').paymentMethods.data,
              place_time: app.utils.getTimeText(item.place_time),
            }
          })
        }
        return {
          queryParams,
          orderTableItems,
          paymentMethods,
          selectedPaymentMethod,
        }
      } catch (err) {
        console.log(err)
        // app.axios.needAuth(err, redirect, route.fullPath)
      }
    },
    components: {
      cBlock,
      Blank,
    },
    computed: {
      ...mapState(['user']),
    },
    methods: {
      confirmPay(item) {
        this.$showDialog({
          hideHeader: true,
          title: '确认付款',
          content: (<div>确认您已向买方付款？<span class="c-red">未付款点击“我已付款”将被冻结账户。</span></div>),
          onOk: () => {
            this.axios.order.updatePayMethod(item.id, item._payment_method).then(response => {
              this.axios.order.confirmPay(item.id)
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
            this.axios.order.cancelOrder(item.id).then(response => {
              console.log(response)
            })
          }
        })
      },
      confirmReceipt(item) {
        this.$showDialog({
          hideHeader: true,
          title: '确认收款',
          content: (<div>确认已收到该笔款项？<span class="c-red">如您没有收到买家付款，确认收款后，放行的数字货币将无法追回。</span></div>),
          onOk: () => {
            this.axios.order.confirmReceipt(item.id).then(response => {
              console.log(response)
            })
          }
        })
      },
      renderOrderList() {
        this.axios.order.getOrderList(this.queryParams)
          .then((res) => {
            if (res.code === 0 && res.data) {
              this.orderTableItems = res.data.data
            } else {
              this.orderTableItems = []
            }
          })
          .catch(err => {
            this.axios.onError(err)
          })
      },
      onClickFilter(index) {
        for (let i = 0; i < this.filterOptions.length; i++) {
          if (i !== index) {
            this.filterOptions[i].active = false
          } else if (this.queryParams.status !== this.filterOptions[i].value) {
            this.filterOptions[i].active = true
            this.queryParams.status = this.filterOptions[i].value
            this.renderOrderList()
          }
        }
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
    .order-table {
      margin: 20px -30px 0;
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
          flex: 1;
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
          flex: 1;
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
      }
    }
  }
</style>