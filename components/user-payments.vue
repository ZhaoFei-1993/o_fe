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
  <!--todo:固定顺序，根据后台的返回值再确定这里怎么写-->
  <div class="user-payments">
    <template v-for="payment in payments">
      <i v-if="payment === 'wechat'" class="iconfont icon-wechat-round"></i>
      <i v-if="payment === 'bank'" class="iconfont icon-bank"></i>
      <i v-if="payment === 'alipay'" class="iconfont icon-alipay"></i>
    </template>
  </div>
</template>

<script>
export default {
  name: 'user-payments',
  components: {
  },
  props: {
    payments: Array,      // payments类型未定 todo
  },
  data() {
    return {
    }
  }
}
</script>
