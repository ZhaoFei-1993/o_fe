<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-header {
    position: sticky;
    z-index: 11;
    top: 0px;
    font-size: 14px;
    .navbar-nav {
      display: inline-block;
    }

    .nav-item {
      display: inline-block;
      margin: 0 15px 0 0;
    }

    .navbar-main {
      /*z-index: 1020;*/
      max-width: 1200px;
      height: 60px;
      margin: 0 auto;
      font-size: 14px;

      .nav-link {
        height: 50px;
        line-height: 60px;
        padding-top: 0;
        color: #27313e;
        &:hover {
          color: $brandGreen;
        }

        &.active {
          color: $brandGreen;
        }
      }
      .message-button {
        border: none;
        background: transparent;
      }
      .icon-user {
        margin-right: 10px;
        font-size: 20px;
        vertical-align: middle;
      }

      #user-dropdown {
        .dropdown-menu {
          padding: 0;
        }
        a.dropdown-item {
          padding: 12px 20px 12px 0;
          display: flex;
          justify-content: center;
          &:not(:last-child) {
            border-bottom: 1px solid #eeeeee;
          }
          &:hover {
            color: $brandGreen;
          }
          i {
            display: inline-block;
            width: 24px;
            margin-right: 10px;
            text-align: center;
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
        <img src="~assets/img/logo.png" alt="CoinEx OTC" height="34" width="120">
      </b-navbar-brand>
      <b-navbar-nav class="ml-30">
        <b-nav-item to="/" exact>法币交易</b-nav-item>
        <b-nav-item to="/items/create">发布广告</b-nav-item>
        <b-nav-item to="/wallet">OTC钱包</b-nav-item>
        <b-nav-item :href="helpLink" target="_blank">帮助</b-nav-item>
        <span style="color: #d5d5d5">|</span>
        <b-nav-item :href="'//www.coinex.com?lang='+lang.lang">返回主站</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <div v-if="user.account">
          <b-link class="mr-10 c-black" to="/orders">订单</b-link>
          <!--TODO 暂时不做-->
          <!--<b-nav-item-dropdown id="user-dropdown" text="订单">-->

          <!--<b-dropdown-item v-for="order in orders">示例订单</b-dropdown-item>-->
          <!--</b-nav-item-dropdown>-->
          <span style="color: #d5d5d5">|</span>
          <button class="message-button" hidden><i class="iconfont icon-message"></i></button>
          <b-nav-item-dropdown id="user-dropdown" :text="'Hi, '+simplifyUserName(user.account.name)">
            <!--<b-dropdown-item :href="accountSetting">账户设置</b-dropdown-item>-->
            <b-dropdown-item to="/wallet"><i class="iconfont icon-manage-account"></i> OTC账户</b-dropdown-item>
            <b-dropdown-item to="/items"><i class="iconfont icon-manage-item"></i> 广告管理</b-dropdown-item>
            <b-dropdown-item to="/my/merchant"><i class="iconfont icon-apply-merchant"></i> 商家申请</b-dropdown-item>
            <b-dropdown-item><i class="iconfont icon-manage-ticket"></i> 工单系统</b-dropdown-item>
            <b-dropdown-item @click="signOut"><i class="iconfont icon-logout"></i>退出登录</b-dropdown-item>
          </b-nav-item-dropdown>

        </div>
        <div v-else>
          <b-btn size="xs" variant="outline-green" :href="loginPage">登录</b-btn>
          <b-btn size="xs" class="ml-20" variant="outline-yellow" :href="registerPage">注册</b-btn>
        </div>
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

    <b-modal id="update-name"
             ref="updateNameModal"
             title="确认昵称"
             :hide-header-close="true"
             :no-close-on-esc="true"
             :no-close-on-backdrop="true"
             ok-variant="yellow"
             :ok-only="true"
             @ok="handleUpdateName">
      <div v-if="user&&user.account">
        <p>请确认或修改您的昵称，昵称一旦确定将无法修改。</p>
        <p class="c-red" v-if="nameDuplicated">请确认或修改您的昵称，昵称一旦确定将无法修改。</p>
        <b-form-input v-model="user.account.name" type="text" placeholder="您的昵称" required></b-form-input>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {loginPage, webDomain, signupPage} from '~/modules/variables'
  import {onApiError} from '~/modules/error-code'

  export default {
    head: {
      link: [{rel: 'stylesheet', href: '//at.alicdn.com/t/font_739076_8a5nu4m6gas.css'}]
    },
    components: {},

    data() {
      return {
        attentionModelShowing: null,
        attention: [],
        nameDuplicated: false,
        activeAttentionIndex: 0,
        loginPage: `${loginPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
        registerPage: `${signupPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
      }
    },

    computed: {
      ...mapState(['lang', 'user', 'messages']),
      helpLink() {
        let lang = 'en-us'
        switch (this.lang.lang) {
          case 'zh_Hans_CN':
            lang = 'zh-cn'
            break
          case 'zh_Hant_HK':
            lang = 'zh-tw'
            break
          case 'en_US':
          default:
            break
        }
        return 'https://support.coinex.com/hc/' + lang
      },
    },
    mounted() {
      // component 里面不能调用fetch和asyncData
      this.$store.dispatch('fetchUserAccount').then(_ => {
        if (this.user && this.user.account && !this.user.account.is_name_confirmed) {
          this.$refs.updateNameModal.show()
        }
      })
    },
    methods: {
      handleUpdateName(evt) {
        // 要验证重名，避免被关闭，需要ref来调用
        evt.preventDefault()
        this.axios.user.updateName(this.user.account.name).then(_ => {
          this.$refs.updateNameModal.hide()
        }).catch(err => {
          if (err.code === 72) {
            this.nameDuplicated = true
          } else {
            onApiError(err, this)
          }
        })
      },
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
          this.$router.push('/')
        }).catch(err => {
          onApiError(err, this)
        })
      }
    }
  }
</script>
