<template>
  <div class="user-stats-profile">
    <UserMiniProfile class="user-mini-profile" :username="userData.name" :online="true"/>
    <div class="pt-20 px-20">
      <SidebarInfoItem title="30天成交量">
        <Language text="[t][/t] 单">
          <span slot="t" class="c-brand-yellow">{{userData.user_stat.deal_count || 0}}</span>
        </Language>
      </SidebarInfoItem>

      <SidebarInfoItem title="30天完成率">
        <span class="c-brand-yellow">{{userOrderCompleteRatio}} </span>
      </SidebarInfoItem>

      <SidebarInfoItem title="平均付款时间">
        <span class="c-brand-yellow">{{utils.formatDuration(userData.user_stat.pay_time)}}</span>
      </SidebarInfoItem>

      <SidebarInfoItem title="平均放行时间">
        <span class="c-brand-yellow">{{utils.formatDuration(userData.user_stat.receipt_time)}}</span>
      </SidebarInfoItem>
    </div>
  </div>
</template>
<style lang="scss">
  .user-stats-profile {
    .user-mini-profile {
      padding: 0 18px 18px 18px;
      border-bottom: solid 1px #eeeeee;
    }
    .sidebar-info-item {
      margin-bottom: 14px;
      color: #6f6f6f;

      .sidebar-info-item-title {
        display: inline-block;
        min-width: 100px;
      }
    }
  }
</style>
<script>
  import Vue from 'vue'
  import UserMiniProfile from '~/components/user-mini-profile'

  const SidebarInfoItem = Vue.extend({
    props: {
      title: String,
    },
    render() {
      return (
        <div class="sidebar-info-item">
          <span class="sidebar-info-item-title">{this.title}:</span>
          {this.$slots['default']}
        </div>
      )
    }
  })

  export default {
    props: {
      userData: {
        type: Object,
        required: true,
      }
    },
    components: {
      UserMiniProfile,
      SidebarInfoItem,
    },
    computed: {
      // 用户单子完成率
      userOrderCompleteRatio: function () {
        const statics = this.userData.user_stat
        return statics.order_count ? (statics.deal_count / statics.order_count * 100).toFixed(1) + '%' : '--'
      },
    }
  }
</script>
