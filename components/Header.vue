<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-header {
    position: sticky;
    z-index: 11;
    top: -60px;

    .navbar-nav {
      display: inline-block;
    }

    .nav-item {
      display: inline-block;
      margin: 0 15px;
    }

    .navbar-main {
      /*z-index: 1020;*/
      max-width: 1200px;
      height: 60px;
      margin: 0 auto;
      font-size: 16px;

      .nav-link {
        height: 50px;
        line-height: 50px;
        padding-top: 0;

        &:hover {
          color: $brandGreen;
        }

        &.active {
          color: $brandGreen;
        }
      }

      .icon-user {
        margin-right: 10px;
        font-size: 20px;
        vertical-align: middle;
      }

      #user-dropdown > a {
        span {
          padding-left: 30px;
          position: relative;

          &:before {
            content: '';
            /*background-image: url('~assets/img/icons/user.svg');*/
            width: 24px;
            height: 24px;
            position: absolute;
            left: 0px;
            top: 0px;
            background-size: contain;
          }
        }
      }
      .name-span {
        max-width: 200px;
        display: inline-block;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }

    .navbar-sub {
      height: 40px;
      background-color: #27313e;
      box-shadow: 0 2px 4px 0 rgba(94, 94, 94, 0.15);

      .navbar-nav {
        width: 1200px;
        margin: 0 auto;
        padding-left: 185px;
      }

      .nav-link {
        color: #ffffff;

        &:hover {
          color: #feb132;
        }

        &:focus {
          color: #ffffff;
        }

        &.active {
          color: #feb132;
        }
      }
    }
  }
</style>

<template>
  <div class="page-header pr bgc-w">
    <b-navbar class="navbar-main" toggleable="md">
      <b-navbar-brand to="/">
        <!--<img :src="require('~/assets/img/viabtc-logo.svg')" alt="CoinEx OTC" height="34" width="120">-->
      </b-navbar-brand>
      <b-navbar-nav class="ml-30">
        <b-nav-item :href="'//pool.viabtc.com?lang='+lang.lang">矿池</b-nav-item>
        <b-nav-item to="/">矿机</b-nav-item>
        <b-nav-item :href="'//pool.viabtc.com/wallet/home/?lang='+lang.lang">钱包</b-nav-item>
        <b-nav-item :href="helpLink" target="_blank">帮助</b-nav-item>
        <span style="color: #d5d5d5">|</span>
        <b-nav-item :href="'//www.viabtc.com?lang='+lang.lang">区块</b-nav-item>
        <b-nav-item :href="'//www.coinex.com?lang='+lang.lang">交易</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <div v-if="user.data">
          <b-nav-item-dropdown id="user-dropdown" :text="'Hi, '+simplifyUserName(user.data.username)">
            <!--<b-dropdown-item :href="accountSetting">账户设置</b-dropdown-item>-->
            <b-dropdown-item hidden>我的工单</b-dropdown-item>
            <b-dropdown-item hidden>消息中心</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="signOut">退出登录</b-dropdown-item>
          </b-nav-item-dropdown>

        </div>
        <div v-else>
          <b-btn size="xs" variant="outline-green" :href="loginPage">登录</b-btn>
          <b-btn size="xs" class="ml-20" variant="outline-yellow" :href="registerPage">注册</b-btn>
        </div>
      </b-navbar-nav>
    </b-navbar>
    <b-navbar class="navbar-sub">
      <b-navbar-nav>
        <b-nav-item to="/" :exact="true">浏览广告</b-nav-item>
        <b-nav-item to="/items/create" :exact="true">发布广告</b-nav-item>
        <b-nav-item to="/orders" :exact="true">我的订单</b-nav-item>
        <b-nav-item to="/items/mine" :exact="true">我的广告</b-nav-item>
        <b-nav-item to="/kyc/info" :exact="true">卖家认证</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-modal v-if="attention[activeAttentionIndex]"
             id="alert"
             v-model="attentionModelShowing"
             ref="attentionModal"
             :title="attention[activeAttentionIndex].title"
             centered
             :no-close-on-backdrop="true"
             :hide-footer="true"
             :hide-header-close="true">
      <form class="vercodeBox" @submit.prevent="shutdown">
        <p>{{attention[activeAttentionIndex].content}}</p>
        <div class="btn-container d-flex">
          <b-btn class="btc-lg" type="submit" variant="gradient-yellow">知道了</b-btn>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {loginPage, webDomain, signupPage} from '~/modules/variables'
  import {onApiError} from '~/modules/error-code'
  // import cookies from '~/plugins/cookies'

  export default {
    head: {
      link: [{rel: 'stylesheet', href: '//at.alicdn.com/t/font_613200_z9fptmpd8daq0k9.css'}],
    },
    components: {},

    data() {
      return {
        attentionModelShowing: null,
        attention: [],
        activeAttentionIndex: 0,
        loginPage: `${loginPage}?next=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
        registerPage: signupPage,
      }
    },

    computed: {
      ...mapState(['lang', 'user', 'messages']),
      helpLink() {
        switch (this.lang.lang) {
          case 'zh_Hans_CN':
            return 'https://support.viabtc.com/hc/zh-cn/categories/360000471452'
          case 'zh_Hant_HK':
            return 'https://support.viabtc.com/hc/zh-tw/categories/360000471452'
          case 'en_US':
          default:
            return 'https://support.viabtc.com/hc/en-us/categories/360000471452'
        }
      },
    },

    watch: {},
    beforeMount() {
      // this.$store.dispatch('initUserData')
    },

    methods: {
      simplifyUserName(str = '') {
        if (isNaN(str)) {
          if (str.length > 10) {
            let rStr = str.substr(0, 5) + '***'
            rStr += str.substring(str.length - 5, str.length)
            return rStr
          }
          return str
        } else {
          if (str.length <= 11) {
            return str
          } else {
            let rStr = str.substr(0, 5) + '***'
            rStr += str.substring(str.length - 5, str.length)
            return rStr
          }
        }
      },
      shutdown() {
      },
      signOut() {
        this.axios.user.signOut().then(res => {
          window.location.href = '/'
        }).catch(err => {
          onApiError(err, this)
        })
      },
    },
  }
</script>
