<style lang="scss">
  .layout-default {
    min-width: 1200px;
    font-size: 14px;
    background-color: #f9f9f9;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .layout-content {
      width: 100%;
      flex: 1;
      min-height: 500px;
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
