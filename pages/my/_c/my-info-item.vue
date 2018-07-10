<style lang="scss">
  .my-info-item {

  }
</style>

<template>
  <div class="my-info-item">
    <span>{{title}}</span>
    <slot name="content"></slot>
    <slot name="action"></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
}
</script>
