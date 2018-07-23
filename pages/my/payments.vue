<!--支付方式-->
<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-my-payments {
    .icon-plus {
      display: inline-block;
      margin-top: -2px;
      margin-right: 4px;
      font-size: 12px;
    }

    .layout-my-title {
      display: flex;
      align-items: center;
    }

    .payment-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 220px;
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
      // 覆盖默认的
      .form-group {
        margin-bottom: 0;
      }

      .error-message {
        margin-top: 0;
      }

      .modal-dialog {
        width: 680px;
        max-width: 680px;
      }

      .payment-modal-title {
        text-align: center;
        padding-left: 60px;
        margin-bottom: 40px;
      }

      .modal-body {
        padding-left: 30px;
        padding-right: 90px;
      }

      .col-form-label {
        font-size: 16px;
        color: #192330;
        text-align: right;
      }

      .payment-qrcode {
        display: flex;
        font-size: 16px;
        color: #6f6f6f;
      }
    }
  }
</style>

<template>
  <CBlock class="page-my-payments" x="0" y="0">
    <h3 class="layout-my-title">
      支付方式
      <b-btn @click="onPaymentAdd" variant="plain" size="xs" class="ml-15 c-brand-green">
        <i class="iconfont icon-plus"></i>
        添加支付方式
      </b-btn>
    </h3>
    <p class="layout-my-desc" data-todo="同类最多激活一种吧？">被激活的支付方式将在交易时向买方展示，最多激活3种</p>

    <MyInfoItem v-for="(payment, index) in user.payments" :key="index">
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
        <div class="payment-status">
          {{payment.status.toUpperCase()}}
          <ToggleButton class="ml-2" :value="payment.status === constant.PAYMENT_STATUS.ON"
                        @change="(checked) => onPaymentStatusChange(payment, checked)"/>
        </div>
        <b-btn size="xs" variant="outline-green" class="c-brand-green ml-30" @click="onPaymentEdit(payment)">修改</b-btn>
      </div>
    </MyInfoItem>

    <b-modal class="payment-modal"
             v-model="modalShowing"
             ok-title="确定"
             cancel-title="取消"
             ok-variant="gradient-yellow"
             cancel-variant="outline-green"
             button-size="lg"
             :okDisabled="submitting"
             @ok="onFormSubmit">
      <b-form>
        <h4 class="payment-modal-title">
          <span v-if="isPaymentEditing">
            修改支付方式
            <b-btn variant="plain-green" size="xxs" class="float-right" @click="onPaymentDelete">删除该条</b-btn>
          </span>
          <span v-else>添加支付方式</span>
        </h4>

        <b-form-group label="类型:" horizontal class="mb-25">
          <b-form-select v-model="form.method" :options="constant.PAYMENT_OPTIONS" size="lg"></b-form-select>
        </b-form-group>

        <div v-if="form.method && form.method !== 'ALL'">
          <b-form-group label="姓名:" horizontal>
            <b-form-input v-model="form.account_name" size="lg"></b-form-input>
            <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="account_name"/>
          </b-form-group>

          <div v-if="form.method === 'bankcard'">
            <b-form-group label="开户银行:" horizontal>
              <b-form-select v-model="form.bank" :options="constant.bankOptions"></b-form-select>
              <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="bank"/>
            </b-form-group>
            <b-form-group label="开户支行:" horizontal>
              <b-form-input v-model="form.branch" size="lg"></b-form-input>
              <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="branch"/>
            </b-form-group>
            <b-form-group label="银行卡号:" horizontal>
              <b-form-input v-model="form.account_no" size="lg"></b-form-input>
              <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="account_no"/>
            </b-form-group>
          </div>

          <div v-if="form.method === 'alipay'">
            <b-form-group label="支付宝账号:" horizontal>
              <b-form-input v-model="form.account_no" size="lg"></b-form-input>
              <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="account_no"/>
            </b-form-group>
            <b-form-group label="收款二维码:" horizontal>
              <div class="payment-qrcode">
                <ImageUploadPreview v-model="form.qrCodeImage"/>

                <p class="ml-10">为确保二维码正确，请添加后先自己进行扫描测试</p>
              </div>
            </b-form-group>
          </div>

          <div v-if="form.method === 'wechat'">
            <b-form-group label="微信账号:" horizontal>
              <b-form-input v-model="form.account_no" size="lg"></b-form-input>
              <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="account_no"/>
            </b-form-group>
            <b-form-group label="收款二维码:" horizontal>
              <div class="payment-qrcode">
                <ImageUploadPreview v-model="form.qrCodeImage"/>

                <p class="ml-10">为确保二维码正确，请添加后先自己进行扫描测试</p>
              </div>
            </b-form-group>
          </div>

          <VerifyCode :needGoogle="true" :needSms="true" :needEmail="true"
                      :sms.sync="verify.sms"
                      :google.sync="verify.google"
                      :email.sync="verify.email"
                      :codeType.sync="verify.codeType"
                      :businessType="verify.businessType"
                      :emailSequence.sync="verify.emailSequence"
                      :smsSequence.sync="verify.smsSequence"
                      ref="verify-code"/>
        </div>
      </b-form>
    </b-modal>
  </CBlock>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'
  import MyInfoItem from './_c/my-info-item.vue'
  import ToggleButton from '~/components/toggle-button.vue'
  import VerifyCode from '~/components/verify-code.vue'
  import ImageUploadPreview from '~/components/image-upload-components/image-upload-preview.vue'
  import Vuelidate from 'vuelidate'
  import getPaymentFormConfig from './payment-form-config'
  import EMsgs from '~/components/error-message.vue'

  Vue.use(Vuelidate)

  export default {
    name: 'page-my-payments',
    components: {
      MySidebar,
      My2Column,
      MyInfoItem,
      ToggleButton,
      VerifyCode,
      EMsgs,
      ImageUploadPreview,
    },
    layout: 'my',
    data() {
      return {
        verify: {
          codeType: 'sms',   // todo:默认值
          sms: '',
          google: '',
          email: '',
          businessType: '',
          smsSequence: 0,
          emailSequence: 0
        },
        form: {
          method: '',
          account_name: '',
          bank: '',
          branch: '',
          account_no: '',
          qr_code_image: '',
          qrCodeImage: '',          // {url, blob, file, id}
        },
        modalShowing: false,
        isPaymentEditing: false,     // 是否正在被编辑payment（而不是添加）
        submitting: false,        // 正在上传支付方式

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
      // 根据当前状态生成的校验数据
      validationConf: function () {
        const PAYMENT_TYPES = this.constant.PAYMENT_TYPES

        const {baseValidations, bankValidations} = getPaymentFormConfig(this.$t, this.$tt)

        if (this.form.method === PAYMENT_TYPES.ALIPAY || this.form.method === PAYMENT_TYPES.WECHAT) {
          return this.utils.processValidationConfig(baseValidations)
        } else if (this.form.method === PAYMENT_TYPES.BANKCARD) {
          return this.utils.processValidationConfig(Object.assign(baseValidations, bankValidations))
        } else {
          return this.utils.processValidationConfig(baseValidations)
        }
      }
    },
    validations() {
      return {
        form: this.validationConf.validations
      }
    },
    fetch({store}) {
      return Promise.all([
        store.dispatch('fetchUserPayments'),
        store.dispatch('fetchSystemConstant'),
      ])
    },
    methods: {
      onPaymentStatusChange(payment, checked) {
        const PAYMENT_STATUS = this.constant.PAYMENT_STATUS
        const status = checked ? PAYMENT_STATUS.ON : PAYMENT_STATUS.OFF
        this.axios.user.changePaymentStatus(payment.id, status).then(res => {
          payment.status = status
          this.$showTips(status === PAYMENT_STATUS.ON ? '开启成功' : '关闭成功')
        }).catch(err => {
          this.axios.onError(err)
        })
      },

      clearForm() {
        // 清空之前的值
        const form = Object.assign({}, this.form)
        ;['method', 'account_name', 'bank', 'branch', 'account_no', 'qrCodeImage'].forEach((key) => {
          form[key] = ''
        })
        this.form = form
      },

      onPaymentEdit(payment) {
        this.modalShowing = true
        this.isPaymentEditing = true
        this.form = payment
        this.verify.businessType = this.constant.VERIFY_CODE_BUSINESS.MODIFY_PAYMENT
      },

      onPaymentDelete() {
        this.axios.user.deletePaymentMethod(this.form.id).then(res => {
          this.$showTips('删除成功')
          this.modalShowing = false
          this.isPaymentEditing = false
          this.$store.dispatch('fetchUserPayments')
        }).catch(err => {
          this.axios.onError(err)
        })
      },

      onPaymentAdd() {
        this.modalShowing = true
        this.verify.businessType = this.constant.VERIFY_CODE_BUSINESS.ADD_PAYMENT

        if (this.isPaymentEditing) {
          this.clearForm()
        }
        this.isPaymentEditing = false
      },

      /**
       * 根据当前状态来判断是新增还是更新支付方式
       */
      async addOrUpdatePayment() {
        const paymentApi = this.isPaymentEditing ? this.axios.user.updatePaymentMethod : this.axios.user.addPaymentMethod
        const form = this.form
        const verify = this.verify
        const code = verify.codeType === this.constant.VERIFY_CODE_TYPE.GOOGLE ? verify.google : verify.sms

        this.submitting = true

        if (form.qrCodeImage && form.qrCodeImage.file) {
          try {
            this.$showTips('正在上传图片...')
            const imageData = (await this.axios.misc.upload(this.form.qrCodeImage.file)).data

            form.qrCodeImage.id = form.qr_code_image = imageData.file_key
            form.qrCodeImage.url = imageData.file_url
            delete form.qrCodeImage.file
          } catch (e) {
            this.submitting = false
            this.$errorTips('上传图片失败: ' + e.message + e.code)
            return
          }
        }

        this.$showTips('正在上传数据...')
        return paymentApi({
          validate_code_type: verify.codeType,
          validate_code: code,
          email_code: verify.email,
          email_code_sequence: verify.emailSequence,
          sequence: verify.smsSequence,
          ...form,
        }).then(res => {
          this.submitting = false
          this.$store.dispatch('fetchUserPayments')
          this.modalShowing = false
          this.$showTips(this.isPaymentEditing ? '修改成功' : '添加成功')
        }).catch(err => {
          this.submitting = false
          this.axios.onError(err)
        })
      },

      onFormSubmit(e) {
        e.preventDefault()

        this.$nextTick(() => {
          this.$v.form.$touch()
          this.$refs['verify-code'].verify()

          if (this.$v.form.$invalid) return
          if (this.$refs['verify-code'].$v.$invalid) return

          this.addOrUpdatePayment()
        })
      }
    }
  }
</script>
