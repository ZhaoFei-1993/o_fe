<!--悬浮可出现描述文案的问号icon（c for component）-->
<style lang="scss">
  .c-tooltip {
    font-size: 12px;
    color: #9b9b9b;
  }
</style>

<template>
  <i class="c-tooltip iconfont icon-tooltip" v-b-tooltip.hover :title="content" :style="{margin: `${y}px ${x}px`, fontSize: `${size}px`}"></i>
</template>

<script>
  export default {
    name: 'c-tooltip',
    props: {
      content: String,
      size: [Number, String],
      x: {
        type: [Number, String],
        default: 0
      },
      y: {
        type: [Number, String],
        default: 0
      }
    },
  }
</script>
