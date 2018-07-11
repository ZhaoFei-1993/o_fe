<style lang="scss">
  .my-sidebar {
    .user-mini-profile {
      padding: 0 18px 18px 18px;
      border-bottom: solid 1px #eeeeee;
    }

    .my-sidebar-menu {
      margin-top: 10px;
    }

    .my-sidebar-menu {
      font-size: 16px;

      // 覆盖bootstrap默认样式
      .list-group-item {
        display: flex;
        align-items: center;
        border-color: #fff;
        border-left: 4px solid transparent;
        border-top-color: #eee;
        border-bottom-color: #eee;
        color: #6f6f6f;

        .iconfont {
          font-size: 24px;
          width: 50px;
        }

        .icon-item-setting {
          font-size: 20px;
        }

        &.active {
          border-color: #fff;
          border-top-color: #eee;
          border-bottom-color: #eee;
          border-left: 4px solid #00c1ce;
          background-color: #fff;
          color: #162331;

          .iconfont {
            color: #00c1ce;
          }
        }
      }
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
<template>
  <div class="my-sidebar" v-if="user.data">
    <CBlock class="my-sidebar-info" :x="0" :y="20">
      <UserMiniProfile class="user-mini-profile" :username="user.data.username" :online="true"/>
      <div class="pt-20 px-20">
        <SidebarInfoItem title="30天成交量">
          <Language text="[t][/t]单">
            <span slot="t" class="c-brand-yellow">{{user.data.recent_deal_count || 0}} </span>
          </Language>
        </SidebarInfoItem>

        <SidebarInfoItem title="30天完成率">
          <span class="c-brand-yellow">{{userOrderCompleteRatio}} </span>
        </SidebarInfoItem>

        <SidebarInfoItem title="平均付款时间">
          <Language text="[t][/t]分钟">
            <span slot="t" class="c-brand-yellow">{{user.data.average_pay_time}} </span> <!--空格勿删-->
          </Language>
        </SidebarInfoItem>

        <SidebarInfoItem title="平均放行时间">
          <Language text="[t][/t]分钟">
           <span slot="t" class="c-brand-yellow">{{user.data.average_release_time}} </span>
          </Language>
        </SidebarInfoItem>
      </div>
    </CBlock>

    <b-list-group class="my-sidebar-menu">
      <b-list-group-item to="/my/security">
        <i class="iconfont icon-security"></i>
        <span class="title">账户安全</span>
      </b-list-group-item>
      <b-list-group-item to="/my/payments">
        <i class="iconfont icon-payments"></i>
        <span class="title">支付方式</span>
      </b-list-group-item>
      <b-list-group-item to="/my/merchant">
        <i class="iconfont icon-merchant"></i>
        <span class="title">商家认证</span>
      </b-list-group-item>
      <b-list-group-item to="/my/item-setting">
        <i class="iconfont icon-item-setting"></i>
        <span class="title">广告设置</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  import UserMiniProfile from '~/components/user-mini-profile.vue'

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
    components: {
      UserMiniProfile,
      SidebarInfoItem,
    },
    data() {
      return {
      }
    },
    computed: {
      // 用户单子完成率
      userOrderCompleteRatio: function () {
        const userData = this.user.data
        // todo: 这里根据后台返回数据，来显示  0% 和 -
        return userData.recent_deal_count ? (userData.recent_deal_count / userData.recent_order_count * 100).toFixed(1) + '%' : '-'
      },
      ...mapState(['user'])
    },
    beforeMount() {
      this.$store.dispatch('setUserData')
    },
    methods: {},
  }
</script>


