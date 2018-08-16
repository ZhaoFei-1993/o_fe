<style lang="scss">
  .page-my-security {
    .layout-my-title {
      display: flex;
      justify-content: space-between;
    }

    .my-security-level {
      display: flex;
      align-items: center;
      font-size: 14px;

      .star-rate {
        margin-top: -4px;
        vertical-align: -1px;
      }
    }

    .trade-frequency-ratio-group {
      width: 180px;
      margin: 0 auto;

      .custom-radio {
        margin-bottom: 5px;
      }
    }
  }
</style>

<template>
  <CBlock class="page-my-security" :x="0" :y="0">
    <h3 class="layout-my-title">
      账户安全
      <span class="my-security-level">
        安全等级:
        <StarRate :length="5" :value="user.account.securityLevel" :readonly="true"/>
      </span>
    </h3>
    <p class="layout-my-desc">强烈建议完成以下设置提升账户安全等级。</p>
    <MyInfoItem title="邮箱">
      <p slot="content"><span>{{user.account.email.hideMiddleChars(6)}}</span></p>
      <b-btn slot="action" variant="outline-green" size="xs" :href="`${coinexDomain}/my/info/basic`" target="_blank">
        修改
      </b-btn>
    </MyInfoItem>
    <MyInfoItem title="手机">
      <p slot="content">
        <span v-if="user.account.mobile">+{{user.account.country_code}} {{user.account.mobile.hideMiddleChars()}}</span>
        <span v-else class="c-red">未绑定</span>
      </p>
      <b-btn slot="action" variant="outline-green" size="xs" :href="`${coinexDomain}/my/info/security`" target="_blank">
        {{user.account.mobile ? '更换' : '绑定'}}
      </b-btn>
    </MyInfoItem>
    <MyInfoItem title="谷歌验证码">
      <p slot="content">
        <span v-if="user.account.is_have_totp_auth">已绑定</span>
        <span v-else class="c-red">未绑定</span>
      </p>
      <b-btn slot="action" variant="outline-green" size="xs" :href="`${coinexDomain}/my/info/security`" target="_blank">
        {{user.account.is_have_totp_auth ? '更换' : '绑定'}}
      </b-btn>
    </MyInfoItem>
    <MyInfoItem title="登录密码">
      <p slot="content" :class="{'c-red': user.account.login_password_level === constant.PASSWORD_LEVEL.LOW}">
        <span class="mr-1">密码强度:</span>
        <span v-if="user.account.login_password_level === constant.PASSWORD_LEVEL.HIGH">高</span>
        <span v-if="user.account.login_password_level === constant.PASSWORD_LEVEL.MIDDLE">中</span>
        <span v-if="user.account.login_password_level === constant.PASSWORD_LEVEL.LOW">低</span>
      </p>
      <b-btn slot="action" variant="outline-green" size="xs" :href="`${coinexDomain}/my/info/security`" target="_blank">
        重置
      </b-btn>
    </MyInfoItem>
    <MyInfoItem title="实名认证">
      <p slot="content">
        <span v-if="user.account.kyc_status === constant.KYC_STATUS.PASS">已认证</span>
        <span v-else-if="user.account.kyc_status === constant.KYC_STATUS.PROCESSING"
              class="c-brand-green">信息已提交，待系统审核</span>
        <span v-else class="c-red">未认证</span>
      </p>
      <b-btn slot="action"
             v-if="user.account.kyc_status !== constant.KYC_STATUS.PASS"
             :disabled="user.account.kyc_status === constant.KYC_STATUS.PROCESSING"
             variant="outline-green" size="xs" target="_blank"
             :href="`${coinexDomain}/my/info/basic`">
        认证
      </b-btn>
    </MyInfoItem>
    <MyInfoItem title="收款时安全验证">
      <p slot="content">
        <span v-if="user.account.trade_validate_frequency === VALIDATE_FREQUENCY_MAP.never.value"
              class="c-red">从不二次验证</span>
        <span
          v-if="user.account.trade_validate_frequency === VALIDATE_FREQUENCY_MAP.each_two_hours.value">2小时内不二次验证</span>
        <span v-if="user.account.trade_validate_frequency === VALIDATE_FREQUENCY_MAP.each_time.value">每次收款均二次验证</span>
      </p>
      <b-btn slot="action" variant="outline-green" size="xs" target="_blank" @click="onChangeFrequency">更换</b-btn>
    </MyInfoItem>
    <b-modal v-model="frequencyModalShowing"
             title="收款时安全验证"
             okTitle="确定" ok-variant="gradient-yellow" button-size="lg" okOnly
             @ok.prevent="onChangeFrequencyConfirm">
      <!--一定要有v-if，应该是b-form-radio-group的bug，如果初始化时model没有参数，会导致radio无法选择-->
      <b-form-radio-group v-if="tradeValidateFrequency"
                          class="trade-frequency-ratio-group"
                          v-model="tradeValidateFrequency"
                          :options="VALIDATE_FREQUENCY_MAP"
                          stacked>
      </b-form-radio-group>
    </b-modal>
    <b-modal v-model="verifyModalShowing"
             title="二次验证"
             okTitle="提交" ok-variant="gradient-yellow" button-size="lg"
             :ok-disabled="invalidCode"
             okOnly
             @ok.prevent="onVerifyChangeFrequencyConfirm">
      <VerifyCode class="verify-code-component"
                  ref="verify-code"
                  :hide-label="true"
                  :needGoogle="user.account.is_have_totp_auth"
                  :needSms="!!user.account.mobile"
                  :sms.sync="verify.sms"
                  :google.sync="verify.google"
                  :codeType.sync="verify.codeType"
                  :businessType="verify.businessType"
                  :smsSequence.sync="verify.smsSequence"
      />
    </b-modal>
  </CBlock>
</template>

<script>
  import VerifyCode from '~/components/verify-code'
  import {mapState} from 'vuex'
  import {VERIFY_CODE_TYPE, VERIFY_CODE_BUSINESS} from '~/modules/constant'
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'
  import MyInfoItem from './_c/my-info-item.vue'
  import StarRate from '~/components/star-rate.vue'
  import {coinexDomain} from '~/modules/variables'

  export default {
    name: 'page-my-security',
    components: {
      MySidebar,
      My2Column,
      MyInfoItem,
      StarRate,
      VerifyCode,
    },
    data() {
      return {
        coinexDomain,
        frequencyModalShowing: false,
        tradeValidateFrequency: '',
        verify: {
          codeType: VERIFY_CODE_TYPE.GOOGLE,
          sms: '',
          google: '',
          businessType: VERIFY_CODE_BUSINESS.MODIFY_FREQUENCY,
          smsSequence: 0,
        },
        verifyModalShowing: false,
      }
    },
    head() {
      return {
        title: '账户安全' + this.$t('global.pageTitle.common')
      }
    },
    fetch({app, store, req, redirect, route}) {
      app.axios.init(req)
      return store.dispatch('fetchUserAccount').catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    computed: {
      ...mapState(['user', 'constant']),
      'VALIDATE_FREQUENCY_MAP': function () {
        return this.constant.VALIDATE_FREQUENCY_MAP
      },
      invalidCode() {
        const wrongGoogle = this.verify.codeType === this.constant.VERIFY_CODE_TYPE.GOOGLE && this.user.account.is_have_totp_auth && (!this.verify.google || this.verify.google.length !== 6)
        const wrongSMS = this.verify.codeType === this.constant.VERIFY_CODE_TYPE.SMS && this.user.account.mobile && (!this.verify.sms || this.verify.sms.length !== 6)
        return this.verifyModalShowing && (wrongGoogle || wrongSMS)
      },
    },
    methods: {
      onChangeFrequency() {
        const account = this.user.account
        if (!(account.is_have_totp_auth || account.mobile)) {
          return this.$errorTips('请先绑定手机或谷歌验证，再进行更换')
        }
        this.frequencyModalShowing = true
        this.tradeValidateFrequency = this.user.account.trade_validate_frequency
      },
      onChangeFrequencyConfirm() {
        this.frequencyModalShowing = false
        if (this.tradeValidateFrequency === this.user.account.trade_validate_frequency) {
          return
        }
        const account = this.user.account
        const isLevelDown = this.VALIDATE_FREQUENCY_MAP[this.tradeValidateFrequency].level < this.VALIDATE_FREQUENCY_MAP[account.trade_validate_frequency].level
        if ((account.is_have_totp_auth || account.mobile) && isLevelDown) {
          this.verify.sms = ''
          this.verify.google = ''
          this.$refs['verify-code'] && this.$refs['verify-code'].resetValidation()
          this.verifyModalShowing = true
        } else {
          this.updateFrequency({trade_validate_frequency: this.tradeValidateFrequency})
        }
      },
      onVerifyChangeFrequencyConfirm() {
        const verify = this.verify
        const code = verify.codeType === this.constant.VERIFY_CODE_TYPE.GOOGLE ? verify.google : verify.sms
        const data = {
          validate_code_type: verify.codeType,
          validate_code: code,
          sequence: verify.smsSequence,
          trade_validate_frequency: this.tradeValidateFrequency,
        }
        this.updateFrequency(data)
      },
      updateFrequency(data) {
        this.axios.user.changeTradeValidateFrequency(data).then(res => {
          this.$store.dispatch('fetchUserAccount')
          this.$successTips('修改成功')
          this.verifyModalShowing = false
        }).catch(err => {
          if (err.code === this.constant.ERROR_CODE.VALIDATE_CODE_REQUIRED) {
            this.$errorTips('验证码错误')
          } else {
            this.$showTips(err.message, 'error')
          }
        })
      }
    }
  }
</script>
