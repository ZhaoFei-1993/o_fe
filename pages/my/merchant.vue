<style lang="scss">
  .page-merchant {

  }
</style>

<template>
  <My2Column class="page-merchant">
    <MySidebar slot="left"></MySidebar>
    <CBlock slot="right">
      <h3>商家认证</h3>
      <p>成为认证商家，尊享更多时权益</p>
      <div></div>

      <h4>1. 完善信息</h4>
      <h4>2. 提交认证视频</h4>
      <h4>3. 缴纳保证金</h4>
      <h4>4. 资料审核</h4>

    </CBlock>
  </My2Column>
</template>

<script>
  import Vue from 'vue'
  import MySidebar from './_c/my-sidebar.vue'
  import My2Column from './_c/my-2column.vue'
  import MyInfoItem from './_c/my-info-item.vue'

  export default {
    name: 'page-merchant',
    components: {
      MySidebar,
      My2Column,
      MyInfoItem,
    },
    data() {
      return {
      }
    }
  }
</script>
