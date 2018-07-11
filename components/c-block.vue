<!--白色块，用于各种白色底色的地方-->
<style lang="scss">
  .c-block {
    background-color: #fff;
    box-shadow: 0 0 20px 0 #ececec;
  }
</style>

<template>
  <div class="c-block" :style="{padding: `${x}px ${y}px`}">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'c-block',
  props: {
    x: {
      type: Number,
      default: 30,
    },
    y: {
      type: Number,
      default: 30,
    },
  },
}
</script>
