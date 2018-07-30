<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-header {
    position: sticky;
    z-index: 11;
    top: 0px;
    font-size: 14px;
    &.scrolled {
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    }
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
        height: 60px;
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
      .order-link {
        color: $dark;
        margin-right: 10px;
        height: 60px;
        line-height: 60px;
        display: inline-block;
        &:hover {
          color: $brandGreen;
          text-decoration: none;
        }
        .icon-order-list {
          font-size: 14px;
          margin-right: 8px;
          margin-bottom: -2px;
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
          font-size: 14px;
          justify-content: center;
          background-color: #fff;
          &:not(:last-child) {
            border-bottom: 1px solid #eeeeee;
          }
          &:hover {
            color: $brandGreen;
            background-color: #f8f9fa;
          }
          i {
            display: inline-block;
            width: 24px;
            margin-right: 10px;
            text-align: center;
          }
        }
        a.active {
          background-color: #007bff !important;
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

  #update-name {
    .modal-body {
      padding-bottom: 0;
    }
    .name-form {
      position: relative;
      font-size: 16px;
      .name-input {
        width: 100%;
        height: 36px;
        padding: 6px 150px 6px 0;
        font-size: 16px;
        line-height: 36px;
        border: none;
        border-bottom: 1px solid #dddddd;
        &:focus {
          outline: none;
          border-bottom: 1px solid $brandGreen;
        }
        &::placeholder {
          font-size: 16px;
        }
      }
      .name-tip {
        position: absolute;
        right: 0px;
        top: 6px;
        color: $red;
      }
    }
    .btn-gradient-yellow {
      width: 280px;
      height: 44px;
    }
  }

</style>

<template>
  <div :class="['page-header pr bgc-w',headerClass]">
    <b-navbar class="navbar-main" toggleable="md">
      <b-navbar-brand to="/">
        <img src="~assets/img/logo.png" alt="CoinEx OTC" height="34" width="120">
      </b-navbar-brand>
      <b-navbar-nav class="ml-30">
        <b-nav-item to="/" exact>法币交易</b-nav-item>
        <PublishItemButton>
          <b-nav-item>发布广告</b-nav-item>
        </PublishItemButton>
        <b-nav-item to="/wallet">OTC钱包</b-nav-item>
        <b-nav-item :href="helpLink" target="_blank">帮助</b-nav-item>
        <span style="color: #d5d5d5">|</span>
        <b-nav-item :href="`${coinexDomain}?lang=${lang.lang}`" style="margin-left: 15px;">返回主站</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <div v-if="user.account">
          <b-link class="order-link" to="/orders"><i class="iconfont icon-order-list"></i>订单</b-link>
          <!--TODO 暂时不做-->
          <!--<b-nav-item-dropdown id="user-dropdown" text="订单">-->

          <!--<b-dropdown-item v-for="order in orders">示例订单</b-dropdown-item>-->
          <!--</b-nav-item-dropdown>-->
          <span style="color: #d5d5d5">|</span>
          <button class="message-button" hidden><i class="iconfont icon-message"></i></button>
          <b-nav-item-dropdown id="user-dropdown" :text="simplifyUserName(user.account.name)">
            <!--<b-dropdown-item :href="accountSetting">账户设置</b-dropdown-item>-->
            <b-dropdown-item to="/my/security"><i class="iconfont icon-manage-account"></i> 个人中心</b-dropdown-item>
            <b-dropdown-item to="/wallet"><i class="iconfont icon-wallet"></i> OTC钱包</b-dropdown-item>
            <b-dropdown-item v-if="user.merchant && user.merchant.auth_status === constant.MERCHANT_AUTH_STATUS.PASS"
                             to="/my/items">
              <i class="iconfont icon-apply-merchant"></i>
              广告管理
            </b-dropdown-item>
            <b-dropdown-item v-else to="/my/merchant">
              <i class="iconfont icon-apply-merchant"></i> 商家认证
            </b-dropdown-item>
            <!--<b-dropdown-item><i class="iconfont icon-manage-ticket"></i> 工单系统</b-dropdown-item>-->
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
             title="设置昵称"
             :hide-header-close="true"
             :no-close-on-esc="true"
             :no-close-on-backdrop="true"
             :ok-disabled="invalidName"
             ok-title="确认"
             cancel-variant="outline-green"
             ok-variant="gradient-yellow"
             button-size="sm"
             class="text-center"
             :ok-only="true"
             @ok="handleUpdateName">

      <div v-if="user&&user.account">
        <b-form v-if="form" class="name-form">
          <input class="name-input" v-model="form.userName" @input="inputUserName" type="text" placeholder="您的昵称"
                 required/>
          <span class="name-tip">昵称设置后不可修改</span>
          <EMsgs class="text-left" :result="$v.form.userName" :msgs="invalidMessages.userName"/>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuelidate from 'vuelidate'
  import {mapState} from 'vuex'
  import {required, minLength, maxLength} from 'vuelidate/lib/validators'
  import EMsgs from '~/components/error-message.vue'
  import {loginPage, webDomain, signupPage, coinexDomain} from '~/modules/variables'
  import {onApiError} from '~/modules/error-code'
  import PublishItemButton from '~/components/publish-item-modal/publish-item-button.vue'

  Vue.use(Vuelidate)
  export default {
    head: {
      link: [{rel: 'stylesheet', href: '//at.alicdn.com/t/font_739076_ymkogivtf3.css'}]
    },
    components: {
      PublishItemButton,
      EMsgs,
    },
    data() {
      return {
        form: {
          userName: '',
        },
        coinexDomain,
        minNameLength: 2,
        maxNameLength: 15,
        attentionModelShowing: false,
        attention: [],
        nameDuplicated: false,
        headerClass: null,
        activeAttentionIndex: 0,
        loginPage: `${loginPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
        registerPage: `${signupPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
      }
    },
    validations() {
      return {form: this.validationConf.validations}
    },
    computed: {
      ...mapState(['lang', 'user', 'messages', 'constant', 'chat']),
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
      invalidName() {
        return !this.form.userName || this.form.userName.length < this.minNameLength || this.form.userName.length > this.maxNameLength
      },
      validationConf() {
        return this.utils.processValidationConfig({
          userName: {
            validation: {
              required,
              minLength: minLength(this.minNameLength),
              maxLength: maxLength(this.maxNameLength),
              uniqueName: () => {
                return !this.nameDuplicated
              }
            },
            message: {
              required: '请填写昵称',
              minLength: `昵称最少${this.minNameLength}个字符`,
              maxLength: `昵称最多${this.maxNameLength}个字符`,
              uniqueName: '该昵称已被占用',
            },
          },
        })
      },
      invalidMessages() {
        return this.validationConf.invalidMessages
      },
    },
    mounted() {
      // component 里面不能调用fetch和asyncData
      this.$store.dispatch('fetchUserMerchant')
      this.$store.dispatch('fetchUserAccount').then(_ => {
        if (this.user && this.user.account) {
          if (!this.user.account.is_name_confirmed) {
            this.$refs.updateNameModal.show()
          }
          if (!this.chat.imClient) {
            const clientId = `${this.user.account.id}`
            this.$store.dispatch('chat/newChatClient', clientId).catch(err => {
              onApiError(err, this)
            })
          }
        }
      }).catch(err => {
        if (err.code === this.constant.ERROR_CODE.UNAUTHORIZED) return
        this.axios.onError(err)
      })
      window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
      handleUpdateName(evt) {
        this.$v.form.$touch()
        if (this.$v.form.$invalid) {
          return this.$showTips('请检查表单并正确输入内容', 'error')
        }
        // 要验证重名，避免被关闭，需要ref来调用
        evt.preventDefault()
        this.axios.user.updateName(this.form.userName).then(_ => {
          this.$refs.updateNameModal.hide()
          this.$store.dispatch('fetchUserAccount')
        }).catch(err => {
          if (err.code === this.constant.ERROR_CODE.NAME_USED) {
            this.nameDuplicated = true
          } else {
            onApiError(err, this)
          }
        })
      },
      inputUserName() {
        this.$v.form.userName.$touch()
        this.nameDuplicated = false
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
        this.$store.dispatch('signOut')
      },
      onScroll(e) {
        if (!e.target === document) return
        if (window.scrollY > 0 && !this.headerClass) {
          this.headerClass = 'scrolled'
          return
        }
        if (window.scrollY <= 0 && this.headerClass) {
          this.headerClass = null
        }
      },
    }
  }
</script>
