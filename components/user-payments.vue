<!--用户支付方式组件-->
<style lang="scss">
  .user-payments {
    .iconfont {
      font-size: 18px;
      margin-right: 5px;
    }
  }
</style>

<template>
  <div class="user-payments">
    <template v-for="payment in sortedPayments">
      <i v-if="payment === 'wechat'" class="iconfont icon-wechat-round" :class="`fz-${size}`"></i>
      <i v-if="payment === 'bankcard'" class="iconfont icon-bankcard" :class="`fz-${size}`"></i>
      <i v-if="payment === 'alipay'" class="iconfont icon-alipay" :class="`fz-${size}`"></i>
    </template>
  </div>
</template>

<script>
  const SORT_WEIGHT = {
    bankcard: 0,
    alipay: 1,
    wechat: 2,
  }
  export default {
    name: 'user-payments',
    components: {},
    props: {
      payments: {
        type: Array,        // Array<Strings>
        default: () => []
      },
      size: [Number, String],
    },
    computed: {
      sortedPayments: function () {
        return this.payments.map(p => p.method).sort((a, b) => {
          return SORT_WEIGHT[a] - SORT_WEIGHT[b]
        })
      }
    },
    data() {
      return {}
    }
  }
</script>
