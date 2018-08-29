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

    .kyc-detail {
      width: 300px;
      display: flex;
      justify-content: flex-end;
      .kyc-level {
        display: inline-block;
        color: #27313e;
      }
      .kyc-status {
        margin-left: 22px;
        .kyc-go2check {
          display: inline-block;
          margin-left: 10px;
        }
      }
      .kyc-arrow {
        width: 64px;
        height: 23px;
        display: inline-block;
        vertical-align: bottom;
        margin: 0 15px;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAXCAMAAACMPLmjAAABHVBMVEUAAAB519a16eni9/fM8PCf4uH2/PyL3Nqi4+OU399l0NB72Nf6/v7c9fS46umt5uaI29t62dlg0M7r+fnT8vLL7+/C7u1l0dBjzs5q09Nr09JWzMvy/Pvk9/dr09J11tVazMxlz8921tVhz8921tViz89519Zv1dNu1dNZzc1519dm0dBbzs152NZczsx519dSysp11tVo0tFx1NP3/f3s+vrk9/fc9fXR8vHJ7+++7Oyu5+eb4eGQ3t2G29qA2dhu1NNi0M9s09L+///7/v7z+/vw+/ro+Pjg9vXY8/PV8vLN8PDF7u3C7ey66uq36em16eiy6Oeq5eWn5eSk5OOi4+Kf4uKX4N+U396M3NyJ3Nt82Nd519Zez85azs07woK8AAAAMXRSTlMAsyIiIiIiIpmZKpqZmZmZmSLWmZmZmVkKBfPumZmRWUga9fHw7uHSzMW9oqKJiHJgQEecUgAAAN9JREFUOMvF1MWuwkAUgOFewVqsVGhxd3d3d3d4/8dgSgt7ckj4drP5k5nMOdjb4k4M5sdjBwaSSRsPDKQDJDDQMBmBgVYqzAEDKQMuntWIxUJRlNWqQWiaZhiGZVktokOUApVAjxAE4ZMCTbd4jXYnk+n2stl+LjfI54ejQmFcLE6mpdJsvliWy6v1ZrurVPaHavV4qtXq9fPlGWheIxwwcDPgwMDNnIAGHLBA0Am7QowHPaLXgQnkoj/Jv+T3SSZRPJAkGXp9JNhPtPFfHSY/DhtnggMtFBdwpUVx7KPuXPqETfhZgwEAAAAASUVORK5CYII=');
      }
      .kyc-check {
        display: inline-block;
        position: relative;
        width: 12px;
        height: 12px;
        background-color: #fff;
        border: 1px solid #52cbca;
        margin-right: 10px;
        vertical-align: middle;
      }
      .kyc-checked {
        background-color: #52cbca;
        border: none;
        &:after {
          display: block;
          content: "";
          position: absolute;
          left: 4px;
          top: 1px;
          width: 4px;
          height: 8px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
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
    <MyInfoItem title="实名认证">
      <div slot="content">需完成初级和高级实名认证，才可进行OTC交易</div>
      <div slot="action" class="kyc-detail" v-if="kycStatus">
        <div v-for="(item, index) in kycStatus">
          <div class="kyc-check" :class="{'kyc-checked': item.status === 2}"></div>
          <div class="kyc-level">{{ index === 0 ? '初级认证' : '高级认证' }}</div>
          <div v-if="index === 0" class="kyc-arrow"></div>
          <div class="kyc-status" :class="{'c-red': item.status <= 0, 'c-brand-green': item.status === 1}">
            <span>{{ item.text }}</span>
            <b-link v-if="item.showEntry" @click="showDownloadModal = true" class="kyc-go2check">去验证 ></b-link>
          </div>
        </div>
      </div>
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
    <DownloadModal v-model="showDownloadModal"></DownloadModal>
  </CBlock>
</template>

<script>
  import VerifyCode from '~/components/verify-code'
  import {mapState, mapGetters} from 'vuex'
  import {VERIFY_CODE_TYPE, VERIFY_CODE_BUSINESS} from '~/modules/constant'
  import MySidebar from '~/components/my-sidebar'
  import My2Column from '~/components/my-2column'
  import MyInfoItem from './_c/my-info-item'
  import DownloadModal from './_c/download-modal'
  import StarRate from '~/components/star-rate'
  import {coinexDomain} from '~/modules/variables'

  export default {
    name: 'page-my-security',
    components: {
      MySidebar,
      My2Column,
      MyInfoItem,
      StarRate,
      VerifyCode,
      DownloadModal,
    },
    data() {
      return {
        showDownloadModal: false,
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
        KYC_STATUS_TEXT: {
          PASS: '已认证', // 完成初级认证
          PROCESSING: '审核中',
          NO: '未认证',
          FAIL: '已驳回',
          ADVANCED_FAIL: '已驳回',
          ADVANCED_PROCESSING: '审核中',
          ADVANCED_PASS: '已认证', // 完成高级认证
        },
        KYC_STATUS_MAP: { // -1-未开始认证，0-失败，1-进行中，2-完成
          PASS: 2, // 完成初级认证
          PROCESSING: 1,
          NO: -1,
          FAIL: 0,
          ADVANCED_FAIL: 0,
          ADVANCED_PROCESSING: 1,
          ADVANCED_PASS: 2, // 完成高级认证
        },
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
      ...mapGetters(['kycPassed']),
      'VALIDATE_FREQUENCY_MAP': function () {
        return this.constant.VALIDATE_FREQUENCY_MAP
      },
      invalidCode() {
        const wrongGoogle = this.verify.codeType === this.constant.VERIFY_CODE_TYPE.GOOGLE && this.user.account.is_have_totp_auth && (!this.verify.google || this.verify.google.length !== 6)
        const wrongSMS = this.verify.codeType === this.constant.VERIFY_CODE_TYPE.SMS && this.user.account.mobile && (!this.verify.sms || this.verify.sms.length !== 6)
        return this.verifyModalShowing && (wrongGoogle || wrongSMS)
      },
      kycStatus() { // 判断各种组合kyc状态
        let result = [{}, {}] // [初级认证, 高级认证]
        const { account } = this.user
        if (account && account.kyc_status) {
          const status = account.kyc_status
          const { KYC_STATUS } = this.constant
          switch (status) {
            case KYC_STATUS.ADVANCED_PASS: // 高级已完成，初级已完成
              result = [this.getKycStatusData('PASS', false), this.getKycStatusData('ADVANCED_PASS', false)]
              break
            case KYC_STATUS.ADVANCED_PROCESSING: // 高级进行中，初级审核中
              result = [this.getKycStatusData('PASS', false), this.getKycStatusData('ADVANCED_PROCESSING', false)]
              break
            case KYC_STATUS.PROCESSING: // 初级进行中，高级未开始
              result = [this.getKycStatusData('PROCESSING', false), this.getKycStatusData('NO', false)]
              break
            case KYC_STATUS.PASS: // 初级已完成，高级未开始
              result = [this.getKycStatusData('PASS', false), this.getKycStatusData('NO', true)]
              break
            case KYC_STATUS.FAIL: // 初级失败，高级未开始
              result = [this.getKycStatusData('FAIL', true), this.getKycStatusData('NO', false)]
              break
            case KYC_STATUS.ADVANCED_FAIL: // 初级已完成，高级失败
              result = [this.getKycStatusData('PASS', false), this.getKycStatusData('ADVANCED_FAIL', true)]
              break
            default: // 默认初级和高级未开始
              result = [this.getKycStatusData('NO', true), this.getKycStatusData('NO', false)]
          }
        }
        return result
      },
    },
    methods: {
      getKycStatusData(status, isShowEntry = false) { // isShowEntry：是否显示`去验证`入口
        return { status: this.KYC_STATUS_MAP[status], text: this.KYC_STATUS_TEXT[status], showEntry: isShowEntry }
      },
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
