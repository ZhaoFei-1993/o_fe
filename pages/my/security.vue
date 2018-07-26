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
      <p slot="content"><span>{{user.account.email}}</span></p>
      <b-btn slot="action" variant="outline-green" size="xs" :href="`${coinexDomain}/my/info/basic`" target="_blank">修改</b-btn>
    </MyInfoItem>
    <MyInfoItem title="手机">
      <p slot="content">
        <span v-if="user.account.mobile">+{{user.account.country_code}} {{user.account.mobile}}</span>
        <span v-else class="c-red">未绑定</span>
      </p>
      <b-btn slot="action" variant="outline-green" size="xs" :href="`${coinexDomain}/my/info/security`" target="_blank">更换</b-btn>
    </MyInfoItem>
    <MyInfoItem title="谷歌验证码">
      <p slot="content">{{user.account.is_have_totp_auth ? '已绑定' : '未绑定'}}</p>
      <b-btn slot="action" variant="outline-green" size="xs" :href="`${coinexDomain}/my/info/security`" target="_blank">
        {{user.account.is_have_totp_auth ? '更换' : '绑定'}}
      </b-btn>
    </MyInfoItem>
    <MyInfoItem title="登录密码">
      <p slot="content">建议您定期更改密码以保护账户安全</p>
      <b-btn slot="action" variant="outline-green" size="xs" :href="`${coinexDomain}/my/info/security`" target="_blank">重置</b-btn>
    </MyInfoItem>
    <MyInfoItem title="实名认证">
      <p slot="content">
        <span v-if="user.account.kyc_status === constant.KYC_STATUS.PASS">已认证</span>
        <span v-else-if="user.account.kyc_status === constant.KYC_STATUS.PROCESSING" class="c-brand-green">信息已提交，待系统审核</span>
        <span v-else class="c-red">未认证</span>
      </p>
      <b-btn slot="action"
             v-if="user.account.kyc_status !== constant.KYC_STATUS.PASS"
             :disabled="user.account.kyc_status === constant.KYC_STATUS.PROCESSING"
             variant="outline-green" size="xs" target="_blank"
             :href="`${coinexDomain}/my/info/auth/realname`">
        认证
      </b-btn>
    </MyInfoItem>
    <MyInfoItem title="交易验证">
      <p slot="content">
        <span v-if="user.account.trade_validate_frequency === 'never'">从不二次验证</span>
        <span v-if="user.account.trade_validate_frequency === 'each_two_hours'">2小时内不二次验证</span>
        <span v-if="user.account.trade_validate_frequency === 'each_time'">每次交易均二次验证</span>
      </p>
      <b-btn slot="action" variant="outline-green" size="xs" target="_blank" :href="`${coinexDomain}/my/info/security`">更换</b-btn>
    </MyInfoItem>
  </CBlock>
</template>

<script>
  import {mapState} from 'vuex'
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
    },
    layout: 'my',
    data() {
      return {
        coinexDomain,
      }
    },
    fetch({app, store, req, redirect, route}) {
      app.axios.init(req)
      return store.dispatch('fetchUserAccount').catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    computed: {
      ...mapState(['user', 'constant'])
    }
  }
</script>
