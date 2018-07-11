<style lang="scss">
  .page-merchant {

  }
</style>

<template>
  <CBlock class="page-merchant">
    <h3>商家认证</h3>
    <p>成为认证商家，尊享更多时权益</p>
    <div></div>

    <h4>1. 完善信息</h4>
    <h4>2. 提交认证视频</h4>
    <h4>3. 缴纳保证金</h4>
    <h4>4. 资料审核</h4>

  </CBlock>
</template>

<script>
  import MySidebar from '../../components/my-sidebar.vue'
  import My2Column from '../../components/my-2column.vue'

  export default {
    name: 'page-merchant',
    components: {
      MySidebar,
      My2Column,
    },
    layout: 'my',
    data() {
      return {
      }
    }
  }
</script>
