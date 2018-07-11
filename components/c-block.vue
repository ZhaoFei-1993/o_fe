<!--白色块，用于各种白色底色的地方-->
<style lang="scss">
  .c-block {
    background-color: #fff;
  }
</style>

<template>
  <div class="c-block" :style="{padding: `${y}px ${x}px`}">
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
