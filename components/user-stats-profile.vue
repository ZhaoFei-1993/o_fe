<template>
  <div class="user-stats-profile">
    <UserMiniProfile class="user-mini-profile" :username="userData.name" :is-merchant="isMerchant" :online="online"/>
    <div class="pt-20 px-30">
      <SidebarInfoItem title="30天成交量">
        <Language text="[t][/t]">
          <span slot="t" class="c-brand-yellow">{{statics.deal_count || 0}}</span>
        </Language>
      </SidebarInfoItem>

      <SidebarInfoItem title="30天完成率">
        <span class="c-brand-yellow">{{userOrderCompleteRatio}} </span>
      </SidebarInfoItem>

      <SidebarInfoItem title="平均付款时间">
        <span class="c-brand-yellow">{{utils.formatDuration(statics.pay_time)}}</span>
      </SidebarInfoItem>

      <SidebarInfoItem title="平均放行时间">
        <span class="c-brand-yellow">{{utils.formatDuration(statics.receipt_time)}}</span>
      </SidebarInfoItem>
    </div>
  </div>
</template>
<style lang="scss">
  .user-stats-profile {
    .user-mini-profile {
      padding: 0 30px 20px 30px;
      border-bottom: solid 1px #eeeeee;
    }
    .sidebar-info-item {
      margin-bottom: 12px;
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
    data() {
      return {
        online: false,
      }
    },
    props: {
      userData: {
        type: Object,
        required: true,
      },
      isMerchant: Boolean,
    },
    components: {
      UserMiniProfile,
      SidebarInfoItem,
    },
    mounted() {
      if (this.userData.id) {
        this.axios.chat.online({
          user_ids: `${this.userData.id}`,
        }).then(res => {
          if (res.code === 0 && res.data) {
            this.online = res.data[this.userData.id]
          }
        })
      }
    },
    computed: {
      statics() {
        return this.userData.user_stat || this.userData// 从order里面读取的用户信息没有user_stat层级
      },
      // 用户单子完成率
      userOrderCompleteRatio: function () {
        return this.statics.order_count ? (this.statics.deal_count / this.statics.order_count * 100).toFixed(1) + '%' : '--'
      },
    }
  }
</script>
