<style lang="scss">
  .layout-my {
    min-width: 1200px;
    font-size: 14px;
    background-color: #f2f2f2;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .layout-my-title {
      padding: 30px 30px 0 30px;
      font-size: 20px;
      color: #192330;
    }

    .layout-my-desc {
      margin-bottom: 33px;
      padding: 12px 30px;
      font-size: 14px;
      color: #6f6f6f;
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
  <div class="layout-my">
    <My2Column>
      <MySidebar slot="left"/>
      <nuxt-child slot="right" class="layout-my-content"></nuxt-child>
    </My2Column>
  </div>
</template>

<script>
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'

  export default {
    components: {
      MySidebar,
      My2Column,
    },
  }
</script>
