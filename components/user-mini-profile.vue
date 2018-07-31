<!--包含用户头像、在线状态、名字、支付方式的组件-->
<style lang="scss">
  .user-mini-profile {
    display: flex;

    .user-avatar {
      flex-shrink: 0;
    }

    .profile-right {
      margin-left: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .username {
      max-width: 130px;
      font-size: 18px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

<template>
  <div class="user-mini-profile">
    <UserAvatar :username="username" color="#c5f0f0" :online="online" :size="avatarSize"/>

    <div class="profile-right">
      <div class="username" v-b-tooltip.hover :title="username">
        {{username}}
      </div>
      <div v-if="isMerchant" class="lh-1">
        <i class="iconfont icon-certificated-merchant" v-b-tooltip.hover title="认证商家"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import UserAvatar from './user-avatar.vue'

  export default {
    name: 'user-mini-profile',
    components: {
      UserAvatar,
    },
    props: {
      username: String,
      payments: Array,
      isMerchant: Boolean,
      online: Boolean,
      avatarSize: Number,
    },
    data() {
      return {}
    }
  }
</script>
<style lang="scss">
  .icon-certificated-merchant {
    color: #7dd322;
  }
</style>
