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
        <StarRate :length="5" :value="userData.security_level" :readonly="true"/>
      </span>
    </h3>
    <p class="layout-my-desc">互联网账号存在被盗风险，建议您提高账户安全等级</p>
    <MyInfoItem title="邮箱">
      <p slot="content">已绑定 <span> {{userData.email}}</span></p>
      <b-btn slot="action" variant="outline-green" size="xs" href="//www.coinex.com/my/info/basic" target="_blank">修改</b-btn>
    </MyInfoItem>
    <MyInfoItem title="手机">
      <p slot="content">已绑定 <span> {{userData.mobile}}</span></p>
      <b-btn slot="action" variant="outline-green" size="xs" href="//www.coinex.com/my/info/security" target="_blank">设置</b-btn>
    </MyInfoItem>
    <MyInfoItem title="谷歌验证码">
      <p slot="content">{{userData.is_have_totp_auth ? '已绑定' : '未绑定'}}</p>
      <b-btn slot="action" variant="outline-green" size="xs" href="//www.coinex.com/my/info/security" target="_blank">设置</b-btn>
    </MyInfoItem>
    <MyInfoItem title="登录密码">
      <p slot="content">建议您定期更改密码以保护账户安全</p>
      <b-btn slot="action" variant="outline-green" size="xs" href="//www.coinex.com/my/info/security" target="_blank">设置</b-btn>
    </MyInfoItem>
    <MyInfoItem title="实名认证">
      <p slot="content">{{userData.kyc_status === constant.KYC_STATUS.PASS ? '已认证' : '未认证'}}</p>
      <b-btn slot="action" v-if="userData.kyc_status !== constant.KYC_STATUS.PASS" variant="outline-green" size="xs" href="//www.coinex.com/my/info/auth/realname" target="_blank">认证</b-btn>
    </MyInfoItem>
  </CBlock>
</template>

<script>
  import {mapState} from 'vuex'
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'
  import MyInfoItem from './_c/my-info-item.vue'
  import StarRate from '~/components/star-rate.vue'

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
      return {}
    },
    computed: {
      ...mapState(['user', 'constant']),
      userData: function () {
        return this.user.data ? this.user.data : {}
      }
    }
  }
</script>
