<style lang="scss">
  .qrcode-popover {
    display: inline-block;

    .icon-qrcode {
      cursor: pointer;
    }
  }

  // 由于popover会把本身放到body下面，因此这个class不能放到.qrcode-popover里面，不然会不生效
  .qrcode-popover-image {
    display: block;
    max-width: 360px;
    max-height: 360px;
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="qrcode-popover">
    <span :id="`qr-${targetId}`">
      <i class="iconfont icon-qrcode"></i>
    </span>
    <b-popover :target="`qr-${targetId}`" placement="top" triggers="hover">
      <img class="qrcode-popover-image" :src="src">
    </b-popover>
  </div>
</template>

<script>
export default {
  name: 'qrcode-popover',
  components: {
  },
  props: {
    src: String,
    targetId: {
      type: [Number, String],
      default: Date.now(),
    },
  },
}
</script>
