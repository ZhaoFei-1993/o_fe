<!--白色块，用于各种白色底色的地方-->
<style lang="scss">
  .c-block {
    background-color: #fff;
  }
</style>

<template>
  <div class="c-block default-box-shadow" :style="{padding: `${x}px ${y}px`}">
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
