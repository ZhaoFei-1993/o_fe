<!--个人中心 侧边栏-->
<style lang="scss">
  .my-sidebar {
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


  }
</style>
<template>
  <div class="my-sidebar" v-if="user.account">
    <CBlock class="my-sidebar-info" :x="0" :y="20">
      <UserStatsProfile :user-data="user.account"/>
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
  import {mapState} from 'vuex'
  import UserStatsProfile from '~/components/user-stats-profile.vue'

  export default {
    components: {
      UserStatsProfile,
    },
    data() {
      return {}
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {},
  }
</script>


