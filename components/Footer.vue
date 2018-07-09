<!--通用页脚-->
<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-footer {
    color: #fff;

    .footer_wrapper {
      background-color: #212a35;
    }
    .footer_top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 50px;
      padding-bottom: 54px;
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;
      color: #9b9b9b;
    }

    .footer_links {
      overflow: hidden;
      position: relative;

      .link_wrapper {
        width: 180px;
        float: left;
      }

      .link_title {
        font-size: 16px;
        margin-bottom: 21px;
        color: white;
      }

      a {
        display: block;
        margin-bottom: 7px;
        color: #9b9b9b;
      }
    }

    .media_wrapper {

      a {
        color: #9b9b9b;
        text-decoration: none;

        &:hover {
          color: $brandGreen;
        }
      }

      .iconfont {
        margin-right: 22.5px;
      }

      .icon-viabtc-logo {
        font-size: 45px;
        color: #9b9b9b;
      }
    }
    .footer_bottom_wrapper{
      background-color: #1a2029;
    }
    .footer_bottom {
      width: 1200px;
      margin: 0 auto;
      height: 58px;
      padding: 25px 0;
      font-size: 14px;
      color: #aaaaaa;

      .lang-select {
        width: 120px;
        height: 26px;
        line-height: 26px;
        padding-top: 0;
        padding-bottom: 0;
        border: 1px solid #6f6f6f;
        color: white;
        background-color: #1a2029 !important;
      }
    }
  }
</style>

<template>
  <footer class="page-footer">
    <div class="footer_wrapper">
      <div class="footer_top">
        <div class="media_wrapper">
          <div>
            <i class="iconfont icon-viabtc-logo"></i>
          </div>
          <div class="mt-30">
            <a href="mailto:support@viabtc.com"><i class="iconfont icon-email"></i></a>
            <a target="_blank" href="//weibo.com/viabtc"><i class="iconfont icon-weibo"></i></a>
            <a target="_blank" href="//twitter.com/viabtc"><i class="iconfont icon-twitter"></i></a>
            <a target="_blank" href="//www.facebook.com/viabtc"><i class="iconfont icon-facebook"></i></a>
            <a target="_blank" href="//t.me/joinchat/GW1OYlAkoeWG7J_vO--nCA"><i class="iconfont icon-telegram"></i></a>
          </div>
        </div>
        <div class="footer_links">
          <div class="link_wrapper">
            <p class="link_title">产品</p>
            <b-link :href="'//pool.viabtc.com/?lang='+lang.lang">矿池</b-link>
            <b-link href="/">矿机</b-link>
            <b-link :href="'//www.viabtc.com/?lang='+lang.lang">区块浏览器</b-link>
          </div>
          <div class="link_wrapper">
            <p class="link_title">公司</p>
            <b-link target="_blank" :href="'//www.viabtc.com/aboutus?lang='+lang.lang">关于我们</b-link>
            <b-link target="_blank" href="//www.lagou.com/gongsi/276586.html">加入我们</b-link>
            <b-link target="_blank" :href="'//www.viabtc.com/contact?lang='+lang.lang">联系我们</b-link>
          </div>
          <div class="link_wrapper">
            <p class="link_title">客服</p>
            <b-link target="_blank" :href="supportTicketUrl">提交工单</b-link>
            <b-link href="/announcements">公告</b-link>
          </div>
        </div>

      </div>

    </div>
    <div class="footer_bottom_wrapper">
      <div class="footer_bottom d-flex justify-content-between align-items-center">
        <div>Copyright © 2016-2018 ViaBTC Technology Limited</div>
        <b-form-select class="lang-select fz-12" @change="setLang" v-model="lang.lang">
          <option v-for="(item,index) in lang.locales" :key="index" :value="item.val">{{item.text}}</option>
        </b-form-select>
      </div>
    </div>
  </footer>
</template>

<script>
  import cookies from '~/plugins/cookies'
  import {mapState} from 'vuex'

  export default {
    computed: {
      ...mapState(['lang', 'user']),
      supportTicketUrl: function () {
        const ticketUrl = 'https://support.coinex.com/hc/requests/new'
        return this.user.data ? `https://support.coinex.com/hc/signin?return_to=${encodeURIComponent(ticketUrl)}` : ticketUrl
      },
    },
    methods: {
      setLang(lang) {
        const date = new Date()
        const expire = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000)
        cookies.setItem(document, 'lang', lang, expire, '/')
        this.$store.dispatch('setLang', lang)

        const newLink = this.utils.removeParamInLink('lang')
        if (location.href === newLink) {
          location.reload()
        } else {
          location.href = newLink
        }
      },
    },
  }
</script>
