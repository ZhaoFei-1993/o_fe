<style lang="scss">
  .layout-fullwidth {
    min-width: 1200px;
    font-size: 14px;
    background-color: #f9f9f9;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .fullwidth-page-container {

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
