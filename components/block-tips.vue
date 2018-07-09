<!--一整块级别的提示-->
<style lang="scss">
  .block-tips {
    .iconfont {
      font-size: 60px;
    }
  }
</style>

<template>
  <div class="block-tips text-center">
    <div class="mt-60">
      <slot name="icon"/>
    </div>
    <h4 class="mt-25 fz-20" v-if="title">{{title}}</h4>
    <p class="fz-14" :class="title ? 'mt-10' : 'mt-15'" v-if="text">{{text}}</p>
    <div class="mt-40 mb-100">
      <slot name="extra"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'block-tips',
    props: {
      title: String,      // 大字号标题
      text: String,        // 小字号说明文字
    },
    // slot: ['icon', 'extra']
  }
</script>
