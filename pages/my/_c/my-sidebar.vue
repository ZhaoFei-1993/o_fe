<style>
  .my-sidebar {
    .my-sidebar-info {

    }
  }
</style>
<template>
  <div class="my-sidebar" v-if="user.data">
    <CBlock class="my-sidebar-info">
      <div>
        <div>{{user.data.username[0]}}</div>
        <div>
          <div>{{user.data.username}}</div>
          <div></div>
        </div>
      </div>
      <div>
        30天成交量 {{user.data.recent_deal_count}}
      </div>
      <div>
        30天完成率 {{user.data.recent_deal_count / user.data.recent_order_count}}
      </div>
      <div>
        平均付款时间 {{user.data.average_pay_time}}
      </div>
      <div>
        平均放行时间 {{user.data.average_release_time}}
      </div>
    </CBlock>
    <b-list-group class="my-sidebar-menu">
      <b-list-group-item to="/my/security">
        <i class="iconfont icon-i-ticket"></i>
        <span class="title">账户安全</span>
      </b-list-group-item>
      <b-list-group-item to="/my/payments">
        <i class="iconfont icon-i-ticket"></i>
        <span class="title">支付方式</span>
      </b-list-group-item>
      <b-list-group-item to="/my/merchant">
        <i class="iconfont icon-message"></i>
        <span class="title">商家认证</span>
      </b-list-group-item>
      <b-list-group-item to="/my/item-setting">
        <i class="iconfont icon-rebate"></i>
        <span class="title">广告设置</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
      }
    },
    computed: {
      ...mapState(['user'])
    },
    beforeMount() {
      this.$store.dispatch('setUserData')
    },
    methods: {},
  }
</script>


