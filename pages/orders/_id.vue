<template>
  <div v-if="order&&merchant" class="page-order-detail">
    <div class="main-content">
      <div class="order-basic-info">
        <div class="info-header">
          <span class="c-black">订单#{{order.id+' '}}详情</span>
          <span class="c-6f">交易状态：<span class="c-brand-yellow fz-18">{{orderStatus}}</span></span>
        </div>
        <div class="info-detail">
          <div class="title">{{paymentTitle}}</div>
          <div class="content">
            {{paymentOrigin}}
          </div>
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
          <span class="payment-account">{{selectedMethod.account_name + ' '+ selectedMethod.account_no}}</span>
          <span class="qr-code-button" v-if="selectedMethod.qr_code_image">支付二维码</span>
        </div>
        <div class="payment-method" v-if="order.pay_method">
          <span v-if="order.pay_method === 'bankcard'"><i class="iconfont icon-bank"></i>银行转帐</span>
          <span v-if="order.pay_method === 'wechat'"><i class="iconfont icon-wechat-round"></i>微信支付</span>
          <span v-if="order.pay_method === 'alipay'"><i class="iconfont icon-wechat-round"></i>支付宝支付</span>
        </div>
        <div class="payment-status" v-html="paymentStatusMessage.message"></div>
        <div class="payment-warning">{{paymentStatusMessage.warning}}</div>
      </div>
      <div class="order-steps">
        <ol>
          <li :class="['step',{active:order.status==='created'}]"
              v-if="(order.status!=='cancel'||order.pay_time)&&order.status!=='closed'">
            <div class="message">{{stepsMessage.payCash}}</div>
            <div class="step-time" v-if="order.pay_time">{{order.pay_time | getTimeText}}</div>
            <button v-if="isBuySide&&!order.pay_time" class="btn btn-gradient-yellow btn-xs" @click="confirmPay()">
              我已付款
            </button>
          </li>
          <li :class="['step',{active:order.status==='paid'}]" v-if="order.status!=='cancel'&&order.status!=='closed'">
            <div class="message">{{stepsMessage.payCoin}}</div>
            <div class="step-time" v-if="order.complete_time">{{order.complete_time| getTimeText}}</div>
            <button v-if="!isBuySide&&order.status==='paid'" class="btn btn-gradient-yellow btn-xs"
                    @click="confirmReceipt()">确认收款
            </button>
          </li>
          <li :class="['step',{active:order.status==='success'}]"
              v-if="order.status!=='cancel'&&order.status!=='closed'">
            <div class="message">{{stepsMessage.success}}</div>
            <div class="step-time" v-if="order.complete_time">{{order.complete_time| getTimeText}}</div>
          </li>
          <li :class="['step',{active:order.status==='cancel'}]" v-if="order.status==='cancel'">
            <div class="message">{{stepsMessage.cancel}}</div>
          </li>
          <li :class="['step',{active:order.status==='closed'}]" v-if="order.status==='closed'">
            <div class="message">{{stepsMessage.closed}}</div>
          </li>
        </ol>
      </div>
      <div class="order-helper">
        <span v-if="!appeal||appeal.status===''">
          交易出现问题？需要
          <span class="c-brand-green appeal-btn" v-if="canAppeal" @click="startAppeal">申诉</span>
          <span class="c-brand-green appeal-btn" v-else v-b-tooltip.hover title="买家付款30分钟后，可发起申诉。">申诉</span>
        </span>
        <template v-if="appeal">
          <div v-if="appeal.status==='created'" class="d-flex align-items-center justify-content-between">
            <span>{{appealSide}}已发起申诉，请等待申诉专员介入</span>
            <button class="btn btn-outline-green btn-xs" @click="cancelAppeal">取消申诉</button>
          </div>
          <div v-if="appeal.status==='processing'" class="d-flex align-items-center justify-content-between">
            <span>申诉专员已经介入，请及时提供必要的信息</span>
            <button class="btn btn-outline-green btn-xs" @click="cancelAppeal">取消申诉</button>
          </div>
          <div v-if="appeal.status==='cancel'">
            <span>{{appealSide}}已取消申诉，如果仍有问题，请</span>
            <b-link href="https://otc.coinex.com/res/support/ticket" target="_blank">提交工单</b-link>
          </div>
          <div v-if="appeal.status==='completed'">
            <span>申诉裁决：{{appealResult}}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="sidebar">
      <CBlock class="my-sidebar-info" :x="0" :y="20">
        <UserStatsProfile :user-data="counterparty" v-if="counterparty"/>
      </CBlock>
    </div>
    <b-modal ref="appealModal"
             title="交易申诉"
             @ok="submitAppeal"
             ok-variant="yellow"
             :ok-disabled="cannotSubmitAppeal"
             cancel-variant="outline-green"
             ok-title="确定"
             cancel-title="取消"
             button-size="sm"
             class="text-center"
    >
      <div id="appeal-modal" class="text-left fz-14 c-black">
        <p class="mb-40">提起申诉后，申诉专员将介入本次交易，直至申诉结束。恶意申诉者将被冻结账户。</p>
        <div class="d-flex align-items-center">
          <span class="tip">申诉原因</span>
          <b-form-select class="appeal-input" v-model="appealReason"
                         :options="constant.APPEAL_REASONS"></b-form-select>
        </div>
        <div class="d-flex align-items-start mt-20">
          <span class="tip">申诉理由</span>
          <textarea class="appeal-input"
                    v-model="appealComment"
                    placeholder="请填写十五字以上的申诉理由"
                    rows="8">
          </textarea>
        </div>
      </div>

    </b-modal>
  </div>
</template>
<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-order-detail {
    padding: 40px 0 118px 0px;
    width: 1200px;
    margin: 0 auto;
    min-height: 900px;
    display: flex;
    .main-content {
      flex: 1;
      padding: 0px;
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

      }
      .payment-info {
        padding: 20px 30px;
        background-color: #f9f9f9;
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
          .payment-account {
            margin: 0 1rem;
          }
          .qr-code-button {
            cursor: pointer;
          }
        }
        .payment-status {
          font-size: 18px;
        }
        .payment-warning {
          color: $red;
          margin-top: 10px;
        }
      }
      .order-steps {
        padding: 25px 30px;
        ol {
          list-style-type: none;
          border-bottom: 1px solid #eeeeee;
          li {
            counter-increment: level1;
            font-size: 16px;
            color: #6f6f6f;
            margin-bottom: 50px;
            width: 100%;
            position: relative;
            &.active {
              color: #192330;
              div:first-child {
                &:after {
                  position: absolute;
                  content: '';
                  width: 11px;
                  height: 11px;
                  border-radius: 50%;
                  background-color: $brandGreen;
                  border: 1px solid $brandGreen;
                  left: 40px;
                  top: 8px;
                }
              }
            }
            &:before {
              content: counter(level1) " "; /*Instead of ". " */
              color: $brandGreen;
              margin-right: 24px;
              position: absolute;
              left: 0;
              top: 0px;
            }
            &:not(:last-child):after {
              position: absolute;
              left: 45px;
              top: 18px;
              content: '';
              width: 0px;
              height: 64px;
              border-right: 1px solid $brandGreen;
            }
            div:first-child {
              position: relative;
              padding-left: 60px;
              &:before {
                position: absolute;
                content: '';
                width: 11px;
                height: 11px;
                border-radius: 50%;
                background-color: white;
                border: 1px solid $brandGreen;
                left: 40px;
                top: 8px;
              }
            }
            div.step-time {
              position: absolute;
              left: 60px;
            }
            button {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }
      .order-helper {
        padding: 0 30px 30px;
        font-size: 16px;
        .appeal-btn {
          cursor: pointer;
        }
      }
    }
    .sidebar {
      width: 400px;
      margin-left: 20px;
    }
  }

  #appeal-modal {
    width: 560px;
    .tip {
      width: 80px;
    }
    .appeal-input {
      width: 430px;
      border: solid 1px #dddddd;
      &:focus {
        border: solid 1px $brandGreen;
        outline: none;
      }
    }
    textarea {
      padding: 6px 12px;
      height: 182px;
      max-height: 182px;
    }
  }

</style>
<script>
  import UserStatsProfile from '~/components/user-stats-profile.vue'
  import {mapState} from 'vuex'

  const PAID_CAN_APPEAL_MIN = 30
  const SUCCESS_CAN_APPEAL_DAY = 7
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
        secondCountdown: null,
        payRemainTime: 0,
        appeal: null,
        appealComment: null,
        appealReason: null,
      }
    },
    components: {
      UserStatsProfile,
    },
    beforeDestroy() {
      clearInterval(this.secondCountdown)
    },
    mounted() {
      this.getCurrentOrder(true)
    },
    computed: {
      ...mapState(['user', 'constant']),
      orderStatus() {
        return Object.values(this.constant.ORDER_STATUS).find(s => s.value === this.order.status).text
      },
      cannotSubmitAppeal() {
        return !(this.appealReason && this.appealComment && this.appealComment.length > 15)
      },
      isBuySide() {
        return this.order.user_side === this.constant.SIDE.BUY ? (this.user.id === this.order.user_id) : (this.user.id !== this.order.user_id)
      },
      isBuyerAppeal() {
        return this.order.user_side === this.constant.SIDE.BUY ? (this.appeal.user_id === this.order.user_id) : (this.appeal.user_id !== this.order.user_id)
      },
      appealSide() {
        return this.isBuyerAppeal ? '买家' : '卖家'
      },
      canAppeal() {
        return true || (this.order.status === this.constant.ORDER_STATUS.PAID.value && this.utils.getTimeDifference(this.order.pay_time) > 60 * 1000 * PAID_CAN_APPEAL_MIN) ||
          (this.order.status === this.constant.ORDER_STATUS.SUCCESS.value && this.utils.getTimeDifference(this.order.complete_time) < 24 * 3600 * 1000 * SUCCESS_CAN_APPEAL_DAY)
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
        return '交易广告 #' + this.order.item_id + ' ，单价 ' + this.order.price + ' CNY/ ' + this.order.coin_type
      },
      referCode() {
        return this.order.id
      },
      paymentStatusMessage() {
        switch (this.order.status) {
          case this.constant.ORDER_STATUS.CREATED.value:
            return {message: `待支付，买方需在 <span class="c-red">${Math.floor(this.payRemainTime / 60)}分${this.payRemainTime % 60}秒</span>内完成支付，付款参考号：<span class="c-red">${this.referCode}</span>`}
          case this.constant.ORDER_STATUS.PAID.value:
            return {
              message: `已支付，卖方需确认收款并放行数字币，付款参考号：<span class="c-red">${this.referCode}</span>`,
              warning: '请务必确认收到款项后确认收款并核实买家是否实名付款。'
            }
          case this.constant.ORDER_STATUS.SUCCESS.value:
            return {message: `卖方已确认收款，付款参考号：<span class="c-red">${this.referCode}</span>`}
          case this.constant.ORDER_STATUS.CANCEL.value:
            return {message: `买家已取消交易，无法查看支付信息。`}
          case this.constant.ORDER_STATUS.CLOSED.value:
            return {message: `订单超时已关闭，无法查看支付信息。`}
          default:
            return {}
        }
      },
      stepsMessage() {
        return {
          payCash: `买家付款`,
          payCoin: `卖家确认收款，放行数字币`,
          success: '交易完成',
          closed: '订单已关闭',
          cancel: '订单已取消',
        }
      },
      appealResult() {
        // TODO
        return ''
      }
    },
    methods: {
      getCurrentOrder(withUsers) {
        this.axios.order.getOrderById(this.id).then(response => {
          if (response.code === 0) {
            this.order = response.data
            this.checkOrderStatus()
            // 随机测试maker,taker
            if (Math.random() < 0.5) {
              this.order.merchant_id = this.user.id
            } else {
              this.order.user_id = this.user.id
            }
            // TODO 删除以上测试用代码
            if (this.order.status === 'created') {
              this.payRemainTime = Math.floor(((this.order.pay_time + 15 * 60) * 1000 - Date.now()) / 1000)
              clearInterval(this.secondCountdown)
              this.secondCountdown = setInterval(() => {
                if (this.payRemainTime > 0) {
                  this.payRemainTime--
                } else {
                  clearInterval(this.secondCountdown)
                }
              }, 1000)
            }
            if (this.order.status === this.constant.ORDER_STATUS.PAID.value || this.order.status === this.constant.ORDER_STATUS.SUCCESS.value) {
              this.getAppeal()
            }
            if (!withUsers) return
            // 以下订单相关用户信息只需要获取一次
            if (this.user.id === this.order.user_id) {
              this.counterpartyId = this.order.merchant_id
              this.axios.user.otherUserInfo(this.counterpartyId).then(res => {
                this.counterparty = res.data
                this.merchant = this.counterparty
                this.axios.user.payments(this.merchant.id).then(methods => {
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
      getAppeal() {
        this.axios.order.getAppeal(this.order.id).then(response => {
          this.appeal = response.data.data
        })
      },
      refreshOrderStatus() {
        this.axios.order.refreshOrderStatus(this.id).then(response => {
          this.order = Object.assign({}, this.order, response.data)
          this.checkOrderStatus()
        })
      },
      checkOrderStatus() {
        if (this.order.status === this.constant.ORDER_STATUS.CREATED.value || this.order.status === this.constant.ORDER_STATUS.PAID.value || this.order.appeal_status !== '') {
          setTimeout(() => {
            this.refreshOrderStatus()
          }, 20000)
        }
      },
      confirmPay() {
        this.$showDialog({
          title: '确认付款',
          content: (<div>确认您已向买方付款？<span class="c-red">未付款点击“我已付款”将被冻结账户。</span></div>),
          onOk: () => {
            this.axios.order.updatePayMethod(this.order.id, this.selectedMethod).then(response => {
              this.axios.order.confirmPay(this.order.id)
            })
          }
        })
      },
      confirmReceipt() {
        this.$showDialog({
          title: '确认收款',
          content: (<div>确认已收到该笔款项？<span class="c-red">如您没有收到买家付款，确认收款后，放行的数字货币将无法追回。</span></div>),
          onOk: () => {
            this.axios.order.confirmReceipt(this.order.id).then(response => {
              this.refreshOrderStatus()
            })
          }
        })
      },
      startAppeal() {
        this.$refs.appealModal.show()
      },
      submitAppeal() {
        this.axios.order.submitAppeal(this.order.id, this.appealReason, this.appealComment).then(_ => {
          this.getAppeal()
        })
      },
      cancelAppeal() {
        this.$showDialog({
          title: '取消申诉',
          content: (<div><p>确认取消申诉？</p><p class="c-red">取消申诉后的订单将不可再次申诉。</p></div>),
          onOk: () => {
            this.axios.order.cancelAppeal(this.order.id)
          }
        })
      }
    }
  }
</script>
