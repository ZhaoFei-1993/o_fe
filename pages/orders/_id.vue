<template>
  <div v-if="order" class="page-order-detail">
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
        <div class="payment-method" v-if="showPayment">
          <template v-if="order.status ===constant.ORDER_STATUS.CREATED.value">
            <span v-if="isBuySide">
              <i v-if="selectedMethod.method === constant.PAYMENT_TYPES.WECHAT" class="iconfont icon-wechat-round"></i>
              <i v-if="selectedMethod.method === constant.PAYMENT_TYPES.BANKCARD" class="iconfont icon-bankcard"></i>
              <i v-if="selectedMethod.method === constant.PAYMENT_TYPES.ALIPAY" class="iconfont icon-alipay"></i>
              <select v-model="selectedMethod">
                <option v-for="payment in order.payment_methods" :value="payment" :class="payment.method">
                  <span v-if="payment.method === constant.PAYMENT_TYPES.BANKCARD">银行转帐</span>
                  <span v-if="payment.method === constant.PAYMENT_TYPES.WECHAT">微信支付</span>
                  <span v-if="payment.method === constant.PAYMENT_TYPES.ALIPAY">支付宝支付</span>
                </option>
              </select>
            </span>
          </template>
          <template v-else>
            <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.BANKCARD">
            <i class="mr-10 iconfont icon-bankcard"></i>银行转帐</span>
            <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.WECHAT"><i
              class="mr-10 iconfont icon-wechat-round"></i>微信支付</span>
            <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.ALIPAY"><i
              class="mr-10 iconfont icon-alipay"></i>支付宝支付</span>
          </template>
          <span class="payment-account">{{selectedMethod.account_name + ' '+ selectedMethod.account_no}}</span>
          <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.BANKCARD"
                class="detail-text">
            {{ selectedMethod.bank }}，{{ selectedMethod.branch }}
          </span>
          <span class="qr-code-button"
                v-if="selectedMethod.method!==constant.PAYMENT_TYPES.BANKCARD && selectedMethod.qr_code_image"
                @click="showQrCode(selectedMethod.qr_code_image_url)">查看支付二维码</span>
        </div>
        <div class="payment-status" v-html="paymentStatusMessage.message"></div>
        <div class="payment-warning">{{paymentStatusMessage.warning}}</div>
      </div>
      <div class="order-steps">
        <ol>
          <li :class="['step',{active:order.status===constant.ORDER_STATUS.CREATED.value}]"
              v-if="(order.status!==constant.ORDER_STATUS.CANCEL.value||order.pay_time)&&order.status!==constant.ORDER_STATUS.CLOSED.value">
            <div class="message">{{stepsMessage.payCash}}</div>
            <div class="step-time" v-if="order.pay_time">{{order.pay_time | getTimeText}}</div>
            <b-btn v-if="isBuySide && !order.pay_time"
                   :disabled="expired"
                   size="xs" variant="gradient-yellow"
                   @click="confirmPay()">
              我已付款
            </b-btn>
          </li>
          <li :class="['step',{active:order.status===constant.ORDER_STATUS.PAID.value}]"
              v-if="order.status!==constant.ORDER_STATUS.CANCEL.value&&order.status!==constant.ORDER_STATUS.CLOSED.value">
            <div class="message">{{stepsMessage.payCoin}}</div>
            <div class="step-time" v-if="order.complete_time">{{order.complete_time| getTimeText}}</div>
            <button v-if="!isBuySide&&order.status===constant.ORDER_STATUS.PAID.value"
                    class="btn btn-gradient-yellow btn-xs"
                    @click="confirmReceipt()">确认收款
            </button>
          </li>
          <li :class="['step',{active:order.status===constant.ORDER_STATUS.SUCCESS.value}]"
              v-if="order.status!=='cancel'&&order.status!==constant.ORDER_STATUS.CLOSED.value">
            <div class="message">{{stepsMessage.success}}</div>
            <div class="step-time" v-if="order.complete_time">{{order.complete_time| getTimeText}}</div>
          </li>
          <li :class="['step',{active:order.status===constant.ORDER_STATUS.CANCEL.value}]"
              v-if="order.status===constant.ORDER_STATUS.CANCEL.value">
            <div class="message">{{stepsMessage.cancel}}</div>
          </li>
          <li :class="['step',{active:order.status===constant.ORDER_STATUS.CLOSED.value}]"
              v-if="order.status===constant.ORDER_STATUS.CLOSED.value">
            <div class="message">{{stepsMessage.closed}}</div>
          </li>
        </ol>
      </div>
      <div class="order-helper">
        <div v-if="canCancel" class="d-flex align-items-center justify-content-between">
          <span>想要终止交易？</span>
          <b-btn size="xs" variant="outline-green" :disabled="expired" @click="cancelOrder">取消订单</b-btn>
        </div>
        <template v-if="showAppeal">
          <span v-if="!appeal||appeal.status===''">
          交易出现问题？需要
          <span class="c-brand-green appeal-btn" v-if="canAppeal" @click="startAppeal">申诉</span>
          <span class="c-brand-green appeal-btn" v-else v-b-tooltip.hover title="买家付款30分钟后，可发起申诉。">申诉</span>
        </span>
        </template>
        <template v-if="appeal">
          <div v-if="appeal.status===constant.APPEAL_STATUS.CREATED"
               class="d-flex align-items-center justify-content-between">
            <span>{{appealSide}}已发起申诉，请等待申诉专员介入</span>
            <button v-if="isCurrentUserAppealing" class="btn btn-outline-green btn-xs" @click="cancelAppeal">取消申诉
            </button>
          </div>
          <div v-if="appeal.status===constant.APPEAL_STATUS.PROCESSING"
               class="d-flex align-items-center justify-content-between">
            <span>申诉专员已经介入，请及时提供必要的信息</span>
            <button v-if="isCurrentUserAppealing" class="btn btn-outline-green btn-xs" @click="cancelAppeal">取消申诉
            </button>
          </div>
          <div v-if="appeal.status===constant.APPEAL_STATUS.CANCEL">
            <span>{{appealSide}}已取消申诉，如果仍有问题，请</span>
            <b-link href="https://otc.coinex.com/res/support/ticket" target="_blank">提交工单</b-link>
          </div>
          <div v-if="appeal.status===constant.APPEAL_STATUS.COMPLETED">
            <span>申诉裁决：{{appealResult}}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="sidebar">
      <CBlock class="my-sidebar-info" :x="0" :y="20">
        <UserStatsProfile :user-data="counterparty" v-if="counterparty"
                          :is-merchant="counterparty.id===order.merchant_id"/>
      </CBlock>
      <CBlock id="my-chat-box">
        <Chat :client="chat.imClient" :conversation-id="convId" :client-id="`${user.account.id}`"></Chat>
      </CBlock>
    </div>
    <b-modal ref="appealModal"
             title="交易申诉"
             @ok="submitAppeal"
             ok-variant="gradient-yellow"
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
                         :options="constant.appealReasonOptions"></b-form-select>
        </div>
        <div class="d-flex align-items-start mt-20">
          <span class="tip">申诉理由</span>
          <textarea class="appeal-input"
                    v-model="appealComment"
                    placeholder="请填写15-500字以上的申诉理由"
                    rows="8">
          </textarea>
        </div>
        <div :class="['text-right',appealCommentLength>500?'c-red':'c-gray']">{{appealCommentLength}}/500</div>
      </div>
    </b-modal>
    <ConfirmReceipt :orderId="order.id" :show-confirm-receipt-modal="showConfirmReceiptModal"
                    @confirmReceipt="refreshOrderStatus"
                    @cancelReceipt="showConfirmReceiptModal=false"/>
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
          color: #27313e;
          font-weight: 500;
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
              font-weight: 500;
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
      #my-chat-box {
        margin-top: 10px;
        padding: 0 !important;
      }
    }
    #appeal-modal {
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
    .user-stats-profile {
      .username {
        max-width: 300px;
      }
      .sidebar-info-item-title {
        width: 160px;
      }
    }
  }

  .payment-qrcode {
    max-width: 400px;
    max-height: 400px;
  }

</style>
<script>
  import Chat from '~/components/chat'
  import UserStatsProfile from '~/components/user-stats-profile.vue'
  import ConfirmReceipt from './_c/confirm-receipt'
  import {mapState} from 'vuex'

  const PAID_CAN_APPEAL = 30 * 60 * 1000 // 三十分钟
  const SUCCESS_CAN_APPEAL = 7 * 24 * 3600 * 1000 // 七天
  const ORDER_PAY_TIME = 15 // 15分钟（未换算）
  const REFRESH_ORDER_INTERVAL = 5000

  export default {
    data() {
      return {
        id: this.$route.params.id,
        counterparty: null,
        merchant: null,
        order: null,
        selectedMethod: null,
        secondCountdown: null,
        payRemainTime: 0,
        appeal: null,
        appealComment: null,
        appealReason: null,
        showConfirmReceiptModal: false,
        refreshOrderTimeout: null,
        convId: '',
      }
    },
    components: {
      UserStatsProfile,
      ConfirmReceipt,
      Chat,
    },
    fetch({store, app, req, redirect, route}) {
      app.axios.init(req)
      return Promise.all([
        store.dispatch('fetchUserAccount'),
        store.dispatch('fetchSystemConstant'),
      ]).catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    beforeDestroy() {
      clearInterval(this.secondCountdown)
      clearTimeout(this.refreshOrderTimeout)
    },
    mounted() {
      this.getCurrentOrder()
    },
    computed: {
      ...mapState(['user', 'constant', 'chat']),
      orderStatus() {
        return Object.values(this.constant.ORDER_STATUS).find(s => s.value === this.order.status).text
      },
      cannotSubmitAppeal() {
        return !(this.appealReason && this.appealComment && this.appealComment.length >= 15 && this.appealComment.length <= 500)
      },
      isMerchant() {
        return this.order.merchant_id === this.user.account.id
      },
      isBuySide() {
        return this.order.merchant_side === this.constant.SIDE.BUY ? this.isMerchant : !this.isMerchant
      },
      isBuyerAppeal() {
        if (!this.appeal) return false
        return this.order.user_side === this.constant.SIDE.BUY && this.appeal.user_id === this.order.user_id
      },
      appealSide() {
        if (!this.appeal) return null
        return this.isBuyerAppeal ? '买家' : '卖家'
      },
      isCurrentUserAppealing() {
        if (!this.appeal) return false
        return this.appeal.user_id === this.user.account.id
      },
      canAppeal() {
        // 支付后三十分钟以后 和 完成后七天内可以申诉
        const paid = this.order.status === this.constant.ORDER_STATUS.PAID.value
        const success = this.order.status === this.constant.ORDER_STATUS.SUCCESS.value
        return (paid && this.utils.getTimeDifference(this.order.pay_time) > PAID_CAN_APPEAL) ||
          (success && this.utils.getTimeDifference(this.order.complete_time) < SUCCESS_CAN_APPEAL)
      },
      appealCommentLength() {
        return this.appealComment ? this.appealComment.length : 0
      },
      showAppeal() {
        // 支付后立即 和 完成后七天内展示申诉提示
        const paid = this.order.status === this.constant.ORDER_STATUS.PAID.value
        const success = this.order.status === this.constant.ORDER_STATUS.SUCCESS.value
        return paid ||
          (success && this.utils.getTimeDifference(this.order.complete_time) < SUCCESS_CAN_APPEAL)
      },
      canCancel() {
        const orderStatusOk = this.order.status === this.constant.ORDER_STATUS.CREATED.value || this.order.status === this.constant.ORDER_STATUS.PAID.value
        const noAppeal = !this.appeal || this.appeal.status === this.constant.APPEAL_STATUS.CANCEL
        return this.isBuySide && orderStatusOk && noAppeal
      },
      showPayment() {
        const createdBuyer = this.order.status === this.constant.ORDER_STATUS.CREATED.value && this.isBuySide
        const paid = this.order.status === this.constant.ORDER_STATUS.PAID.value
        const success = this.order.status === this.constant.ORDER_STATUS.SUCCESS.value
        return this.selectedMethod && (createdBuyer || paid || success) && !this.expired
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
        // 去最后六位，防止后端返回数字，都先转换为字符串
        return `${this.order.id}`.lastChars()
      },
      expired() {
        return this.order.status === this.constant.ORDER_STATUS.CREATED.value && this.payRemainTime <= 0
      },
      paymentStatusMessage() {
        let payMessage = '订单已超时'
        if (this.payRemainTime > 0) {
          payMessage = `
                待支付，买方需在
                <span class="c-red">${Math.floor(this.payRemainTime / 60)}分${this.payRemainTime % 60}秒</span>
                内完成支付，付款参考号：<span class="c-red">${this.referCode}</span>
                `
        }
        switch (this.order.status) {
          case this.constant.ORDER_STATUS.CREATED.value:
            return {
              message: payMessage,
              warning: this.isBuySide && !this.expired ? `请使用实名付款，转账时除参考号外请不要备注任何信息！` : null,
            }
          case this.constant.ORDER_STATUS.PAID.value:
            return {
              message: `已支付，卖方需确认收款并放行数字币，付款参考号：<span class="c-red">${this.referCode}</span>`,
              warning: this.isBuySide ? undefined : '请务必确认收到款项后确认收款并核实买家是否实名付款。'
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
        if (!this.appeal) {
          return ''
        }
        return this.constant.APPEAL_RESULT_MAP[this.appeal.result].text + ' 订单处理：' + this.constant.ORDER_RESULT_MAP[this.appeal.order_result].text
      }
    },
    methods: {
      getCurrentOrder() {
        this.axios.order.getOrderById(this.id).then(response => {
          if (response.code === 0) {
            this.order = response.data
            this.convId = this.order.conversation_id // 聊天对话id
            this.selectedMethod = this.order.payment_methods[0]
            this.counterparty = this.user.account.id === this.order.user_id ? this.order.merchant : this.order.user
            this.checkOrderStatus()
            if (this.order.status === this.constant.ORDER_STATUS.PAID.value || this.order.status === this.constant.ORDER_STATUS.SUCCESS.value) {
              this.getAppeal()
            }
          }
        }).catch(err => {
          if (err.code === 401) {
            this.axios.needAuth(err, this.$router.push, this.$route.fullPath)
          } else {
            this.$router.push('/')
            this.axios.onError(err)
          }
        })
      },
      getAppeal() {
        this.axios.order.getAppeal(this.order.id).then(response => {
          this.appeal = response.data
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      refreshOrderStatus() {
        this.axios.order.refreshOrderStatus(this.id).then(response => {
          this.order = Object.assign({}, this.order, response.data)
          this.checkOrderStatus()
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      checkOrderStatus() {
        if (this.order.status === this.constant.ORDER_STATUS.CREATED.value || this.order.status === this.constant.ORDER_STATUS.PAID.value || this.order.appeal_status !== '') {
          if (this.order.status === this.constant.ORDER_STATUS.CREATED.value) {
            this.payRemainTime = Math.floor(((this.order.place_time + ORDER_PAY_TIME * 60) * 1000 - Date.now()) / 1000)
            clearInterval(this.secondCountdown)
            this.secondCountdown = setInterval(() => {
              if (this.payRemainTime > 0) {
                this.payRemainTime--
              } else {
                clearInterval(this.secondCountdown)
              }
            }, 1000)
          }
          if (this.order.status === this.constant.ORDER_STATUS.PAID.value) {
            this.selectedMethod = this.order.payment_methods[0]
          }
          this.refreshOrderTimeout = setTimeout(() => {
            this.refreshOrderStatus()
          }, REFRESH_ORDER_INTERVAL)
        }
      },
      confirmPay() {
        this.$showDialog({
          title: '确认付款',
          content: (<div class="text-left">确认您已向卖方付款？<p class="c-red">未付款点击“我已付款”将被冻结账户。</p></div>),
          onOk: () => {
            this.axios.order.confirmPay(this.order.id, this.selectedMethod).then(res => {
              this.$successTips('确认付款成功')
            }).catch(err => {
              this.axios.onError(err)
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
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      cancelAppeal() {
        this.$showDialog({
          title: '取消申诉',
          content: (<div class="text-left"><p>确认取消申诉？</p><p class="c-red">取消申诉后的订单将不可再次申诉。</p></div>),
          onOk: () => {
            this.axios.order.cancelAppeal(this.order.id).then(() => {
              this.getAppeal()
            }).catch(err => {
              this.axios.onError(err)
            })
          }
        })
      },
      cancelOrder() {
        this.$showDialog({
          title: '取消订单',
          content: (<div class="text-left"><p>确认取消订单？</p><p class="c-red">取消的订单将不可重新打开。</p></div>),
          onOk: () => {
            this.axios.order.cancelOrder(this.order.id).then(() => {
              this.refreshOrderStatus()
            })
          }
        })
      },
      showQrCode(codeImg) {
        this.$showDialog({
          title: '支付二维码',
          content: (<div><img class="payment-qrcode" src={codeImg}/></div>),
          okOnly: true,
        })
      },
      confirmReceipt() {
        this.showConfirmReceiptModal = true
      }
    }
  }
</script>
