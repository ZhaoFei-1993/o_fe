<template>
  <div class="layout-homepage">
    <PageHeader/>
    <nuxt class="layout-content"/>
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
  }
}
</script>
