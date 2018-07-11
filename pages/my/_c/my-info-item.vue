<style lang="scss">
  .my-info-item {
    display: flex;
    margin-bottom: 50px;

    .info-title {
      margin-right: 30px;
    }
  }
</style>

<template>
  <div class="my-info-item">
    <span class="info-title">{{title}}</span>
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
