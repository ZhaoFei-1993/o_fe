<template>
  <b-modal id="confirm-receipt-modal"
           title="确认收款"
           ok-title="确认"
           cancel-title="取消"
           cancel-variant="outline-green"
           ok-variant="gradient-yellow"
           button-size="sm"
           :centered="true"
           :visible="showConfirmReceiptModal"
           :ok-disabled="invalidCode"
           @ok="confirmReceipt"
           @hide="cancelReceipt"
           ref="confirmReceiptModal">
    <div class="text-left">确认已收到该笔款项？<p class="c-red">如您没有收到买家付款，确认收款后，放行的数字货币将无法追回。</p></div>
    <VerifyCode v-if="needVerify"
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
    methods: {
      confirmReceipt(evt) {
        evt.preventDefault()
        const verify = this.verify
        const code = verify.codeType === this.constant.VERIFY_CODE_TYPE.GOOGLE ? verify.google : verify.sms
        this.axios.order.confirmReceipt(this.orderId, {
          validate_code_type: verify.codeType,
          validate_code: code,
          sequence: verify.smsSequence,
        }).then(() => {
          this.needVerify = false
          this.$refs.confirmReceiptModal.hide()
          this.$emit('confirmReceipt')
        }).catch(err => {
          this.$showTips(err.message, 'error')
          this.needVerify = true
        })
      },
      cancelReceipt(evt) {
        if (evt.trigger === 'ok') return
        this.$emit('cancelReceipt')
      },
    },
  }
</script>
