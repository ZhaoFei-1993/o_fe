<style lang="scss">
  .layout-fullwidth {
    min-width: 1200px;
    font-size: 14px;
    background-color: #f2f2f2;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .fullwidth-page-container {
      width: 100%;
      flex: 1;
      min-height: 500px;
    }
  }
</style>
<template>
  <div class="layout-fullwidth">
    <PageHeader type="white"/>
    <!--<transition name="fade" mode="out-in" >-->
    <nuxt class="fullwidth-page-container"></nuxt>
    <!--</transition>-->
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
