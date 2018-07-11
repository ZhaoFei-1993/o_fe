<!--个人中心的布局-->
<style lang="scss">
  .layout-my {
    min-width: 1200px;
    font-size: 14px;
    background-color: #f2f2f2;
    min-height: 100%;
    display: flex;
    flex-direction: column;

    .page-enter-active, .page-leave-active {
      transition: opacity 0.1s;
    }
    .page-enter, .page-leave-active {
      opacity: 0;
    }
  }
</style>
<template>
  <div class="layout-my">
    <PageHeader type="white"/>

    <My2Column>
      <MySidebar slot="left"></MySidebar>
      <nuxt slot="right" class="layout-my-content"></nuxt>
    </My2Column>

    <PageFooter/>
  </div>
</template>

<script>
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'
  import PageHeader from '~/components/Header.vue'
  import PageFooter from '~/components/Footer.vue'

  export default {
    components: {
      PageHeader,
      PageFooter,
      MySidebar,
      My2Column,
    },
  }
</script>
