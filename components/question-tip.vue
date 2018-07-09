<style lang="scss">
  .question-tip {
    font-size: 12px;
    color: #6f6f6f;
  }
</style>

<template>
  <i class="question-tip iconfont icon-question-tip" v-b-tooltip.hover :title="content"></i>
</template>

<script>
  export default {
    name: 'question-tip',
    props: {
      content: String,
    },
  }
</script>
