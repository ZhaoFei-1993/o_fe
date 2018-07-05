<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-index {

  }
</style>

<template>
  <div class="page-index">
    <CBlock>
      {{message}}
    </CBlock>
  </div>
</template>

<script>
  export default {
    components: {

    },
    data() {
      return {
        message: 'Hello OTC'
      }
    }
  }
</script>
