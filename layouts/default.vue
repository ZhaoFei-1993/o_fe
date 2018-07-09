<style lang="scss">
  .layout-default {
    min-width: 1200px;
    font-size: 14px;
    background-color: #f2f2f2;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .layout-content {
      width: 1200px;
      // 设置内容的最小高度，防止 页面切换时由于内容的暂空，导致底部footer上升，进而导致页面闪烁
      flex: 1;
      margin: 40px auto;
      position: relative;
      /*opacity: 1;*/
      // 如果想启用过渡效果，直接开启这个就行了
    }

    .page-enter-active, .page-leave-active {
      transition: opacity 0.1s;
    }
    .page-enter, .page-leave-active {
      opacity: 0;
    }
  }
</style>
<template>
  <div class="layout-default">
    <PageHeader type="white"/>

    <div class="layout-content">
      <nuxt/>
    </div>

    <PageFooter/>
  </div>
</template>

<script>
  import PageHeader from '~/components/Header.vue'
  import PageFooter from '~/components/Footer.vue'

  export default {
    components: {
      PageHeader,
      PageFooter,
    },
  }
</script>
