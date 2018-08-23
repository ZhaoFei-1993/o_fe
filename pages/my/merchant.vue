<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-merchant {
    // 覆盖layout样式
    .layout-my-desc {
      margin-bottom: 10px;
    }

    .progress-indicator-container {
      background-color: #f9f9f9;
    }
    .progress-item {
      margin: 0 30px;
      padding-top: 25px;
      padding-bottom: 25px;
      border-top: 1px dashed #eee;

      .progress-item-title {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        font-size: 18px;

        &::before {
          content: '';
          display: inline-block;
          margin-right: 10px;
          height: 10px;
          width: 10px;
          font-size: 18px;
          border-radius: 100%;
          background-color: $brightYellow;
        }
      }

      .progress-item-content {
        margin-left: 20px;
      }
    }

    .contact-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1 1 260px;
      padding-top: 20px;
      height: 144px;
      box-shadow: 0 0 10px 0 #ececec;

      &:not(:first-child) {
        margin-left: 30px;
      }

      .iconfont {
        font-size: 16px;
        color: $gray;
      }

      .icon-mobile._active {
        color: $brandYellow;
      }
      .icon-namecard{
        font-size:14px;
      }
      .icon-namecard._active {
        color: $brandYellow;
      }
      .icon-wechat-linear {
        /* 这几个图标本身大小有点不太一样 */
        font-size: 20px;
      }
      .icon-wechat-linear._active {
        color: $brandGreen;
      }

      .contact-item-title {
        font-size: 16px;

        &._required::after {
          content: '*';
          display: inline-block;
          vertical-align: -3px;
          margin-left: 4px;
          color: $red;
        }
      }

      .contact-item-content {
        margin-top: 12px;
      }
    }

    .info-item {
      display: flex;
      margin-top: 20px;

      .info-item-title {
        flex: 0 0 130px;
        margin-right: 20px;
        font-size: 16px;

        &._required::after {
          content: '*';
          display: inline-block;
          vertical-align: -3px;
          margin-left: 4px;
          color: $red;
        }
      }

      .info-item-content {
        color: #6f6f6f;
      }
    }

    .info-item-content-example {
      border: solid 1px #ffbc32;
      padding: 6px 12px;
      line-height: 1.71;
      letter-spacing: normal;
      background-color: #fff9ef;
      color: #6f6f6f;
    }
  }
</style>

<template>
  <CBlock class="page-merchant" x="0" y="0">
    <h3 class="layout-my-title">商家认证</h3>
    <p class="layout-my-desc">成为认证商家，尊享更多时权益</p>
    <template v-if="merchant && !formEditing">
      <MyInfoItem v-if="merchant.auth_status === constant.MERCHANT_AUTH_STATUS.PASS" title="商家认证">
        <template slot="content">
          <p class="c-brand-green">您已通过商家认证审核，现在可以发布广告了</p>
          <Language text="商家认证已锁定 [a][/a] CET" tag="p">
            <span slot="a">{{merchant.guaranty_amount.formatMoney()}}</span>
          </Language>
        </template>
      </MyInfoItem>

      <MyInfoItem v-else-if="merchant.auth_status === constant.MERCHANT_AUTH_STATUS.CREATED" title="商家认证">
        <p slot="content" class="c-brand-green lh-2">信息已提交，审核中</p>
        <!--暂时不做取消申请 jeff 20180716-->
        <!--<b-btn slot="action" variant="outline-green" size="xs" @click="onCancelApply">取消申请</b-btn>-->
      </MyInfoItem>
      <MyInfoItem v-else-if="merchant.auth_status === constant.MERCHANT_AUTH_STATUS.NO" title="商家认证">
        <template slot="content">
          <p class="c-brand-green">您未通过商家认证审核。</p>
          <p>驳回原因：{{merchant.remark||'认证审核资料不符合要求'}}</p>
        </template>
        <b-btn slot="action" variant="outline-green" size="xs" @click="onReSubmit">重新提交</b-btn>
      </MyInfoItem>
      <MyInfoItem v-else-if="merchant.auth_status === constant.MERCHANT_AUTH_STATUS.CANCEL" title="商家认证">
        <p slot="content" class="c-brand-green">审核申请已取消</p>

        <b-btn slot="action" variant="outline-green" size="xs" @click="onReSubmit">重新提交</b-btn>
      </MyInfoItem>
      <MyInfoItem v-else title="商家认证">
        <p slot="content" class="c-brand-green">未认证</p>

        <b-btn slot="action" variant="outline-green" size="xs" @click="onReSubmit">提交认证信息</b-btn>
      </MyInfoItem>
    </template>
    <template v-else>
      <ProgressIndicator :active="-1"/>

      <ProgressItem title="完善信息" class="pt-50">
        <div class="d-flex" v-if="account">
          <ContactItem title="手机认证" icon="icon-mobile" :active="true" :required="true">
            <div v-if="account.mobile" class="c-6f">
              <p>已认证</p>
              <p>+{{account.country_code}} {{account.mobile.hideMiddleChars()}}</p>
            </div>
            <div v-else>
              <p class="c-red">未认证</p>
              <b-link :href="`${coinexDomain}/my/info/security`" target="_blank">去认证</b-link>
            </div>
          </ContactItem>
          <ContactItem title="实名认证" icon="icon-namecard" :required="true">
            <div v-if="kycPassed" class="c-6f">
              已认证
            </div>
            <div v-else>
              <p class="c-red">未认证</p>
              <b-link :href="`${coinexDomain}/my/info/basic`" target="_blank">去认证</b-link>
            </div>
          </ContactItem>
          <ContactItem title="联系人微信" icon="icon-wechat-linear" :required="true">
            <b-form-input v-model="form.wechat" placeholder="用于后续认证与沟通"></b-form-input>
          </ContactItem>
        </div>
      </ProgressItem>

      <ProgressItem title="提交认证视频">
        <InfoItem title="录制认证视频">
          <p>手持实名认证所使用的证件正面，进行视频录制，保持录制过程中声音和影像都清晰</p>
        </InfoItem>
        <InfoItem title="视频诵读范本">
          <p class="info-item-content-example">
            本人（姓名），身份证号（身份证号码）/护照（护照号码），我申请成为CoinEx认证商家，我的资金来源合法可靠，自愿交易比特币等数字资产，本人充分了解数字货币及潜在风险，本人具有抗风险的能力并愿意承担一切风险！</p>
        </InfoItem>
        <InfoItem title="提交认证视频" :required="true">
          <p class="c-6f">请将视频资料发送邮至 bd@coinex.com，邮件主题为"申请成为CoinEx认证商家+CoinEx账户（注册邮箱或手机）"</p>
          <b-form-checkbox v-model="isVideoSent" id="video-checkbox">我已发送认证视频道 bd@coinex.com 邮箱。</b-form-checkbox>
        </InfoItem>
      </ProgressItem>

      <ProgressItem title="缴纳保证金">
        <p class="c-6f">申请成为CoinEx认证商家，需要同意冻结您交易所账户中 {{MERCHANT_REQUIRED_CET_AMOUNT|formatMoney}}
          CET作为商家保证金，钱包中冻结的保证金依然享有分红权益，但是不
          可交易和提现。取消商家认证后，冻结的保证金会立即解冻。
          <b-link :href="`${coinexDomain}/token`" target="_blank">什么是 CET？</b-link>
        </p>
        <InfoItem title="账户可用余额" v-if="balance && balance.coinexBalance">
          <span class="fz-16">{{cetAvailable}} CET</span>
          <span v-if="cetAvailable < MERCHANT_REQUIRED_CET_AMOUNT" class="ml-10">
            <span class="c-red mr-20">余额不足</span>
            请先进行
            <b-link :href="`${coinexDomain}/my/wallet/deposit?type=cet`" target="_blank">充值</b-link>
            或
            <b-link :href="`${coinexDomain}/exchange?currency=bch&dest=cet`" target="_blank">购买</b-link>
          </span>
        </InfoItem>
      </ProgressItem>

      <ProgressItem title="资料审核">
        <p class="c-6f">我们将在3个工作日内对您的商家申请资料进行审核。请保持通讯畅通，我们会主动与您取得联系。审核通过后，您即可在OTC平台发布广告。</p>
        <b-form-checkbox v-model="isContractRead" class="c-6f" id="contract-checkbox">
          我已阅读并同意
          <b-link href="https://support.coinex.com/hc/articles/360007737113" target="_blank">《认证商家服务协议》</b-link>
          ，并冻结{{MERCHANT_REQUIRED_CET_AMOUNT|formatMoney}} CET作为商家保证金。
        </b-form-checkbox>
      </ProgressItem>

      <div class="text-center pb-50">
        <b-btn variant="gradient-yellow" size="lg" style="width:330px;" @click="onSubmit">提交</b-btn>
      </div>
    </template>
  </CBlock>
</template>

<script>
  import Vue from 'vue'
  import {mapState, mapGetters} from 'vuex'
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'
  import ProgressIndicator from '~/components/progress-indicator.vue'
  import MyInfoItem from './_c/my-info-item.vue'
  import {coinexDomain} from '~/modules/variables'

  const ProgressItem = Vue.extend({
    props: {
      title: String
    },
    render() {
      return (
        <div class="progress-item">
          <h4 class="progress-item-title">{this.title}</h4>
          <div class="progress-item-content">{this.$slots['default']}</div>
        </div>
      )
    }
  })

  const InfoItem = Vue.extend({
    props: {
      title: String,
      required: Boolean,
    },
    render() {
      return (
        <div class="info-item">
          <div class={`info-item-title ${this.required && '_required'}`}>{this.title}</div>
          <div class="info-item-content">{this.$slots['default']}</div>
        </div>
      )
    }
  })

  const ContactItem = Vue.extend({
    props: {
      title: String,
      icon: String,
      active: Boolean,
      required: Boolean,
    },
    render() {
      return (
        <div class="contact-item">
          <div class="contact-item-icon"><i class={`iconfont ${this.icon} ${this.active && '_active'}`}/></div>
          <div class={`contact-item-title ${this.required && '_required'}`}>{this.title}</div>
          <div class="contact-item-content">{this.$slots['default']}</div>
        </div>
      )
    }
  })

  export default {
    name: 'page-merchant',
    components: {
      MySidebar,
      My2Column,
      ProgressIndicator,
      ProgressItem,
      InfoItem,
      ContactItem,
      MyInfoItem,
    },
    head() {
      return {
        title: '商家认证' +
        this.$t('global.pageTitle.common')
      }
    },
    data() {
      return {
        form: {
          wechat: '',
        },
        isVideoSent: false,
        isContractRead: false,
        MERCHANT_REQUIRED_CET_AMOUNT: 50000,
        VERIFY_EMAIL: 'bd@coinex.com',
        formEditing: false,
        coinexDomain,
      }
    },
    computed: {
      ...mapState({
        account: state => state.user.account,
        merchant: state => state.user.merchant,
        constant: state => state.constant,
        balance: state => state.balance,
      }),
      ...mapGetters(['kycPassed']),
      cetAvailable() {
        if (!this.balance || !this.balance.coinexBalance) {
          return '--'
        }
        const cet = this.balance.coinexBalance.find(b => b.coin_type === 'CET')
        if (!cet) {
          return 0
        }
        return cet.available.scientificToDecimal()
      },
    },

    fetch({app, store, route, redirect, req}) {
      app.axios.init(req)

      return Promise.all([
        store.dispatch('fetchUserAccount'),
        store.dispatch('fetchUserMerchant'),
        store.dispatch('fetchCoinexBalance'),
      ]).catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    mounted() {
      if (this.merchant) {
        this.form.wechat = this.merchant.wechat
      }
    },
    methods: {
      onSubmit() {
        if (!this.kycPassed) return this.$errorTips(`请先完成实名认证`)
        if (!this.account.mobile) return this.$errorTips(`请先绑定手机`)
        if (!this.isVideoSent) return this.$errorTips(`请先确认发送认证视频到 bd@coinex.com`)
        if (!this.isContractRead) return this.$errorTips('请先阅读并同意服务协议')
        if (!this.form.wechat) return this.$errorTips('请填写联系人微信')
        if (this.form.wechat.length > 30 || this.form.wechat.length < 5) return this.$errorTips('请输入正确的微信号')

        this.axios.user.applyMerchant(this.form).then(res => {
          this.$showTips('提交申请成功')
          return this.$store.dispatch('fetchUserMerchant')
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      onReSubmit() {
        this.formEditing = true
      },
      onCancelApply() {
        this.axios.user.cancelMerchant().then(res => {
          this.$showTips('取消申请成功')
          this.$store.dispatch('fetchUserMerchant')
        })
      }
    }
  }
</script>
