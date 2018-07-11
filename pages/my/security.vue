<style lang="scss">
  .page-my-security {

  }
</style>

<template>
  <My2Column class="page-my-security">
    <MySidebar slot="left"></MySidebar>
    <CBlock slot="right">
      <h3>账户安全</h3>
      <p>互联网账号存在被盗风险，建议您提高账户安全等级</p>
      <MyInfoItem title="邮箱">
        <p>邮箱</p>
        <b-link to="//www.coinex.com/my/info/basic">修改</b-link>
      </MyInfoItem>
      <MyInfoItem title="手机">
        <p>已绑定</p>
        <b-link to="//www.coinex.com/my/info/security">设置</b-link>
      </MyInfoItem>
      <MyInfoItem title="谷歌验证码">
        <p>已绑定</p>
        <b-link to="//www.coinex.com/my/info/security">设置</b-link>
      </MyInfoItem>
      <MyInfoItem title="登录密码">
        <p>建议您定期更改密码以保护账户安全</p>
        <b-link to="//www.coinex.com/my/info/security">修改</b-link>
      </MyInfoItem>
      <MyInfoItem title="实名认证">
        <p>已认证</p>
      </MyInfoItem>
    </CBlock>
  </My2Column>
</template>

<script>
import Vue from 'vue'
import MySidebar from './_c/my-sidebar.vue'
import My2Column from './_c/my-2column.vue'
import MyInfoItem from './_c/my-info-item.vue'

export default {
  name: 'page-my-security',
  components: {
    MySidebar,
    My2Column,
    MyInfoItem,
  },
  data() {
    return {
    }
  }
}
</script>
