<!--支付方式-->
<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-my-payments {
    min-height: 460px;

    .my-info-item {
      height: 80px;
      align-items: center;
      padding: 0 30px;

      .info-title {
        flex-basis: 120px;
      }

      .info-content {
        margin-right: 60px;
      }
    }

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
      .payment-status-text {
        display: inline-block;
        width: 30px;
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

      .modal-header {
        padding-top: 10px;
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
      .kyc-name {
        margin-bottom: 25px;
        .name {
          border: solid 1px #d1d1d1;
          font-size: 14px;
          border-radius: 0px !important;
          background-color: #f9f9f9;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
        }
      }
    }

    .kyc-step {
      display: inline-block;
      vertical-align: top;
      width: 240px;
      height: 120px;
      margin-top: 20px;
      margin-right: 20px;
      text-align: center;
      background-color: #f9f9f9;

      .kyc-step-number {
        display: inline-block;
        height: 20px;
        width: 20px;
        margin-top: 15px;
        border-radius: 100%;
        background-color: #fff;
      }

      .kyc-step-title {
        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 18px;

        &._highlight {
          color: $brandGreen;
        }
      }
    }
  }
</style>

<template>
  <CBlock class="page-my-payments" x="0" y="0" v-if="this.kycPassed">
    <h3 class="layout-my-title">
      支付方式
      <b-btn @click="onPaymentAdd" variant="plain" size="xs" class="ml-15 c-brand-green">
        <i class="iconfont icon-plus"></i>
        添加支付方式
      </b-btn>
    </h3>
    <p class="layout-my-desc">必须使用您本人的实名账户，被开启的支付方式将在交易时向买方展示，最多开启3个</p>

    <MyInfoItem v-for="(payment, index) in user.payments" :key="index">
      <div slot="title">
        <i class="iconfont fz-18" :class="payment.icon"></i>
        {{payment.title}}
      </div>

      <div slot="content">
        <span class="mr-3">{{payment.account_name}}</span>

        <template v-if="payment.method === constant.PAYMENT_TYPES.BANKCARD">
          <span class="mr-3">{{payment.account_no | splitCardNumber}}</span>
          <span class="mr-3">{{payment.bank_name}}</span>
          <span class="mr-3">{{payment.branch}}</span>
        </template>

        <template v-else>
          <span class="mr-3">{{payment.account_no}}</span>
          <QrcodePopover :target-id="payment.id" v-if="payment.qr_code_image_url" :src="payment.qr_code_image_url"
                         class="ml-1" style="vertical-align: -1px;"/>
        </template>
      </div>

      <div slot="action" class="payment-action">
        <div class="payment-status">
          <span class="payment-status-text">{{payment.status.toUpperCase()}}</span>
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
             noCloseOnBackdrop
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
          <b-form-select v-model="form.method" :options="constant.ACTUAL_PAYMENT_OPTIONS" :disabled="isPaymentEditing"
                         size="lg">
          </b-form-select>
        </b-form-group>
        <!--这里显示有bug 刚好也不需要填写 所以用div-->
        <!--<b-form-group label="姓名:" horizontal>-->
        <!--<b-form-input v-model="form.account_name" size="lg" disabled></b-form-input>-->
        <!--<EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="account_name"/>-->
        <!--</b-form-group>-->
        <div class="kyc-name form-row">
          <label class="col-sm-3 col-form-label">姓名:</label>
          <div class="col-sm-9">
            <div class="name">{{form.account_name}}</div>
          </div>
        </div>
        <div v-if="form.method === 'bankcard'">
          <b-form-group label="开户银行:" horizontal>
            <b-form-select v-model="form.bank" :options="bankOptionsWithDefault"></b-form-select>
            <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="bank"/>
          </b-form-group>
          <b-form-group label="开户支行:" horizontal>
            <input v-model="form.branch" placeholder="请填写开户支行(选填)" type="text" class="form-control form-control-lg">
            <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="branch"/>
          </b-form-group>
          <b-form-group label="银行卡号:" horizontal>
            <b-form-input v-model="form.account_no" size="lg" placeholder="请填写银行卡号"></b-form-input>
            <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="account_no"/>
          </b-form-group>
        </div>

        <div v-if="form.method === 'alipay'">
          <b-form-group label="支付宝账号:" horizontal>
            <b-form-input v-model="form.account_no" size="lg" placeholder="请填写支付宝账号"></b-form-input>
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
            <b-form-input v-model="form.account_no" size="lg" placeholder="请填写微信账号"></b-form-input>
            <EMsgs :result="$v.form" :msgs="validationConf.messages" keyName="account_no"/>
          </b-form-group>
          <b-form-group label="收款二维码:" horizontal>
            <div class="payment-qrcode">
              <ImageUploadPreview v-model="form.qrCodeImage"/>

              <p class="ml-10">为确保二维码正确，请添加后先自己进行扫描测试</p>
            </div>
          </b-form-group>
        </div>

        <VerifyCode v-if="user&&user.account"
                    :needGoogle="user.account.is_have_totp_auth"
                    :needSms="!!user.account.mobile"
                    :needEmail="true"
                    :sms.sync="verify.sms"
                    :google.sync="verify.google"
                    :email.sync="verify.email"
                    :codeType.sync="verify.codeType"
                    :businessType="verify.businessType"
                    :emailSequence.sync="verify.emailSequence"
                    :smsSequence.sync="verify.smsSequence"
                    ref="verify-code"/>
      </b-form>
    </b-modal>
  </CBlock>

  <CBlock class="page-my-payments" y="0" v-else>
    <h3 class="layout-my-title pl-0">2步完成添加支付方式</h3>
    <KycStep :step="1" title="完成高级实名认证" highlight>
      <span v-if="user.account.kyc_status === constant.KYC_STATUS.PROCESSING">审核中</span>
      <b-link v-else @click="showDownloadModal = true">去实名 ></b-link>
    </KycStep>
    <KycStep :step="2" title="添加支付方式"/>
    <DownloadModal v-model="showDownloadModal" title="实名认证" header="实名认证请前往CoinEx APP中 「 账户 」-「 实名认证 」 中进行。"></DownloadModal>
  </CBlock>
</template>

<script>
  import Vue from 'vue'
  import {mapState, mapGetters} from 'vuex'
  import MySidebar from '~/components/my-sidebar'
  import My2Column from '~/components/my-2column'
  import MyInfoItem from './_c/my-info-item'
  import DownloadModal from '~/components/download-modal'
  import ToggleButton from '~/components/toggle-button'
  import VerifyCode from '~/components/verify-code'
  import ImageUploadPreview from '~/components/image-upload-components/image-upload-preview'
  import QrcodePopover from '~/components/qrcode-popover'
  import Vuelidate from 'vuelidate'
  import getPaymentFormConfig from './payment-form-config'
  import EMsgs from '~/components/error-message'
  import {coinexDomain} from '~/modules/variables'
  import {PAYMENT_TYPES, VERIFY_CODE_TYPE} from '~/modules/constant'

  Vue.use(Vuelidate)

  const KycStep = Vue.extend({
    props: {
      step: Number,
      title: String,
      highlight: Boolean,
    },
    render() {
      return (
        <div class="kyc-step">
          <div class="kyc-step-number">{this.step}</div>
          <div class={'kyc-step-title ' + (this.highlight && '_highlight')}>{this.title}</div>
          {this.$slots['default']}
        </div>
      )
    }
  })

  const DEFAULT_FORM = {
    method: PAYMENT_TYPES.BANKCARD,
    // account_name: '',        // 名字是从store拿的，不修改
    bank: null,
    branch: '',
    account_no: '',
    qr_code_image: '',
    qrCodeImage: '',          // {url, blob, file, id}
  }

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
      QrcodePopover,
      KycStep,
      DownloadModal,
    },
    head() {
      return {
        title: '支付方式' +
        this.$t('global.pageTitle.common')
      }
    },
    data() {
      return {
        showDownloadModal: false,
        verify: {
          codeType: VERIFY_CODE_TYPE.GOOGLE,
          sms: '',
          google: '',
          email: '',
          businessType: '',
          smsSequence: 0,
          emailSequence: 0
        },
        form: Object.assign({
          method: '',
          account_name: '',
        }, DEFAULT_FORM),
        modalShowing: false,
        isPaymentEditing: false,     // 是否正在被编辑payment（而不是添加）
        submitting: false,        // 正在上传支付方式
        coinexDomain,
      }
    },
    computed: {
      ...mapState(['constant', 'user']),
      ...mapGetters(['kycPassed']),
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
      },
      bankOptionsWithDefault: function () {
        // 添加了默认选项的银行卡列表
        return [{
          value: null,
          text: '-- 请选择开户银行 --',
          disabled: true
        }].concat(this.constant.bankOptions)
      }
    },
    validations() {
      return {
        form: this.validationConf.validations
      }
    },
    fetch({store, app, req, redirect, route}) {
      app.axios.init(req)
      return Promise.all([
        store.dispatch('fetchUserPayments'),
        store.dispatch('fetchSystemConstant'),
        store.dispatch('fetchUserAccount'),
      ]).catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    mounted() {
      // 默认选中银行卡
      this.form.method = this.constant.PAYMENT_TYPES.BANKCARD
      // 用户名自动从用户的实名认证中取，且不可修改
      const userKyc = this.user.account.user_kyc
      this.form.account_name = userKyc && userKyc.last_name + userKyc.first_name
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
        this.form = Object.assign({}, this.form, DEFAULT_FORM)
      },

      onPaymentEdit(payment) {
        this.modalShowing = true
        this.isPaymentEditing = true
        this.form = Object.assign({}, payment)
        this.verify.businessType = this.constant.VERIFY_CODE_BUSINESS.MODIFY_PAYMENT

        this.$refs['verify-code'].reset()
        this.$v.form.$reset()
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
        if (!this.kycPassed) {
          this.$showDialog({
            title: '未实名认证',
            content: '请实名认证后再添加支付方式',
            onOk: () => {
              window.location.href = `${coinexDomain}/my/info/basic`
            },
            okTitle: '实名认证'
          })

          return
        }
        this.modalShowing = true
        this.verify.businessType = this.constant.VERIFY_CODE_BUSINESS.ADD_PAYMENT

        if (this.isPaymentEditing) {
          this.isPaymentEditing = false

          this.clearForm()
        }

        this.$refs['verify-code'].reset()
        this.$v.form.$reset()
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

            form.qrCodeImage.id = imageData.file_key
            form.qrCodeImage.url = imageData.file_url
            delete form.qrCodeImage.file
          } catch (e) {
            this.submitting = false
            this.$errorTips('上传图片失败: ' + e.message + e.code)
            return
          }
        }

        form.qr_code_image = form.qrCodeImage && form.qrCodeImage.id
        form.qr_code_image_url = form.qrCodeImage && form.qrCodeImage.url

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
          this.modalShowing = false
          this.$showTips(this.isPaymentEditing ? '修改成功' : '添加成功')
          this.clearForm()
          this.$refs['verify-code'].resetTimer()

          return this.$store.dispatch('fetchUserPayments')
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
