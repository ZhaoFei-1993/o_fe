<!--白色块，用于各种白色底色的地方-->
<style lang="scss">
  .c-block {
    background-color: #fff;
  }
</style>

<template>
  <div class="c-block default-box-shadow" :style="{padding: `${y}px ${x}px`}">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'c-block',
  props: {
    // 横向padding
    x: {
      type: [Number, String],
      default: 30,
    },
    // 纵向padding
    y: {
      type: [Number, String],
      default: 30,
    },
  },
}
</script>
