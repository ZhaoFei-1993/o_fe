<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-order-detail {
    padding: 0 0 60px 0px;
    width: 1200px;
    margin: 0 auto;
    min-height: 900px;
    display: flex;
    align-items: flex-start;
    .main-content {
      flex: 1;
      padding: 0px;
      overflow: hidden;
      box-shadow: 0 0 10px 0 #ececec;
      .c-block {
        &:not(:first-child) {
          margin-top: 10px;
        }
      }
      .order-box-head {
        padding: 9px 30px;
        font-size: 16px;
        color: #27313e;
      }
      .order-box-line {
        border-bottom: solid 1px #eeeeee;
      }
      .order-box-body {
        padding: 18px 30px;
        display: flex;
        justify-content: space-between;
      }
      .order-summary-box {
        .order-summary-wrapper {
          display: flex;
          align-items: center;
          padding: 14px 30px;
          .order-summary-icon {
            height: 21px;
            width: 15px;
          }
          .order-summary-left {
            display: inline-block;
            font-size: 22px;
            font-weight: 500;
            margin-left: 5px;
          }
          .order-summary-right {
            display: inline-block;
            margin-left: 11px;
          }
        }
      }
      .order-detail-box {
        .order-detail-body {
          .order-detail-title {
            color: #6f6f6f;
          }
          .order-detail-content {
            margin-top: 10px;
            font-size: 22px;
            &.order-detail-status {
              font-size: 18px;
              margin-top: 12px;
              .iconfont {
                vertical-align: baseline;
                font-size: 18px;
              }
            }
          }
        }
      }
      .order-step-box {
        .order-step-body {
          padding: 8px 30px 30px 30px;
          .payment-warning {
            margin-top: 10px;
          }
          .order-step-wrapper {
            position: relative;
            height: 25px;
            display: flex;
            align-items: center;
            .order-step-dot-line {
              display: inline-block;
              height: 2px;
            }
            .order-step-dot {
              border-radius: 100px;
              position: relative;
              .order-step-detail {
                width: 130px;
                position: absolute;
                top: 15px;
                .order-step-time {
                  font-size: 12px;
                  color: #6f6f6f;
                }
              }
            }
          }
          .order-step-body-title {
            color: #27313e;
            font-size: 18px;
            font-weight: 500;
            margin-top: 70px;
          }
          .link-to-wallet {
            margin-top: 10px;
          }
          .order-kyc-name {
            display: inline-block;
            margin-right: 20px;
          }
          .order-step-contact {
            margin-top: 10px;
            .order-step-contact-detail {
              display: inline-block;
              margin-left: 2px;
            }
          }
          .order-payment-method {
            margin-top: 38px;
            .order-payment-radio-group {
              display: flex;
              justify-content: flex-start;
              margin-left: 34px;
              margin-bottom: 26px;
              .order-payment-radio {
                font-size: 16px;
                color: #6f6f6f;
                width: 140px;
                .order-payment-radio-input {
                  display: none;
                  &:checked + label:before {
                    background-color: #52cbca;
                    border-color: #52cbca;
                    box-shadow: inset 0 0 0 2px #fff;
                  }
                }
                .order-payment-radio-label {
                  position: relative;
                  margin-bottom: 0;
                  &:before {
                    border-radius: 50%;
                    position: absolute;
                    top: 5px;
                    left: -32px;
                    width: 14px;
                    height: 14px;
                    content: '';
                    border: 1px solid #dddddd;
                  }
                  .order-payment-text {
                    display: inline-block;
                    margin-left: 6px;
                    font-size: 14px;
                  }
                }
              }
            }
            .order-payment-selected {
              display: inline-block;
              width: 120px;
            }
            .order-payment-account-wrapper {
              display: inline-block;
              height: 20px;
              .order-payment-copy {
                color: #52cbca;
                cursor: pointer;
                font-size: 15px;
              }
              .order-payment-col {
                display: inline-block;
                margin-right: 15px;
                .order-payment-account {
                  display: inline-block;
                  margin: 0 5px;
                }
              }
              .qrcode-popover {
                .icon-qrcode {
                  font-size: 15px;
                }
              }
            }
          }
          .order-payment-btn-wrapper {
            margin-top: 30px;
            .order-payment-btn-left {
              margin-right: 20px;
            }
            .order-wrating-seller {
              display: inline-block;
              width: 150px;
              height: 30px;
              box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.1);
              text-align: center;
              line-height: 30px;
              font-size: 16px;
              color: #ffbc32;
              .order-wrating-seller-text {
                display: inline-block;
                margin-left: 3px;
              }
            }
          }
        }
      }
      .order-appeal-box {
        .order-appeal-body {
          padding: 18px 30px;
          font-size: 18px;
          color: #192330;
          font-weight: 500;
          .order-appeal-text {
            color: #52cbca;
            cursor: pointer;
          }
        }
      }
      .order-notices-box {
        .order-notices-body {
          padding: 18px 30px;
          .order-notices-content {
            color: #6f6f6f;
            list-style-type: disc;
            list-style-position: inside;
          }
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
        flex: 1;
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
        max-width: 270px;
      }
      .sidebar-info-item-title {
        width: 160px;
      }
    }
  }
</style>
<template>
  <div class="page-content-container">
    <div v-if="order" class="page-order-detail">
      <div class="main-content">
        <CBlock x="0" y="0" class="order-summary-box">
          <div class="order-summary-wrapper">
            <img v-if="isBuySide" class="order-summary-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAABCCAMAAAAmNqV/AAAAzFBMVEUAAAD//47/1kr/ugD/zzz/11H/wRL/1U3/yS3/3GD/1U3/yCn/xB7/vAb/4Gv/xiH/4Wz/0kr/3GH/2Fj/3Wb/217/2Fb/zTj/whj/vQr/1k//0kX/yzH/vAT/327/3mv/0EH/0D3/vxP/vxD/3V//00j/ugD/ugD/0kv/1E3/00r/1lH/11T/wxv/uwP/2Fj/vxH/wRX/2Vv/yCn/yS3/xiT/zz3/xSD/vgz/yzH/vAj/zTn/21//0UT/zDX/0kf/3GP/0EH/3Wb/32p+t7/zAAAAKXRSTlMAAz5zpEm0pKRJ+LS0tKSkST6kpPj4+LSkpP22tKT4+LS0pKQ0xlFKEZjxug0AAAFGSURBVEjHxcsJV4JAGIVho8X2sswW27MNsyiGLSui/v9/6mMgyWt45ZwpX4ZRj/ep/XdXs9j1eLB2jx1NHTxj+8ZBmJd/YWAhxBhwQsdxwlC/6e1cMABVB+cEPEqOPOmtPyjA9gyD1R7292CDgCCrJ0+gXwogCrzAkxME2SWHgBUP48CtBlxs0TRQrlLKdfWb3ooCiIFDpaLBNpJDQYSZBrtv2Jxp0MdMgzM/qy9PFgUQA6eJn8jx/e8roQBioP2KVQb1GtaxGpauIc9ljLWtn//fCJhftuPYtuVIsf4s/V2fqWViwvRei9uJ0nsQbF+I7kF3qNHf+b4QpHxfiNbd2LZlj4LvUTyUlu2xpRbdo9h5+jXYU7El+3LxMhLuUdA9iub7ULCnQva0zebHoHW95wL2XJx86mBPBOyZOMY9F7CndWRvpi/KPexpAEtaaAAAAABJRU5ErkJggg==">
            <img v-else class="order-summary-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAABCCAMAAAAmNqV/AAAAhFBMVEUAAAAY3MOA//8Awc8O0cYa3r8P0cYf47sDxc0Jy8kCxM0Z3b8IysoY3L8d4Lwg5LoT18Mf5LwT1sIj5rsV2cEAxNAX2sEW2cAe4cMY3L8Z3r0W2r8Iyskb4LwFyMoKzccMz8YV2cAQ08QO0cUCxM0ExswR1cMT1sId4rsAws4U2MEf5Lpvy+ckAAAAGXRSTlMAPwJ0pEi0o7S0pKOk+Pj4tEikSKROx7sR2Qzv4gAAAUpJREFUSMfNiwlOhEAQRQEd9210RmVrdmTg/vfzF21SpAIWRIjzautO/nP+Dddbln97vvaW5bsOxqK8MNT8EmOPvDCUfNN0VGhr6HlGN/ZPlNMNzsdNHDdNTIXWDOQZUsBvxo7zDAwtL7n3pvJBEKNRBG37Z0PmJxkzdo8BUA2Z9+22w5sNzvsKbHBeNzgf+ihalnDkbw3Ohxhm5M8G8jMhg/IZEWZ8Jv8HMtwh75nkwx3y6Qhe2qxtMbTsOciIFASq8AXafrX28aoJgjlCjcGuMShNqCVrC1d5ntcoOvZxqQmC9YWiyHMMwKKtCoLthBQ9S0iHFJgFAthESNIkSbFRaFW4TSSLhYe1hSiJQGKHUAXmbARjosj0hWt0wUjWFm6M5E4TKoOmqSpcXagk6wslQiXWT6tCKdlAOPWFS60LJ8nawvFCcnT+yDc3npQjvm6WdgAAAABJRU5ErkJggg==">
            <div class="order-summary-left" :style="{color: mainColor}"> {{ isBuySide ? '购买' : '出售' }} {{ order.coin_type }}</div>
            <div class="order-summary-right">订单编号 #{{ order.id }}</div>
          </div>
        </CBlock>

        <CBlock x="0" y="0" class="order-detail-box">
          <div class="order-box-head">订单详情</div>
          <div class="order-box-line"></div>
          <div class="order-box-body order-detail-body">
            <div>
              <div class="order-detail-title">订单状态</div>
              <div class="order-detail-content order-detail-status" v-if="statusIconMap[orderStatus.value]" :style="{color: statusIconMap[orderStatus.value].color}">
                <i class="iconfont" :class="statusIconMap[orderStatus.value].class"></i>
                {{ orderStatus.text }}
              </div>
            </div>
            <div>
              <div class="order-detail-title">订单金额（{{ order.cash_type }}）</div>
              <div class="order-detail-content">{{ order.cash_amount | formatMoney }}</div>
            </div>
            <div>
              <div class="order-detail-title">订单单价（{{ order.cash_type }}）</div>
              <div class="order-detail-content">{{ order.price | formatMoney }}</div>
            </div>
            <div>
              <div class="order-detail-title">交易数量（{{ order.coin_type }}）</div>
              <div class="order-detail-content">{{ order.coin_amount | formatMoney }}</div>
            </div>
          </div>
        </CBlock>

        <CBlock x="0" y="0" class="order-step-box">
          <div class="order-box-head">订单进程</div>
          <div class="order-box-line"></div>
          <div class="order-step-body">
            <div class="order-step-wrapper" v-if="steps.length">
              <template v-for="(item, index) in steps">
                <div v-if="index > 0" class="order-step-dot-line" :style="{backgroundColor: index <= curStepIndex ? mainColor : '#eeeeee', width: index < curStepIndex ? '220px' : '230px'}"></div>
                <div class="order-step-dot" :style="{width: index === curStepIndex ? '10px' : '8px', height: index === curStepIndex ? '10px' : '8px', backgroundColor: index <= curStepIndex ? mainColor : '#eeeeee'}">
                  <div class="order-step-detail" :style="index === 3 ? `right: 0;text-align: right;top: ${index === curStepIndex ? 16 : 15}px;` : 'left: 0;'">
                    <div :style="{color: getColor(index, curStepIndex)}">{{ item.label }}</div>
                    <div v-if="item.time" class="order-step-time">{{ item.time | getTimeText }}</div>
                  </div>
                </div>
              </template>
            </div>
            <div class="order-step-body-title" v-html="paymentStatusMessage.message"></div>
            <div class="payment-warning c-red" v-if="paymentStatusMessage.warning" v-html="paymentStatusMessage.warning"></div>
            <div v-if="toWalletPage" class="link-to-wallet">
              <b-link to="/wallet">划转数字货币</b-link>
            </div>
            <div v-if="!isBuySide && counterparty.kyc_name" class="order-kyc-name">对方实名：{{ counterparty.kyc_name }}</div>
            <div class="order-step-contact" style="display: inline-block;" v-if="phoneStatus && phoneStatus.show">
              <b-link :disabled="!phoneStatus.network_phone" @click="onContact">
                <i class="iconfont icon-netphone" v-b-tooltip.hover :title="!!phoneStatus.network_phone ? null : order.network_phone_reason"></i>
                <span class="order-step-contact-detail">联系对方</span>
              </b-link>
            </div>
            <div class="order-payment-method" v-if="showPayment">
              <template v-if="order.status === constant.ORDER_STATUS.CREATED.value && isBuySide">
                <div class="order-payment-radio-group">
                  <div class="order-payment-radio" v-for="(item, index) in order.payment_methods">
                    <input :id="`payment-radio-${index}`" class="order-payment-radio-input" type="radio" v-model="selectedPaymentAccount" :value="item.account_no">
                    <label class="order-payment-radio-label" :for="`payment-radio-${index}`">
                      <template v-if="selectedPaymentAccount === item.account_no">
                        <i class="iconfont" :class="paymentNameMap[item.method].icon"></i>
                        <span class="order-payment-text" style="color: #192330;">
                          {{ paymentNameMap[item.method].text }}
                        </span>
                      </template>
                      <template v-else>
                        <i class="iconfont" :class="paymentNameMap[item.method].icon" style="color: #9b9b9b;"></i>
                        <span class="order-payment-text" style="color: #9b9b9b;">
                          {{ paymentNameMap[item.method].text }}
                        </span>
                      </template>
                    </label>
                  </div>
                </div>
              </template>
              <div v-else class="order-payment-selected">
                <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.BANKCARD">
                  <i class="mr-10 iconfont icon-bankcard"></i>银行转帐
                </span>
                <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.WECHAT">
                  <i class="mr-10 iconfont icon-wechat-round"></i>微信支付
                </span>
                <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.ALIPAY">
                  <i class="mr-10 iconfont icon-alipay"></i>支付宝支付
                </span>
              </div>
              <span class="order-payment-account-wrapper">
                <span class="order-payment-col">{{selectedMethod.account_name + ' '}}</span>
                <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.BANKCARD" class="order-payment-col">
                  {{ selectedMethod.bank_name }}
                </span>
                <span class="order-payment-col" v-if="selectedMethod.account_no">
                  <span class="order-payment-account" v-if="selectedMethod.method === constant.PAYMENT_TYPES.BANKCARD">{{ selectedMethod.account_no | splitCardNumber }}</span>
                  <span class="order-payment-account" v-else>{{ selectedMethod.account_no }}</span>
                  <i id="icon-copy" class="iconfont icon-copy order-payment-copy" v-clipboard:copy="selectedMethod.account_no" v-clipboard:success="copySuccess"></i>
                  <b-tooltip target="icon-copy" content="已复制" :show="copyed" :triggers="'false'" placement="top">已复制</b-tooltip>
                </span>
                <span v-if="selectedMethod.method === constant.PAYMENT_TYPES.BANKCARD && selectedMethod.branch" class="order-payment-col">
                  {{ selectedMethod.branch }}
                </span>
                <QrcodePopover v-if="selectedMethod.method !== constant.PAYMENT_TYPES.BANKCARD && selectedMethod.qr_code_image"
                  :src="selectedMethod.qr_code_image_url"/>
              </span>
            </div>
            <div v-if="(order.status !== constant.ORDER_STATUS.CANCEL.value || order.pay_time) && order.status !== constant.ORDER_STATUS.CLOSED.value" class="order-payment-btn-wrapper">
              <b-btn v-if="isBuySide && !order.pay_time"
                     :disabled="expired"
                     size="xs"
                     variant="gradient-yellow"
                     class="order-payment-btn-left"
                     @click="confirmPay" style="width: 120px;">我已支付</b-btn>
              <div v-if="order.status === constant.ORDER_STATUS.PAID.value && isBuySide" class="order-wrating-seller order-payment-btn-left">
                <i class="iconfont icon-tea"></i>
                <span class="order-wrating-seller-text">等待对方放币</span>
              </div>
              <b-btn v-if="canCancel" size="xs" style="width: 120px;" variant="outline-green" :disabled="expired" @click="cancelOrder">取消订单</b-btn>
              <b-btn v-if="showConfirmReceiptStep && showSellerConfirmButton" class="btn btn-gradient-yellow btn-xs"
                      @click="confirmReceipt" style="width: 150px;">确认收款并放币
              </b-btn>
            </div>
          </div>
        </CBlock>

        <CBlock v-if="showAppeal" x="0" y="0" class="order-appeal-box">
          <div class="order-box-head">订单申诉</div>
          <div class="order-box-line"></div>
          <div class="order-appeal-body">
            <template v-if="!appeal || !appeal.status || appeal.status === constant.APPEAL_STATUS.CANCEL">
              订单遇到问题？您可以
              <span v-if="canAppeal" class="order-appeal-text" @click="startAppeal">发起申诉</span>
              <span v-else class="c-brand-green" v-b-tooltip.hover title="买家付款10分钟后，可发起申诉。">申诉</span>
            </template>
            <template v-else-if="showSupport">
              <span>
                交易出现问题？需要
                <b-link :href="`${coinexDomain}/res/support/ticket`" target="_blank"><span
                                class="c-brand-green">提交工单</span></b-link>
              </span>
            </template>
            <template v-else-if="appeal && appeal.result_desc">
              <span>{{ appeal.result_desc }}</span>
              <span v-if="appeal.allow_appeal_again" class="c-brand-green ml-10"
                    @click="startAppeal">再次申诉</span>
              <button v-if="canCancelAppeal" class="btn btn-outline-green btn-xs ml-10" @click="cancelAppeal">取消申诉
              </button>
            </template>
          </div>
        </CBlock>

        <CBlock x="0" y="0" class="order-notices-box">
          <div class="order-box-head">交易须知</div>
          <div class="order-box-line"></div>
          <div class="order-notices-body">
            <ul class="order-notices-content" v-if="isBuySide">
              <li>您支付的法币将直接进入卖方收款账户，交易中卖方的数字货币由平台托管冻结。</li>
              <li>请尽快完成付款，并务必<span class="c-red">点击“我已支付”</span>，卖方确认收款后，平台将数字货币划转到您的账户。</li>
              <li>请使用即时到账支付方式，付款后2小时内未到账订单，卖方有权要求退款后取消交易。</li>
              <li>当日取消订单达到3笔（包括超时自动关闭的订单），将被限制当日交易功能。</li>
            </ul>
            <ul class="order-notices-content" v-else>
              <li>买方支付的法币将直接进入您的收款账户，交易中您的数字货币由平台托管冻结。</li>
              <li>确认收到买方付款后，请及时<span class="c-red">点击“确认收款”</span>放行数字货币。</li>
              <li>收到到账短信后，请务必登录收款账户确认款项是否到账，避免因收到诈骗短信错误释放数字货币。</li>
            </ul>
          </div>
        </CBlock>
      </div>
      <div class="sidebar">
        <CBlock x="0" y="0" class="my-sidebar-info" style="padding: 30px 0 13px 0;">
          <UserStatsProfile :user-data="counterparty" v-if="counterparty"
                            :color="colors[counterparty.id % 10]"
                            :is-merchant="counterparty.id===order.merchant_id"/>
        </CBlock>
        <CBlock x="0" y="0" id="my-chat-box">
          <Chat v-if="user.account" :client="chat.imClient" :conversation-id="order.conversation_id"
                :client-id="`${user.account.id}`" :is-buy-side="isBuySide"></Chat>
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
               :noCloseOnBackdrop="true"
               class="text-center">
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
                      placeholder="请填写0-500字的申诉理由"
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
  </div>
</template>

<script>
  import Chat from '~/components/chat'
  import UserStatsProfile from '~/components/user-stats-profile.vue'
  import QrcodePopover from '~/components/qrcode-popover.vue'
  import ConfirmReceipt from './_c/confirm-receipt'
  import {coinexDomain} from '~/modules/variables'
  import {COLORS} from '~/components/chat/constant.js'
  import {mapState} from 'vuex'

  const PAID_CAN_APPEAL = 10 * 60 * 1000 // 支付后可申诉的时间 十分钟
  const SUCCESS_CAN_APPEAL = 24 * 3600 * 1000 // 订单完成后二十四小时内可申诉
  const ORDER_PAY_TIME = 15 // 15分钟（未换算）
  const REFRESH_ORDER_INTERVAL = 5000

  export default {
    data() {
      return {
        copyed: false,
        toWalletPage: false, // 是否显示划转入口
        curStepIndex: 0, // 记录当前进行到的步骤
        selectedPaymentAccount: '',
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
            color: 'rgb(155, 155, 155)',
          },
        },
        colors: COLORS,
        id: this.$route.params.id,
        counterparty: null,
        merchant: null,
        order: null,
        selectedMethod: null,
        secondCountdown: null,
        refreshInterval: null,
        Visibility: null,
        payRemainTime: 0,
        orderExpireTime: 0,
        appeal: null,
        appealComment: null,
        appealReason: null,
        showConfirmReceiptModal: false,
        coinexDomain,
        paymentNameMap: {
          bankcard: {
            text: '银行卡',
            icon: 'icon-bankcard',
          },
          alipay: {
            text: '支付宝',
            icon: 'icon-alipay',
          },
          wechat: {
            text: '微信',
            icon: 'icon-wechat-round',
          },
        },
        stepsMessage: {
          created: '生成订单',
          payCash: '买方付款',
          payCoin: '卖方放币',
          success: '订单完成',
          closed: '订单已关闭',
          cancel: '订单已取消',
        },
      }
    },
    components: {
      UserStatsProfile,
      ConfirmReceipt,
      QrcodePopover,
      Chat,
    },
    head() {
      return {
        title: '订单详情' +
        this.$t('global.pageTitle.common')
      }
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
      this.stopCountDown()
      this.stopRefreshOrder()
      this.Visibility.unbind(this.onVisibilityChange)
    },
    mounted() {
      this.getCurrentOrder()
      // browser only
      this.Visibility = require('visibilityjs')
      this.Visibility.change(this.onVisibilityChange)
    },
    watch: {
      selectedPaymentAccount(val) {
        this.selectedMethod = this.order.payment_methods.find(item => item.account_no === val)
      },
    },
    computed: {
      ...mapState(['user', 'constant', 'chat']),
      mainColor() { // 区分买卖双方主色调
        if (this.isBuySide) {
          return '#ffbc32'
        }
        return '#52cbca'
      },
      showSupport() {
        return this.order.status === this.constant.ORDER_STATUS.SUCCESS.value && !this.appeal && !this.showAppeal
      },
      steps() {
        const stepList = []
        const {CANCEL, CLOSED, CREATED, PAID, SUCCESS} = this.constant.ORDER_STATUS
        if (this.order && this.stepsMessage) {
          const {order, stepsMessage} = this
          stepList.push({time: order.create_time, label: stepsMessage.created, isActived: true})
          if ((order.status !== CANCEL.value || order.pay_time) && order.status !== CLOSED.value) {
            const isActived = order.status === CREATED.value
            stepList.push({time: order.pay_time, label: stepsMessage.payCash, isActived})
            if (isActived) this.curStepIndex = stepList.length - 1
          }
          if (this.showConfirmReceiptStep) {
            const isActived = order.status === PAID.value
            stepList.push({time: order.complete_time, label: stepsMessage.payCoin, isActived})
            if (isActived) this.curStepIndex = stepList.length - 1
          }
          if (order.status !== CANCEL.value && order.status !== CLOSED.value) {
            const isActived = order.status === SUCCESS.value
            stepList.push({time: order.complete_time, label: stepsMessage.success, isActived})
            if (isActived) this.curStepIndex = stepList.length - 1
          }
          if (order.status === CANCEL.value) {
            const isActived = true
            stepList.push({time: order.update_time, label: stepsMessage.cancel, isActived})
            if (isActived) this.curStepIndex = stepList.length - 1
          }
          if (order.status === CLOSED.value) {
            const isActived = true
            stepList.push({time: null, label: stepsMessage.closed, isActived})
            if (isActived) this.curStepIndex = stepList.length - 1
          }
        }
        return stepList
      },
      orderStatus() {
        return Object.values(this.constant.ORDER_STATUS).find(s => s.value === this.order.status)
      },
      cannotSubmitAppeal() {
        return !(this.appealReason && (!this.appealComment || this.appealComment.length <= 500))
      },
      isMerchant() {
        return this.user.account && this.order.merchant_id === this.user.account.id
      },
      isBuySide() {
        return this.order.merchant_side === this.constant.SIDE.BUY ? this.isMerchant : !this.isMerchant
      },
      canCancelAppeal() {
        if (!this.appeal) return false
        const pending = this.appeal.status === this.constant.APPEAL_STATUS.CREATED
        return this.appeal.user_id === this.user.account.id && pending
      },
      isAppealing() {
        // 平局和取消一样处理？？？？！！！！！
        return this.appeal && this.appeal.status !== this.constant.APPEAL_STATUS.CANCEL && this.appeal.result !== this.constant.APPEAL_RESULT_MAP.draw.value
      },
      canAppeal() {
        // 支付后十分钟以后 和 完成后七天内可以申诉
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
        return this.isBuySide && orderStatusOk && !this.isAppealing
      },
      showPayment() {
        const createdBuyer = this.order.status === this.constant.ORDER_STATUS.CREATED.value && this.isBuySide
        const paid = this.order.status === this.constant.ORDER_STATUS.PAID.value
        const success = this.order.status === this.constant.ORDER_STATUS.SUCCESS.value
        return this.selectedMethod && (createdBuyer || paid || success) && !this.expired
      },
      referCode() {
        // 去最后六位，防止后端返回数字，都先转换为字符串
        return `${this.order.id}`.lastChars()
      },
      expired() {
        return this.order.status === this.constant.ORDER_STATUS.CREATED.value && this.payRemainTime <= 0
      },
      showSellerConfirmButton() {
        return !this.isBuySide && this.order.status === this.constant.ORDER_STATUS.PAID.value
      },
      showConfirmReceiptStep() {
        const validOrder = this.order.status !== this.constant.ORDER_STATUS.CANCEL.value && this.order.status !== this.constant.ORDER_STATUS.CLOSED.value
        const appealClosed = this.appeal && this.appeal.order_result !== this.constant.ORDER_RESULT_MAP.none.value && this.appeal.order_result !== ''
        return validOrder && !appealClosed
      },
      paymentStatusMessage() {
        let message
        let warning
        if (this.order) {
          switch (this.order.status) {
            case this.constant.ORDER_STATUS.CREATED.value:
              if (this.payRemainTime > 0) { // 订单创建后，需要先判断是否超时
                if (this.isBuySide) {
                  message = `请支付${this.order.cash_amount}${this.order.cash_type}，剩余时间
                  <span>${Math.floor(this.payRemainTime / 60)}分${this.payRemainTime % 60}秒</span>`
                  warning = '请使用实名付款，转账时除参考号外请不要备注任何信息！'
                } else {
                  message = `等待对方支付${this.order.cash_amount}${this.order.cash_type}，剩余时间
                  <span>${Math.floor(this.payRemainTime / 60)}分${this.payRemainTime % 60}秒</span>`
                }
                message += `，付款参考号：<span class="c-red">${this.referCode}</span>`
              } else {
                message = '超时未付款，系统已将订单关闭'
              }
              break
            case this.constant.ORDER_STATUS.PAID.value:
              if (this.isBuySide) {
                message = '等待对方确认收款'
              } else {
                message = `对方已支付${this.order.cash_amount}${this.order.cash_type}，请查收并放币`
                warning = '请务必查看您的收款账户，并核实对方是否实名付款。'
              }
              message += `，付款参考号：<span class="c-red">${this.referCode}</span>`
              break
            case this.constant.ORDER_STATUS.SUCCESS.value:
              if (this.order.is_appeal_complete) { // admin申诉裁决结果字段
                message = '系统裁决订单完成'
              } else {
                if (this.isBuySide) {
                  message = '对方已确认收款，您已收到对方出售的数字货币'
                  this.toWalletPage = true
                } else {
                  message = '您已确认收款，对方已收到您出售的数字货币'
                }
                message += `，付款参考号：<span class="c-red">${this.referCode}</span>`
              }
              break
            case this.constant.ORDER_STATUS.CANCEL.value:
              if (this.order.is_appeal_complete) {
                message = '系统裁决订单取消'
              } else {
                if (this.isBuySide) {
                  message = '您已将订单取消'
                } else {
                  message = '对方已将订单取消'
                }
              }
              break
            case this.constant.ORDER_STATUS.CLOSED.value:
              message = '超时未付款，系统已将订单关闭'
              break
          }
        }
        return {
          message,
          warning,
        }
      },
      phoneStatus() {
        return {
          show: this.order.status === this.constant.ORDER_STATUS.PAID.value,
          tooltip: this.order.network_phone_reason, // 后端直接给出reason，前端不用判断
          network_phone: this.order.network_phone,
          self_phone: this.user.account.mobile,
        }
      }
    },
    methods: {
      getColor(index, curStepIndex) { // 获取进度条文字颜色
        if (index === curStepIndex) {
          return this.mainColor
        } else if (index > curStepIndex) {
          return '#9b9b9b'
        }
        return ''
      },
      onContact() {
        if (this.phoneStatus.network_phone) {
          this.$showDialog({
            title: '联系对方',
            content: (<div>
              <p class="c-dark fz-20">{this.phoneStatus.network_phone}</p>
              <p class="c-gray">平台会对双方号码做隐私保护，请务必使用{this.phoneStatus.self_phone}拨打，否则将无法接通</p>
            </div>),
            okTitle: '我知道了',
            okOnly: true,
          })
        }
      },
      copySuccess() {
        this.copyed = true
        setTimeout(() => {
          this.copyed = false
        }, 2000)
      },
      onVisibilityChange() {
        if (!this.Visibility.hidden()) {
          this.startRefreshOrder()
        } else {
          this.stopRefreshOrder()
        }
      },
      getCurrentOrder() {
        this.axios.order.getOrderById(this.id).then(response => {
          if (response.code === 0) {
            this.order = response.data
            this.selectedPaymentAccount = this.order.payment_methods[0].account_no
            this.counterparty = this.user.account.id === this.order.user_id ? this.order.merchant : this.order.user
            this.orderExpireTime = (this.order.place_time + ORDER_PAY_TIME * 60) * 1000
            this.checkOrderStatus()
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
      updateRemainTime() {
        this.stopCountDown()
        if (this.order.status === this.constant.ORDER_STATUS.CREATED.value) {
          this.payRemainTime = Math.floor((this.orderExpireTime - Date.now()) / 1000)
          this.startCountDown()
        }
      },
      startCountDown() {
        this.secondCountdown = setInterval(() => {
          if (this.payRemainTime > 0) {
            this.payRemainTime = Math.floor((this.orderExpireTime - Date.now()) / 1000)
          } else {
            this.stopCountDown()
          }
        }, 5000)
      },
      stopCountDown() {
        if (!this.secondCountdown) return
        clearInterval(this.secondCountdown)
      },
      startRefreshOrder() {
        this.stopRefreshOrder()
        this.refreshInterval = this.Visibility.every(REFRESH_ORDER_INTERVAL, () => {
          this.refreshOrderStatus()
        })
      },
      stopRefreshOrder() {
        this.Visibility.stop(this.refreshInterval)
      },
      checkOrderStatus() {
        this.updateRemainTime()
        if (this.order.status === this.constant.ORDER_STATUS.PAID.value) {
          this.selectedMethod = this.order.payment_methods[0]
        }
        // 未完成的订单才自动刷新
        if (this.order.status === this.constant.ORDER_STATUS.CREATED.value || this.order.status === this.constant.ORDER_STATUS.PAID.value) {
          this.startRefreshOrder()
        } else {
          this.stopRefreshOrder()
        }
        // 支付或完成的订单才可以申诉，但是取消的订单有可能是申诉过的，所以只要不是created都有可能有appeal
        if (this.order.status !== this.constant.ORDER_STATUS.CREATED.value) {
          this.getAppeal()
        }
      },
      confirmPay() {
        this.$showDialog({
          title: '确认付款',
          content: (<div class="text-left">请确认已向卖方付款。<p class="c-red">未付款点击“我已支付”将被冻结账户。</p></div>),
          okTitle: '我已支付',
          cancelTitle: '取消',
          onOk: () => {
            this.axios.order.confirmPay(this.order.id, this.selectedMethod).then(res => {
              this.$successTips('确认付款成功')
              this.refreshOrderStatus()
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
        this.axios.order.submitAppeal(this.order.id, this.appealReason, this.appealComment || '').then(_ => {
          this.refreshOrderStatus()
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      cancelAppeal() {
        this.$showDialog({
          title: '取消申诉',
          content: '确认取消申诉？',
          onOk: () => {
            this.axios.order.cancelAppeal(this.order.id).then(() => {
              this.refreshOrderStatus()
            }).catch(err => {
              this.axios.onError(err)
            })
          }
        })
      },
      cancelOrder() {
        this.$showDialog({
          title: '取消订单',
          content: (
            <div class="text-left"><p class="c-red">如您已向卖家付款，取消订单您将会损失付款资金。</p>
              <p>温馨提示：买方每日累计取消订单超过3笔，将被限制当日交易功能和广告功能。</p>
            </div>),
          onOk: () => {
            this.axios.order.cancelOrder(this.order.id).then(() => {
              this.refreshOrderStatus()
            })
          }
        })
      },
      confirmReceipt() {
        this.showConfirmReceiptModal = true
      },
    }
  }
</script>
