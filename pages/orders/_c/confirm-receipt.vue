<template>
  <b-modal id="confirm-receipt-modal"
           title="确认收款"
           ok-title="确认收款放币"
           cancel-title="取消"
           cancel-variant="outline-green"
           ok-variant="gradient-yellow"
           button-size="sm"
           :centered="true"
           :visible="showConfirmReceiptModal"
           :ok-disabled="invalidCode"
           :noCloseOnBackdrop="true"
           @ok="confirmReceipt"
           @hide="cancelReceipt"
           ref="confirmReceiptModal">
    <div class="text-left">请务必登录网银、手机银行或者第三方支付账号确认已收到该笔款项。<p class="c-red">如您没有收到买家付款，确认收款后，放行的数字货币将无法追回。</p></div>
    <VerifyCode v-if="needVerify"
                ref="verify-code"
                :needGoogle="user.account.is_have_totp_auth"
                :needSms="!!user.account.mobile"
                :sms.sync="verify.sms"
                :google.sync="verify.google"
                :codeType.sync="verify.codeType"
                :businessType="verify.businessType"
                :smsSequence.sync="verify.smsSequence"
    />
  </b-modal>
</template>
<script>
  import VerifyCode from '~/components/verify-code'
  import {mapState} from 'vuex'
  import constant from '~/modules/constant'

  export default {
    data() {
      return {
        verify: {
          codeType: constant.VERIFY_CODE_TYPE.GOOGLE,
          sms: '',
          google: '',
          businessType: constant.VERIFY_CODE_BUSINESS.CONFIRM_RECEIPT,
          smsSequence: 0,
        },
        needVerify: false,
      }
    },
    components: {
      VerifyCode,
    },
    computed: {
      ...mapState(['user', 'constant']),
      invalidCode() {
        const wrongGoogle = this.verify.codeType === this.constant.VERIFY_CODE_TYPE.GOOGLE && this.user.account.is_have_totp_auth && (!this.verify.google || this.verify.google.length !== 6)
        const wrongSMS = this.verify.codeType === this.constant.VERIFY_CODE_TYPE.SMS && this.user.account.mobile && (!this.verify.sms || this.verify.sms.length !== 6)
        return this.needVerify && (wrongGoogle || wrongSMS)
      },
    },
    mounted() {
      if (this.user && this.user.account && this.user.account.trade_validate_frequency === this.constant.TRADE_VALIDATE_FREQUENCY.EACH_TIME) {
        this.needVerify = true
      }
    },
    props: ['orderId', 'showConfirmReceiptModal'],
    watch: {
      showConfirmReceiptModal: function (bool) {
        // 每次显示的时候都把error-message隐藏掉
        if (bool) {
          this.$refs['verify-code'] && this.$refs['verify-code'].resetValidation()
        }
      }
    },
    methods: {
      confirmReceipt(evt) {
        evt.preventDefault()
        const verify = this.verify
        const code = verify.codeType === this.constant.VERIFY_CODE_TYPE.GOOGLE ? verify.google : verify.sms

        // 只在需要验证码的时候再传验证码数据给后端，不然无法区分后台返回的"需要二次验证"和"验证码错误"的返回值
        const data = this.needVerify ? {
          validate_code_type: verify.codeType,
          validate_code: code,
          sequence: verify.smsSequence,
        } : {}

        this.axios.order.confirmReceipt(this.orderId, data).then(() => {
          this.$refs.confirmReceiptModal.hide()
          this.$emit('confirmReceipt')

          // 如果是每两小时验证的用户，验证过一次之后，就不需要再验证了
          if (this.needVerify && this.user.account.trade_validate_frequency === this.constant.TRADE_VALIDATE_FREQUENCY.EACH_TWO_HOURS) {
            this.needVerify = false
          }
        }).catch(err => {
          if (err.code === this.constant.ERROR_CODE.VALIDATE_CODE_REQUIRED) {
            this.needVerify = true
          } else {
            this.$showTips(err.message, 'error')
          }
        })
      },
      cancelReceipt(evt) {
        if (evt.trigger === 'ok') return
        this.$emit('cancelReceipt')
      },
    },
  }
</script>
