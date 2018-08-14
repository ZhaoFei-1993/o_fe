<style lang="scss">
  .page-user {

  }
</style>

<template>
  <div class="page-content-container">
    <div class="page-user">
      <CBlock class="user_info" :y="0">
        <div>

        </div>
        <div>

        </div>
      </CBlock>
      <CBlock class="user_ad">

      </CBlock>
      <CBlock class="user_trades_with_me">

      </CBlock>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page-user',
    components: {},
    data() {
      return {
        user: {}
      }
    },
    mounted() {
      this.axios.user.otherUserInfo(this.$route.params.id).then(res => {
        this.user = res.data
      })
    }
  }
</script>
