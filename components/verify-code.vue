<!--用户邮箱验证码、google验证码、短信验证码验证-->
<style lang="scss">
  .verify-code {
    .error-message {
      margin: 4px auto 0 auto;
    }

    .code-input-group {
      border-bottom: 1px solid #ddd;

      .code-input {
        border: none;
      }
    }

    .google-group,
    .sms-group {
      margin-bottom: 0;
    }

    .verify-type-change {
      text-align: right;
    }
  }
</style>

<template>
  <div class="verify-code">
    <b-form-group v-if="needEmail" class="email-group" label="邮箱验证码:" horizontal>
      <b-input-group class="code-input-group">
        <b-form-input class="code-input" :value="email" @input="onEmailInput" size="lg" placeholder="6位邮箱验证码"></b-form-input>
        <template slot="append">
          <Language v-if="emailTimer" text="[s][/s]秒重新发送" style="line-height: 40px;" tag="div">
            <span slot="s">{{emailCountdown}}</span>
          </Language>
          <b-btn v-else variant="plain-green" @click="onSendEmailCode">获取验证码</b-btn>
        </template>
      </b-input-group>
      <EMsgs :result="$v" :msgs="invalidMessages" keyName="email"/>
    </b-form-group>

    <b-form-group v-if="needGoogle && codeType === constant.VERIFY_CODE_TYPE.GOOGLE"
                  class="google-group" label="Google 验证码:" horizontal>
      <b-input-group class="code-input-group">
        <b-form-input class="code-input" :value="google" @input="onGoogleInput" size="lg" placeholder="6位Google验证码"></b-form-input>
      </b-input-group>
      <EMsgs :result="$v" :msgs="invalidMessages" keyName="google" class="ps-a"/>
    </b-form-group>

    <b-form-group v-if="needSms && codeType === constant.VERIFY_CODE_TYPE.SMS"
                  class="sms-group" label="短信验证码:" horizontal>
      <b-input-group class="code-input-group">
        <b-form-input class="code-input" :value="sms" @input="onSmsInput" size="lg" placeholder="6位短信验证码"></b-form-input>
        <template slot="append">
          <Language v-if="smsTimer" text="[s][/s]秒重新发送" style="line-height: 40px;" tag="div">
            <span slot="s">{{smsCountdown}}</span>
          </Language>
          <b-btn v-else variant="plain-green" @click="onSendSmsCode">获取验证码</b-btn>
        </template>
      </b-input-group>
      <EMsgs :result="$v" :msgs="invalidMessages" keyName="sms" class="ps-a"/>
    </b-form-group>

    <!--sms、google都存在的情况下才可以切换-->
    <div v-if="needGoogle && needSms" class="verify-type-change">
      使用
      <b-btn class="c-brand-green" variant="plain" size="xxs" @click="onChangeType">
        {{codeType === constant.VERIFY_CODE_TYPE.GOOGLE ? '短信验证' : 'Google验证'}}
      </b-btn>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  import EMsgs from '~/components/error-message.vue'
  import Vuelidate from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import {regex} from 'vuelidate/lib/validators/common'

  Vue.use(Vuelidate)

  const COUNTDOWN = 60

  export default {
    name: 'verify-code',
    components: {
      EMsgs
    },
    props: {
      // 是否需要展示email
      needEmail: {
        type: Boolean,   // 很有趣，如果传'' 或者 0，都会被转化为 true，所以必须明确传 true/false
        default: false
      },
      needGoogle: {
        type: Boolean,
        default: false
      },
      needSms: {
        type: Boolean,
        default: false
      },
      // google验证码的具体值，通过.sync来进行同步
      google: {
        type: String
      },
      sms: {
        type: String
      },
      email: {
        type: String,
      },
      // sms google 二选一
      codeType: String,
      businessType: String,
      smsSequence: Number,
      emailSequence: Number,
    },
    data() {
      return {
        smsCountdown: 60,
        smsTimer: null,
        emailCountdown: 60,
        emailTimer: null,
      }
    },
    computed: {
      ...mapState(['constant']),
      invalidMessages: function () {
        return {
          google: {
            required: '请输入google验证码',
            lengthOf6: '请输入6位数字'
          },
          sms: {
            required: '请输入短信验证码',
            lengthOf6: '请输入6位数字'
          },
          email: {
            required: '请输入邮箱验证码',
            lengthOf6: '请输入6位数字'
          }
        }
      }
    },
    mounted() {
      // 根据用户的数据，来判断下默认显示哪个验证码
      if (this.needGoogle) {
        this.$emit('update:codeType', this.constant.VERIFY_CODE_TYPE.GOOGLE)
      } else if (this.needSms) {
        this.$emit('update:codeType', this.constant.VERIFY_CODE_TYPE.SMS)
      } else {
        this.$emit('update:codeType', '')
      }
    },
    validations: function () {
      const rules = {}
      const VERIFY_CODE_TYPE = this.constant.VERIFY_CODE_TYPE

      const validator = {
        required,
        lengthOf6: regex('lengthOf6', /^.{6}$/)
      }
      if (this.needEmail) {
        rules.email = validator
      }

      if (this.needGoogle && this.codeType === VERIFY_CODE_TYPE.GOOGLE) {
        rules.google = validator
      }

      if (this.needSms && this.codeType === VERIFY_CODE_TYPE.SMS) {
        rules.sms = validator
      }

      return rules
    },
    beforeMount() {
      // 后端保证，ga 和 mobile，用户一定至少有一个
      // const type = this.userData.is_have_totp_auth ? VERIFY_CODE_TYPE.GOOGLE : VERIFY_CODE_TYPE.MESSAGE
      // this.$emit('update:verifyCodeType', type)
    },
    methods: {
      onEmailInput(value) {
        this.$emit('update:email', value)
        this.verify('email')
      },
      onGoogleInput(value) {
        this.$emit('update:google', value)
        this.verify('google')
      },
      onSmsInput(value) {
        this.$emit('update:sms', value)
        this.verify('sms')
      },
      onChangeType() {
        const VERIFY_CODE_TYPE = this.constant.VERIFY_CODE_TYPE
        const type = this.codeType === VERIFY_CODE_TYPE.GOOGLE ? VERIFY_CODE_TYPE.SMS : VERIFY_CODE_TYPE.GOOGLE

        this.$emit('update:codeType', type)
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
      reset() {
        this.$emit('update:sms', '')
        this.$emit('update:google', '')
        this.$emit('update:email', '')

        this.$nextTick(() => {
          this.$v.$reset()
        })
      },
      onSendEmailCode() {
        if (this.emailTimer) return

        this.axios.misc.sendEmailCode(this.businessType).then(data => {
          this.$showTips('邮箱验证码发送成功')
          this.$emit('update:emailSequence', data.data.sequence)

          this.emailCountdown = COUNTDOWN
          this.emailTimer = setInterval(() => {
            this.emailCountdown--

            if (!this.emailCountdown) {
              clearInterval(this.emailTimer)
              this.emailTimer = null
            }
          }, 1000)
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      onSendSmsCode() {
        if (this.smsTimer) return

        this.axios.misc.sendSmsCode(this.businessType).then(data => {
          this.$showTips('短信验证码发送成功')
          this.$emit('update:smsSequence', data.data.sequence)

          this.smsCountdown = COUNTDOWN
          this.smsTimer = setInterval(() => {
            this.smsCountdown--

            if (!this.smsCountdown) {
              clearInterval(this.smsTimer)
              this.smsTimer = null
            }
          }, 1000)
        }).catch(err => {
          this.axios.onError(err)
        })
      },
    }
  }
</script>
