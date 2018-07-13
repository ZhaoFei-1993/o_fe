<style lang="scss">
  .my-info-item {
    display: flex;
    padding: 27px 30px;
    border-top: 1px solid #eee;

    .info-title {
      margin-right: 30px;
      font-size: 18px;
      flex: 0 0 200px;
    }

    .info-content {
      flex: 5 1 0;
      color: #6f6f6f;
    }

    .info-action {
      flex: 0 0 220px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>

<template>
  <div class="my-info-item">
    <div class="info-title">
      {{title}}
      <slot name="title"/>
    </div>
    <div class="info-content">
      <slot name="content"/>
    </div>
    <div class="info-action">
      <slot name="action"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
  // slots: {
  //   title // 与props里面同名的slot，作用和props.title相同，只是更具扩展性
  // }
}
</script>
