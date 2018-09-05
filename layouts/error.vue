<template>
  <div class="f_bd">
    <img v-if="error.statusCode === 404" class="errorImg" src="~assets/img/404.png" alt="">
    <p class="errorMsg" v-if="error.statusCode === 404">{{$t("global.error.404")}}</p>
    <img v-if="error.statusCode !== 404" class="errorImg" src="~assets/img/500.png" alt="">
    <p class="errorMsg" v-if="error.statusCode !== 404">{{$t("global.error.500")}}</p>
  </div>
</template>

<style scoped lang="scss">
  .f_bd{padding-top: 155px;}
  .errorImg{width: 280px;height: 125px;display: block;margin: 0 auto;}
  .errorMsg{text-align: center;color: #999;font-size: 24px;margin-top: 35px;}
  .options{margin-top: 65px;text-align: center;}
</style>

<script>
import cookies from '~/plugins/cookies'

// todo: 做一下错误页
export default {
  props: ['error'],
  created() {
    // 上报错误日志
    if (!this.$isServer) {
      ga('send', 'pageview')
    }
    if (this.error.statusCode === 401 || this.error.statusCode === 403) {
      // 跳转到登录页
      if (this.$router.currentRoute.path === '/account/signin') {
        location.href = '/account/signin'
      } else {
        if (!this.$isServer && cookies.hasItem(document, 'token')) {
        }
        this.$router.push('/account/signin')
      }
    }
  },
}
</script>
