<template>
  <footer class="f_ft">
    <div class="f_wrapper">
      <div class="color-line"></div>
      <div class="ft_content container">
        <div class="mediaBox">
          <p class="slogan">
            <img src="~assets/img/logo-gray.svg">
          </p>
          <p class="mt-10 fs-24 ff-light">CoinEx OTC 法币交易</p>
          <div class="medias mt-10">
            <a href="mailto:support@coinex.com"><i class="iconfont icon-email"></i></a>
            <a target="_blank" href="https://weibo.com/coinex"><i class="iconfont icon-weibo"></i></a>
            <a target="_blank" href="https://twitter.com/coinexcom"><i class="iconfont icon-twitter"></i></a>
            <a target="_blank" href="https://www.facebook.com/TheCoinEx/"><i class="iconfont icon-facebook"></i></a>
            <a v-if="lang.lang==='zh_Hans_CN'||lang.lang==='zh_Hant_HK'" target="_blank" href="https://t.me/CoinExCN"><i class="iconfont icon-telegram"></i></a>
            <a v-else target="_blank" href="https://t.me/TheCoinEx"><i class="iconfont icon-telegram"></i></a>
          </div>
        </div>
        <div class="linksWrap">
          <div class="linkBox">
            <p class="boxTitle">产品</p>
            <b-link :href="coinexDomain">币币交易</b-link>
            <b-link to="/">法币交易</b-link>
            <b-link target="_blank" :href="'https://pool.viabtc.com/?lang='+lang.lang">矿池</b-link>
            <b-link target="_blank" :href="'https://www.viabtc.com/?lang='+lang.lang">区块浏览器</b-link>
          </div>
          <div class="linkBox">
            <p class="boxTitle">关于</p>
            <b-link :href="`${coinexDomain}/aboutus`">关于我们</b-link>
            <!-- <b-link to="/">加入我们</b-link> -->
            <b-link href="https://support.coinex.com/hc/zh-cn/articles/360007642234" target="_blank">用户协议</b-link>
            <b-link href="https://support.coinex.com/hc/zh-cn/articles/360007643734" target="_blank">交易规则</b-link>
            <b-link href="https://support.coinex.com/hc/zh-cn/articles/360007736293" target="_blank">费率标准</b-link>
          </div>
          <div class="linkBox">
            <p class="boxTitle">支持</p>
            <b-link href="https://support.coinex.com/hc/zh-cn/sections/360001604474" target="_blank">新手帮助</b-link>
            <b-link :href="`${coinexDomain}/res/support/ticket`" target="_blank">提交工单</b-link>
            <b-link href="https://support.coinex.com/hc/zh-cn/sections/360001631693" target="_blank">公告</b-link>
          </div>
        </div>
      </div>
      <div class="cprBar fs-12">
        <div class="d-flex flex-space-between container">
          <div>
            <p class="cpr">Copyright @ 2017-2018 CoinEx.com.   All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
import {coinexDomain} from '~/modules/variables'

export default {
  data() {
    return {
      coinexDomain,
    }
  },
  computed: {
    ...mapState(['lang']),
  },
}
</script>
<style scoped lang="scss">
  @import "~assets/scss/variables.scss";

  .f_ft {
    background-color: #212a35;
    color: #fff;
    .color-line{
      height: 6px;
      background-image: linear-gradient(to left, #ffc21e, #00c1ce);
    }
    .ft_content {
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 30px;
      padding-bottom:20.6px;
      color:#9b9b9b;
      margin:0 auto;
    }
    .linksWrap {
      overflow: hidden;
      position: relative;
      //min-width: 750px;
      .linkBox {
        width: 180px;
        float: left;
      }
      .boxTitle {
        font-size: 16px;
        margin-bottom: 21px;
        color:white;
      }
      a {
        color:#9b9b9b;
        display: block;
        margin-bottom: 7px;
        //   &:hover{color: #999}
      }
    }
    .mediaBox {
      .medias {
        .wechatToggle {
          display: inline-block;
        }
        a{
          color:#9b9b9b;
          text-decoration: none;
          &:hover{
            color:$brandGreen;
          }
        }
        .iconfont{
          margin-right: 22.5px;
        }
      }
      .slogan {
        font-size: 18px;
        display: flex;
        align-items: center;
        color: #fff;
        margin-top: -32px;
        .logo {
          font-size:34px
        }
      }
    }
    .cprBar {
      height: 70px;
      line-height: 70px;
      padding-top: 20px;
      background: #1a2029;

      .flex-space-between{
        margin: auto;
      }
      .cpr {
        color: #666666;
        line-height: 26px;
      }
    }
  }
</style>
