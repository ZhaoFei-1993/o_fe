<style lang="scss">
  @import "~assets/scss/variables.scss";
  // 活动页header
  .page-header.page-act-header {
    position: relative;
    background-color: transparent;
    .navbar-main {
      .nav-link {
        color: #fff;
      }
      .order-link {
        color: #fff;
      }
    }
  }
  .page-header {
    position: sticky;
    width: 100%;
    z-index: 11;
    top: 0px;
    font-size: 14px;
    &.scrolled {
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    }
    .navbar-nav {
      display: inline-block;
      a.btn.btn-xs {
        width: 100px;
      }
    }

    .nav-item {
      display: inline-block;
      margin: 0;
    }

    .navbar-main {
      /*z-index: 1020;*/
      max-width: 1200px;
      height: 60px;
      margin: 0 auto;
      font-size: 14px;
      padding: 0;
      .nav-link {
        height: 60px;
        line-height: 60px;
        padding-top: 0;
        color: #27313e;
        padding: 0 20px !important;
        &:hover {
          color: $brandGreen;
        }

        &.active {
          color: $brandGreen;
        }
      }
      .order-list-wrapper {
        z-index: 1001;
        position: absolute;
        top: 60px;
        left: -120px;
        width: 320px;
        height: 340px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 20px 0 #dddddd;
        .order-list-header {
          flex-grow: 0;
          flex-shrink: 0;
          background-color: #fff;
          border-bottom: solid 1px #eeeeee;
          .order-list-header-text {
            padding: 0 21px;
            height: 38px;
            font-size: 14px;
            color: #27313e;
            line-height: 38px;
          }
        }
        .order-list-body {
          flex-grow: 1;
          flex-shrink: 1;
          background-color: #fff;
          overflow-y: auto;
          .order-list-item {
            padding: 10px 0 10px 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            border-bottom: solid 1px #eeeeee;
            .order-list-item-detail {
              margin-left: 10px;
            }
          }
        }
        .order-list-footer {
          flex-grow: 0;
          flex-shrink: 0;
          background-color: #fff;
          border-top: solid 1px #eeeeee;
          .order-list-footer-text {
            padding: 0 21px;
            height: 49px;
            line-height: 49px;
            text-align: center;
          }
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
          border-radius: 2px;
        }
        a.dropdown-item {
          padding: 12px 18px 12px 12px;
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
          color: $brandGreen;
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
  <div :class="['page-header pr bgc-w', headerClass, actClass]">
    <div style="width: 100%;height: 100px;background-color: #00C1CE;" v-show="showBanner">
      <div style="width: 1200px;margin: 0 auto;position: relative;">
        <img src="~assets/img/banner/app-download-banner.png" style="width: 100%;height: 100%;">
        <button @click="showDownloadModal = true" style="background-color: transparent;width: 210px;height: 46px;border: 2px solid #fff;font-size: 22px;line-height: 42px;color: #fff;position: absolute;right: 44px;top: 30px;border-radius: 100px;cursor: pointer;outline: none;">下载APP ></button>
        <div @click="hideBanner" style="position: absolute;top: 0;right: 0;width: 24px;height: 24px;color: #fff;cursor: pointer;"><i class="iconfont icon-close" style="font-size: 20px;"></i></div>
      </div>
    </div>
    <b-navbar class="navbar-main" toggleable="md">
      <b-navbar-brand to="/">
        <img v-if="actClass" src="~assets/img/logo-white.svg" alt="CoinEx OTC" height="34" width="120">
        <img v-else src="~assets/img/logo.svg" alt="CoinEx OTC" height="34" width="120">
      </b-navbar-brand>
      <b-navbar-nav style="margin-left: 70px;">
        <!-- 首页path不需要精确匹配，否则首页url带有query无法高亮nav-item -->
        <b-nav-item to="/" :exact="$route.path !== '/'">法币交易</b-nav-item>
        <PublishItemButton>
          <b-nav-item>发布广告</b-nav-item>
        </PublishItemButton>
        <b-nav-item to="/wallet">OTC钱包</b-nav-item>
        <b-nav-item :href="helpLink" target="_blank">帮助</b-nav-item>
        <b-nav-item to="/activity/mining">挖矿<i class="iconfont icon-fire c-brand-yellow"></i></b-nav-item>
        <span style="color: #d5d5d5">|</span>
        <b-nav-item :href="`${coinexDomain}?lang=${lang.lang}`">返回主站</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <div v-if="user.account" class="ps-r">
          <div @mouseover="showOrders = true" @mouseout="showOrders = false" class="d-inline-block">
            <b-link class="order-link ps-r" to="/orders">
              <i class="iconfont icon-order-list"></i>
              <span>订单</span>
            </b-link>
            <div v-show="showOrders" class="order-list-wrapper">
              <div class="order-list-header">
                <div class="order-list-header-text">进行中订单</div>
              </div>
              <div class="order-list-body" v-prevent-parent-scroll>
                <ul>
                  <li class="order-list-item" v-for="item in orderList" @click="onLinkToOrderDetail(item.id)">
                    <div>
                      <UserAvatar :username="item._counterparty.name" :online="false" :size="40"
                                  :color="colors[item._counterparty.id % 10]"></UserAvatar>
                    </div>
                    <div class="order-list-item-detail">
                      <div style="color: #9b9b9b;">
                        <span style="display: inline-block;margin-right: 5px;">{{ item._isBuySide ? '购买' : '出售' }}{{ item.coin_type }}</span>
                        <span>总价：{{ item.cash_amount | formatMoney(2) }} CNY</span>
                      </div>
                      <div style="color: #27313e;">{{ constant ? constant.ORDER_STATUS[item.status.toUpperCase()].text :
                        '' }}
                      </div>
                    </div>
                  </li>
                </ul>
                <Blank v-if="!orderList.length" text="暂无进行中的订单"></Blank>
              </div>
              <div class="order-list-footer">
                <div class="order-list-footer-text">
                  <b-link to="/orders">查看全部订单 ></b-link>
                </div>
              </div>
            </div>
          </div>
          <span style="color: #d5d5d5">|</span>
          <button class="message-button" hidden><i class="iconfont icon-message"></i></button>
          <b-nav-item-dropdown id="user-dropdown" :text="simplifyUserName(user.account.name)">
            <b-dropdown-item to="/my/security"><i class="iconfont icon-manage-account"></i> 个人中心</b-dropdown-item>
            <b-dropdown-item to="/wallet"><i class="iconfont icon-wallet"></i> OTC钱包</b-dropdown-item>
            <b-dropdown-item v-if="user.merchant && user.merchant.auth_status === constant.MERCHANT_AUTH_STATUS.PASS"
                             to="/manage/items">
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
             title="设置OTC昵称"
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
    <DownloadModal v-model="showDownloadModal" header="法币交易正式上线 CoinEx APP，欢迎下载升级！"></DownloadModal>
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
  import UserAvatar from '~/components/user-avatar'
  import Blank from '~/components/blank'
  import DownloadModal from '~/components/download-modal'
  import preventParentScroll from 'vue-prevent-parent-scroll'
  import {COLORS} from '~/components/chat/constant.js'
  import cookies from '~/plugins/cookies'

  Vue.use(Vuelidate)
  export default {
    head: {
      link: [{rel: 'stylesheet', href: '//at.alicdn.com/t/font_739076_pg2affo7d0g.css'}]
    },
    components: {
      PublishItemButton,
      EMsgs,
      UserAvatar,
      Blank,
      DownloadModal,
    },
    data() {
      return {
        showBanner: false,
        showDownloadModal: false,
        colors: COLORS,
        orderList: [],
        showOrders: false,
        form: {
          userName: '',
        },
        coinexDomain,
        minNameLength: 2,
        maxNameLength: 15,
        attentionModelShowing: false,
        attention: [],
        nameInvalid: false,
        headerClass: null,
        activeAttentionIndex: 0,
        loginPage: `${loginPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
        registerPage: `${signupPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
      }
    },
    directives: {
      preventParentScroll, // 阻止滚动订单下拉框时候body滚动
    },
    validations() {
      return {form: this.validationConf.validations}
    },
    computed: {
      ...mapState(['lang', 'user', 'messages', 'constant']),
      actClass() {
        return this.$route.path.indexOf('/activity/') > -1 ? 'page-act-header' : null
      },
      helpLink() {
        return 'https://support.coinex.com/hc/categories/360000724513'
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
              validName: () => {
                return !this.nameInvalid
              }
            },
            message: {
              required: '请填写昵称',
              minLength: `昵称最少${this.minNameLength}个字符`,
              maxLength: `昵称最多${this.maxNameLength}个字符`,
              validName: '仅允许中英文、数字、下划线，不支持重复昵称',
            },
          },
        })
      },
      invalidMessages() {
        return this.validationConf.invalidMessages
      },
    },
    watch: {
      showOrders(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.fetchOrderList()
        }
      },
    },
    mounted() {
      // 页面加载完成之后，设置一下多语言版的常量
      this.$store.dispatch('setConstantI18n')

      // component 里面不能调用fetch和asyncData
      this.$store.dispatch('fetchUserAccount').then(_ => {
        if (this.user && this.user.account) {
          if (!this.user.account.is_name_confirmed) {
            this.$refs.updateNameModal.show()
          }
        }
      }).catch(err => {
        if (err.code === this.constant.ERROR_CODE.UNAUTHORIZED) return
        this.axios.onError(err)
      })
      window.addEventListener('scroll', this.onScroll)

      this.showBanner = cookies.getItem(window.document, 'showBanner') !== 'false' // 控制banner显示
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
      hideBanner() {
        this.showBanner = false
        cookies.setItem(window.document, 'showBanner', false)
      },
      isMerchant(order) { // 是否商家
        return order.merchant_id === this.user.account.id
      },
      preprocessOrder(item) {
        let counterparty
        if (this.isMerchant(item)) { // 商家
          counterparty = item.user
        } else { // 普通用户
          counterparty = item.merchant
        }
        return {
          ...item,
          _counterparty: counterparty, // 对手方
          _isBuySide: (item.merchant_id === this.user.account.id) === (item.merchant_side === this.constant.SIDE.BUY),
        }
      },
      fetchOrderList() {
        this.axios.order.getOrderList({
          status: 'processing',
          page: 1,
          limit: 20,
        }).then(res => {
          if (res.data) {
            const {data} = res.data
            this.orderList = data.map(item => this.preprocessOrder(item))
          } else {
            this.orderList = []
          }
        }).catch(err => {
          this.orderList = []
          this.axios.onError(err)
        })
      },
      onLinkToOrderDetail(id) {
        this.$router.push(`/orders/${id}`)
      },
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
          if (err.code) {
            this.nameInvalid = true
          } else {
            onApiError(err, this)
          }
        })
      },
      inputUserName() {
        this.$v.form.userName.$touch()
        this.nameInvalid = false
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
