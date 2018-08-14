<template>
  <div class="ex-page-incompatible">
    <div class="firpic">
      <img :src="require('~/assets/img/logo.svg')" height="34" alt="CoinEx OTC交易平台">
    </div>
    <p class="mt-40 ta-c c-light">您当前的浏览器版本过低，请升级浏览器获得更安全的网络环境。</p>
    <p class="mt-80 ta-c">推荐以下浏览器</p>
    <div class="secpic">
      <a target="_blank"
         href="https://www.google.com/chrome/browser/desktop/index.html?brand=CHBD&gclid=CjwKCAiAqIHTBRAVEiwA6TgJw0Cp6fhD3RAweScGQZYL5gawm_TqIg8vygM3FxpDrNPthXAe-gQ6cRoCNBkQAvD_BwE"
         style="margin-right: 45px">
        <img id="img002" src="~/assets/img/chrome.png" width="100">
      </a>
      <a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/">
        <img id="img003" src="~/assets/img/firefox.png" width="100">
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ex-page-incompatible {
    text-align: center;
    .firpic {
      text-align: center;
      margin: 10% 0 32px 0;
      position: relative;
    }
    .secpic {
      text-align: center;
      margin-bottom: 100px;
      margin-top: 40px
    }
    .secpic a {
      cursor: pointer;
    }
    .bottomlang {
      position: absolute;
      bottom: 25px;
      left: 46%;
      font-size: 14px;
      color: #999
    }
    .cur {
      color: #333333
    }

  }
</style>


<script>
  export default {
    head() {
      return {
        title: '提示' + this.$t('global.pageTitle.common')
      }
    },
    layout: 'incompatible'
  }
</script>
