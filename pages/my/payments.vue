<!--支付方式-->
<style lang="scss">
  @import "~assets/scss/variables.scss";
  .page-my-payments {
    .layout-my-title {
      display: flex;
      align-items: center;
    }

    .payment-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 200px;
    }

    .payment-status {
      display: flex;
      align-items: center;
      color: $brandGreen;

      .switch {
        margin-bottom: 0;
      }
    }

    .payment-modal {
      .modal-dialog {
        width: 680px;
        max-width: 680px;
      }

      .modal-body {
        padding-left: 20px;
        padding-right: 90px;
      }

      .col-form-label {
        font-size: 16px;
        color: #192330;
        text-align: right;
      }
    }
  }
</style>

<template>
  <CBlock class="page-my-payments" x="0" y="0">
    <h3 class="layout-my-title">
      支付方式
      <b-btn @click="onAddPayment" variant="plain" size="xs" class="ml-15 c-brand-green">+ 添加支付方式</b-btn>
    </h3>
    <p class="layout-my-desc">被激活的支付方式将在交易时向买方展示，最多激活3种</p>

    <MyInfoItem v-for="payment in user.payments">
        <div slot="title">
          <i class="iconfont fz-18" :class="payment.icon"></i>
          {{payment.title}}
        </div>

        <p slot="content">
          {{payment.accouont_no}}
          {{payment.account_name}}
          <template v-if="payment.method === constant.PAYMENT_TYPES.BANKCARD">
            {{payment.bank}}
            {{payment.branch}}
          </template>
        </p>

        <div slot="action" class="payment-action">
          <b-btn size="xxs" variant="plain" class="c-brand-green" @click="onPaymentEdit(payment)">修改</b-btn>
          <div class="payment-status">
            {{payment.status.toUpperCase()}}
            <ToggleButton class="ml-2" :value="payment.status === constant.PAYMENT_STATUS.ON" @change="(checked) => onPaymentStatusChange(payment, checked)"/>
          </div>
        </div>
    </MyInfoItem>

    <b-modal title="添加支付方式" v-model="modalShowing" class="payment-modal" @ok="onFormSubmit">
      <b-form>
        <b-form-group label="类型:" horizontal>
          <b-form-select v-model="form.method" :options="constant.PAYMENT_OPTIONS" size="lg"></b-form-select>
        </b-form-group>

        <div v-if="form.method && form.method !== 'ALL'">
          <b-form-group label="姓名:" horizontal>
            <b-form-input v-model="form.account_name" size="lg"></b-form-input>
          </b-form-group>

          <div v-if="form.method === 'bankcard'">
            <b-form-group label="开户银行:" horizontal>
              <b-form-input v-model="form.bank" size="lg"></b-form-input>
            </b-form-group>
            <b-form-group label="开户支行:" horizontal>
              <b-form-input v-model="form.branch" size="lg"></b-form-input>
            </b-form-group>
            <b-form-group label="银行卡号:" horizontal>
              <b-form-input v-model="form.account_no" size="lg"></b-form-input>
            </b-form-group>
          </div>

          <div v-if="form.method === 'alipay'">
            <b-form-group label="支付宝账号:" horizontal>
              <b-form-input v-model="form.account_no" size="lg"></b-form-input>
            </b-form-group>
            <b-form-group label="收款二维码:" horizontal>
              <b-form-input v-model="form.qr_code_image" size="lg"></b-form-input>
              <p>为确保二维码正确，请添加后先自己进行扫描测试</p>
            </b-form-group>
          </div>

          <div v-if="form.method === 'wechat'">
            <b-form-group label="微信账号:" horizontal>
              <b-form-input v-model="form.account_no" size="lg"></b-form-input>
            </b-form-group>
            <b-form-group label="收款二维码:" horizontal>
              <b-form-input v-model="form.qr_code_image" size="lg"></b-form-input>
              <p>为确保二维码正确，请添加后先自己进行扫描测试</p>
            </b-form-group>
          </div>

          <VerifyCode :needGoogle="true" :needSms="true"
                      :sms.sync="verify.sms"
                      :google.sync="verify.google"
                      :email.sync="verify.email"
                      :codeType.sync="verify.codeType"/>
        </div>
      </b-form>
    </b-modal>
  </CBlock>
</template>

<script>
import {mapState} from 'vuex'
import MySidebar from '~/components/my-sidebar.vue'
import My2Column from '~/components/my-2column.vue'
import MyInfoItem from './_c/my-info-item.vue'
import ToggleButton from '~/components/toggle-button.vue'
import VerifyCode from '~/components/verify-code.vue'

export default {
  name: 'page-my-payments',
  components: {
    MySidebar,
    My2Column,
    MyInfoItem,
    ToggleButton,
    VerifyCode,
  },
  layout: 'my',
  data() {
    return {
      verify: {
        codeType: 'google',   // todo:默认值
        sms: '',
        google: '',
        email: '',
      },
      form: {
        method: '',
        account_name: '',
        bank: '',
        branch: '',
        account_no: '',
        qr_code_image: '',
      },
      modalShowing: false,
      editingPayment: null,     // 正在被编辑/新增的payment数据

      bankList: [{
        text: '中国银行',
        value: '11'
      }, {
        text: '华夏银行',
        value: '22'
      }]
    }
  },
  computed: {
    ...mapState(['constant', 'user']),
  },
  mounted() {
    this.$store.dispatch('fetchUserPayments')
  },
  methods: {
    // todo:编辑
    onAddPayment() {
      this.modalShowing = true

      // 清空之前的值
      ;['method', 'account_name', 'bank', 'branch', 'account_no', 'qr_code_image'].forEach((key)=> {
        this.form[key] = ''
      })
    },
    onPaymentEdit(payment) {
      this.modalShowing = true
      this.editingPayment = payment
    },
    onPaymentStatusChange(payment, checked) {
      const status = checked ? this.constant.PAYMENT_STATUS.ON : this.constant.PAYMENT_STATUS.OFF
      this.axios.user.changePaymentStatus(payment.id, status).then(res => {
        payment.status = status
      })
    },
    onFormSubmit(e) {
      e.preventDefault()
      const form = this.form
      const verify = this.verify
      const code = verify.codeType === this.constant.VERIFY_CODE_TYPE.GOOGLE ? verify.google : verify.sms

      this.axios.user.addPaymentMethod({
        verify_code_type: verify.codeType,
        verify_code: code,
        ...form,
      })
    }
  }
}
</script>
