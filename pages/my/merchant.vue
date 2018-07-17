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

        &::before {
          content: '';
          display: inline-block;
          margin-right: 10px;
          height: 10px;
          width: 10px;
          font-size: 18px;
          border-radius: 100%;
          background-color: $brandYellow;
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
        font-size: 20px;
      }

      .icon-mobile._active {
        color: $brandYellow;
      }

      .icon-namecard._active {
        color: $brandYellow;
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
      height: 60px;
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

    <MyInfoItem v-if="merchant.status === constant.MERCHANT_STATUS.PASS" title="商家认证">
      <p slot="content" class="c-brand-green">已成为认证商家</p>
    </MyInfoItem>

    <MyInfoItem v-else-if="merchant.status === constant.MERCHANT_STATUS.CREATED" title="商家认证">
      <p slot="content" class="c-brand-green">信息已提交，审核中</p>
      <b-btn slot="action" variant="outline-green" size="xs" @click="onCancelApply">取消申请</b-btn>
    </MyInfoItem>

    <template v-else>
      <ProgressIndicator :active="-1"/>

      <ProgressItem title="完善信息">
        <div class="d-flex">
          <ContactItem title="手机认证" icon="icon-mobile" :active="true" :required="true">
            <div v-if="account.mobile" class="c-6f">
              <p class="mt-10">已认证</p>
              <p>{{account.mobile}}</p>
            </div>
            <div v-else>
              <p class="c-red">未认证</p>
              <b-link href="//www.coinex.com/my/info/security">去认证 ></b-link>
            </div>
          </ContactItem>
          <ContactItem title="实名认证" icon="icon-namecard" :required="true">
            <div v-if="account.kyc_status === constant.KYC_STATUS.PASS" class="c-6f">
              <p class="mt-10">已认证</p>
            </div>
            <div v-else>
              <p class="c-red">未认证</p>
              <b-link href="//www.coinex.com/my/info/security">去认证 ></b-link>
            </div>
          </ContactItem>
          <ContactItem title="联系人微信" icon="icon-wechat-linear" :active="true" :required="true">
            <b-form-input v-model="form.wechat" placeholder="该微信号码用于后续认证与沟通"></b-form-input>
          </ContactItem>
        </div>
      </ProgressItem>

      <ProgressItem title="提交认证视频">
        <InfoItem title="录制认证视频">
          <p>手持身份证正面，进行视频录制，保持录制过程中声音和影像都清晰</p>
        </InfoItem>
        <InfoItem title="视频诵读范本">
          <p class="info-item-content-example">本人（姓名），身份证号（身份证号码），我申请成为CoinEx认证商家，我的资金来源合法可靠，自愿交易比特币等数字资产，本人充分了解数字货币及潜在风险，本人具有抗风险的能力并愿意承担一切风险！</p>
        </InfoItem>
        <InfoItem title="提交认证视频" :required="true">
          <p class="c-6f">请将视频资料发送邮至 bd@coinex.com，邮件主题为"申请成为CoinEx认证商家+CoinEx账户（注册邮箱或手机）"</p>
          <b-form-checkbox v-model="isVideoSent">我已发送认证视频道 bd@coinex.com 邮箱。</b-form-checkbox>
        </InfoItem>
      </ProgressItem>

      <ProgressItem title="缴纳保证金">
        <p class="c-6f">申请成为CoinEx认证商家，需要同意冻结您交易所账户中 100,000 CET作为商家保证金，钱包中冻结的保证金依然享有分红权益，但是不
          可交易和体现。什么是 CET？</p>
        <InfoItem title="账户余额">
          {{balance.cet}}
          <span v-if="balance.cet < MERCHANT_REQUIRED_CET_AMOUNT">
            <span class="c-red mr-20">余额不足</span>
            请先进行
            <b-link href="//www.coinex.com/my/wallet/deposit?type=cet">充值</b-link>
          </span>
        </InfoItem>
      </ProgressItem>

      <ProgressItem title="资料审核">
        <p class="c-6f">我们将在3个工作日内对您的商家申请资料进行审核。请保持通讯畅通，我们会主动与您取得联系。审核通过后，您即可在OTC平台发布广告。</p>
        <b-form-checkbox v-model="isContractRead" class="c-6f">
          我已阅读并同意 <b-link>《认证商家服务协议》</b-link>，并冻结100,000 CET作为商家保证金。
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
  import {mapState} from 'vuex'
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'
  import ProgressIndicator from '~/components/progress-indicator.vue'
  import MyInfoItem from './_c/my-info-item.vue'

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
          <div class="contact-item-icon"><i class={`iconfont ${this.icon} ${this.active && '_active'}` }/></div>
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
    layout: 'my',
    data() {
      return {
        form: {
          wechat: '',
        },
        isVideoSent: false,
        isContractRead: false,
        balance: {
          cet: 1000,
        },  // todo:用store里面的balance
        MERCHANT_REQUIRED_CET_AMOUNT: 10000,
        VERIFY_EMAIL: 'bd@coinex.com',
      }
    },
    computed: {
      ...mapState({
        account: state => state.user.account,
        merchant: state => state.user.merchant,
        constant: state => state.constant,
      })
    },

    fetch({app, store, route, redirect, req}) {
      return Promise.all([
        store.dispatch('fetchUserAccount'),
        store.dispatch('fetchUserMerchant'),
      ])
    },
    mounted() {
      this.form.wechat = this.merchant.wechat
    },
    methods: {
      onSubmit() {
        if (!this.isVideoSent) return this.$showTips(`请先确认发送认证视频到 bd@coinex.com`, 'error')
        if (!this.isContractRead) return this.$showTips('请先阅读并同意服务协议', 'error')

        this.axios.user.applyMerchant(this.form).then(res => {
          this.$showTips('提交申请成功')
          this.$store.dispatch('fetchUserMerchant')
        })
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
