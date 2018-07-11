<template>
  <div class="page-order-detail">
    <div class="main-content"></div>
    <div class="sidebar">
      <CBlock class="my-sidebar-info" :x="0" :y="20">
        <UserStatsProfile :user-data="merchant" v-if="merchant"/>
      </CBlock>
    </div>
  </div>
</template>
<style lang="scss">
  .page-order-detail {
    padding: 40px 0 118px 0px;
    width: 1200px;
    margin: 0 auto;
    min-height: 900px;
    display: flex;
    .main-content {
      flex: 1;
      margin: -10px; //解决内容边界有阴影被隐藏的问题
      padding: 10px;
      overflow: hidden;
    }
    .sidebar {
      width: 400px;
      margin-left: 20px;
    }
  }
</style>
<script>
  import UserStatsProfile from '~/components/user-stats-profile.vue'

  export default {
    data() {
      return {
        merchant: null,
      }
    },
    components: {
      UserStatsProfile,
    }
  }
</script>
