<!--包含用户头像、在线状态、名字、支付方式的组件-->
<style lang="scss">
  @import "~assets/scss/variables.scss";
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
      display: inline-block;
    }
    .icon-netphone {
      cursor: pointer;
      margin-left: 5px;
      color: #9b9b9b;
      &.available {
        color: $brandGreen;
      }
    }
  }
</style>

<template>
  <div class="user-mini-profile">
    <UserAvatar :username="username" :color="color" :online="online" :size="avatarSize"/>

    <div class="profile-right">
      <div class="d-flex align-items-center">
        <span class="username" v-b-tooltip.hover :title="phoneStatus?null:username">
          <!--订单详情页有phoneStatus，这里显示区域比较大，不会隐藏号码所以不要tooltip-->
          {{username}}
        </span>
        <i v-if="phoneStatus&&phoneStatus.show"
           :class="['iconfont icon-netphone',{available:phoneStatus.network_phone}]"
           v-b-tooltip.hover :title="phoneAvailable?null:phoneStatus.tooltip"
           @click="clickNetPhone"
        ></i>
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
      color: {
        type: String,
        default: '#c5f0f0',
      },
      phoneStatus: {
        type: Object,
        required: false,
      },
    },
    data() {
      return {}
    },
    computed: {
      phoneAvailable() {
        return this.phoneStatus.network_phone && this.phoneStatus.network_phone.length
      }
    },
    methods: {
      clickNetPhone() {
        if (this.phoneAvailable) {
          this.$showDialog({
            title: '联系对方',
            content: (<div>
              <p class="c-dark fz-20">{this.phoneStatus.network_phone}</p>
              <p class="c-gray">平台会对双方号码做隐私保护，请务必使用{this.phoneStatus.self_phone}拨打，否则将无法接通</p>
            </div>),
            okTitle: '我知道了',
            okOnly: true,
          })
        }
      }
    }
  }
</script>
<style lang="scss">
</style>
