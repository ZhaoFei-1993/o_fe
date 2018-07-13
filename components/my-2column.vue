<!--个人中心，两栏结构-->
<style lang="scss">
  .my-2column {
    padding: 40px 0 118px 0px;
    width: 1200px;
    margin: 0 auto;
    min-height: 900px;
    display: flex;

    .my-2column-left {
      width: 240px;
      margin-right: 20px;
    }

    .my-2column-right {
      flex: 1;
      margin: -10px; //解决内容边界有阴影被隐藏的问题
      padding: 10px;
      overflow: hidden;
    }
  }
</style>

<template>
  <div class="my-2column">
    <div class="my-2column-left">
      <slot name="left"></slot>
    </div>
    <div class="my-2column-right">
      <slot name="right"></slot>
    </div>
    <slot></slot>
  </div>
</template>
