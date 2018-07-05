<!--用户支付密码、google验证码、短信验证码验证-->
<style lang="scss">
  .verify-password {
    .verify-item-container {
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    .verify-item {
      display: flex;
      margin: 0 auto;
      margin-top: 20px;
      width: 700px;
      align-items: center;

      .verify-item-label {
        flex: 0 1 150px;
        margin-right: 20px;
        text-align: right;
        font-size: 16px;
      }

      .verify-item-input {
        flex: 3 1 0;
        margin-right: 100px;
      }
    }

    .error-message {
      width: 500px;
      margin: 4px auto 0 auto;
      padding-left: 70px;
    }

    .verify-sms-group {
      border: solid 1px #d1d1d1;

      input {
        border: none;
      }
    }

    .verify-item-password,
    .verify-ga-input {
      border-radius: 0;
      border: solid 1px #d1d1d1;
      line-height: 23px; // 重置一下高度，和sms保持一致
    }
    .verify-type-change {
      @extend .verify-item;

      justify-content: flex-end;
      margin-top: 5px;
      padding-right: 100px;
    }
  }
</style>

<template>
  <div class="verify-password">
    <div v-if="userData.is_have_payment_password" class="verify-item">
      <div class="verify-item-label">支付密码:</div>
      <b-form-input class="verify-item-input verify-item-password" :value="password" type="password" size="sm"
                    @change="onPasswordChange"></b-form-input>
    </div>
    <EMsgs :result="$v.password" :msgs="invalidMessages.password"/>

    <div v-if="userData.mobile && verifyCodeType === VERIFY_CODE_TYPE.MESSAGE" class="verify-item">
      <div class="verify-item-label">短信验证码:</div>
      <b-input-group class="verify-item-input verify-sms-group" size="sm">
        <b-form-input class="J_sms" :value="sms" placeholder="6位验证码" @change="onSmsChange"></b-form-input>
        <b-btn slot="append"
               variant="plain"
               size="xxs"
               class="c-dark"
               :disabled="!!smsTimer"
               @click="onSendSmsCode">获取验证码 {{smsTimer ? `(${smsCountdown})` : ''}}
        </b-btn>
      </b-input-group>
    </div>
    <EMsgs :result="$v.sms" :msgs="invalidMessages.sms"/>

    <div class="verify-item-container">
      <div v-if="userData.is_have_totp_auth && verifyCodeType === VERIFY_CODE_TYPE.GOOGLE" class="verify-item">
        <div class="verify-item-label">谷歌验证码:</div>
        <b-form-input class="J_ga verify-item-input verify-ga-input"
                      :value="ga"
                      placeholder="6位Google验证码"
                      size="sm"
                      @change="onGAChange">
        </b-form-input>
      </div>
      <EMsgs :result="$v.ga" :msgs="invalidMessages.ga"/>
    </div>

    <!--sms、ga都存在的情况下才可以切换-->
    <div v-if="userData.is_have_totp_auth && userData.mobile" class="verify-type-change">
      使用
      <b-btn class="c-brand-green" variant="plain" size="xxs" @click="onChangeType">
        {{verifyCodeType === VERIFY_CODE_TYPE.GOOGLE ? '短信验证' : 'Google验证'}}
      </b-btn>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import EMsgs from '~/components/error-message.vue'
  import {VERIFY_CODE_TYPE} from '~/modules/constant'
  import {onApiError} from '~/modules/error-code'
  import Vuelidate from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import {regex} from 'vuelidate/lib/validators/common'

  Vue.use(Vuelidate)

  export default {
    name: 'verify-password',
    components: {
      EMsgs
    },
    props: {
      password: String,
      ga: String,
      sms: String,
      userData: Object,
      verifyCodeType: Number,
      businessType: Number
    },
    data() {
      return {
        VERIFY_CODE_TYPE,
        smsCountdown: 60,
        smsTimer: null,
      }
    },
    computed: {
      invalidMessages: function () {
        return {
          ga: {
            required: '请输入google验证码',
            ga: '请输入6位数字'
          },
          sms: {
            required: '请输入短信验证码',
            sms: '请输入6位数字'
          },
          password: {
            required: '请输入支付密码',
            password: '请输入6位支付密码'
          }
        }
      }
    },
    validations: function () {
      const rules = {}

      if (this.userData.is_have_payment_password) {
        rules.password = {
          required,
          password: regex('password', /^.{6}$/)
        }
      }

      if (this.verifyCodeType === VERIFY_CODE_TYPE.GOOGLE) {
        rules.ga = {
          required,
          ga: regex('ga', /^\d{6}$/)
        }
      }

      if (this.verifyCodeType === VERIFY_CODE_TYPE.MESSAGE) {
        rules.sms = {
          required,
          sms: regex('sms', /^\d{6}$/)
        }
      }

      return rules
    },
    beforeMount() {
      // 后端保证，ga 和 mobile，用户一定至少有一个
      const type = this.userData.is_have_totp_auth ? VERIFY_CODE_TYPE.GOOGLE : VERIFY_CODE_TYPE.MESSAGE
      this.$emit('update:verifyCodeType', type)
    },
    methods: {
      onPasswordChange(value) {
        this.$emit('update:password', value)
        this.verify('password')
      },
      onGAChange(value) {
        this.$emit('update:ga', value)
        this.verify('ga')
      },
      onSmsChange(value) {
        this.$emit('update:sms', value)
        this.verify('sms')
      },
      onChangeType() {
        const type = this.verifyCodeType === VERIFY_CODE_TYPE.GOOGLE ? VERIFY_CODE_TYPE.MESSAGE : VERIFY_CODE_TYPE.GOOGLE

        this.$emit('update:verifyCodeType', type)
      },
      /**
       * 校验字段，有传入字段就校验字段，没有就校验所有内容
       * @param field
       * @return {boolean}
       */
      verify(field) {
        if (field) {
          this.$v[field].$touch()
        } else {
          this.$v.$touch()
        }

        return !this.$v.$invalid
      },
      onSendSmsCode() {
        if (this.smsTimer) return

        this.axios.misc.sendSmsCode(this.businessType).then(data => {
          this.$showTips('短信发送成功')

          this.smsCountdown = 60
          this.smsTimer = setInterval(() => {
            this.smsCountdown--

            if (!this.smsCountdown) {
              clearInterval(this.smsTimer)
              this.smsTimer = null
            }
          }, 1000)
        }).catch(err => {
          onApiError(err, this)
        })
      },
    }
  }
</script>
