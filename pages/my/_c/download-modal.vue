<template>
  <b-modal :visible="value"
           title="实名认证"
           @hide="hideModal"
           :hide-footer="true"
           :noCloseOnBackdrop="true">
    <div class="kyc-modal">
      <div class="download-header">实名认证请前往CoinEx APP中 「 账户 」-「 实名认证 」 中进行。</div>
      <div class="download-box kyc-modal-download-wrapper">
        <Qrcode val="https://www.coinex.com/mobile/download" :size="140" bg-color="#FFFFFF" fg-color="#000000" level="L"></Qrcode>
        <div class="download">
          <a class="ios" target="_blank" :href="download.iOS"></a>
          <a class="android" target="_blank" :href="download.Android"></a>
        </div>
      </div>
      <div class="download-box download-tips">扫描下载APP</div>
    </div>
  </b-modal>
</template>

<script>
  import Qrcode from '~/components/qr-code'

  export default {
    data() {
      return {
        download: {},
      }
    },
    components: {
      Qrcode,
    },
    mounted() {
      this.axios.misc.appDownloadUrl().then(res => {
        this.download = res.data
      })
    },
    props: {
      value: {
        required: true,
        type: Boolean,
      },
    },
    methods: {
      hideModal() {
        this.$emit('input', false)
      },
    }
  }
</script>

<style lang="scss">
  .kyc-modal {
    .download-header {
      font-size: 18px;
      color: #27313e;
    }
    .download-box {
      width: 348px;
      margin: 30px auto 0;
      &.download-tips {
        margin-top: 0;
        color: #162331;
      }
    }
    .kyc-modal-download-wrapper {
      display: flex;
      justify-content: space-between;
      .qrcode {
        width: 120px;
        height: 120px;
      }
      .download {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .ios {
          top: 0;
          cursor: pointer;
          display: inline-block;
          width: 180px;
          height: 48px;
          background-image: url('~assets/img/appstore_download.svg');
          background-size: contain;
          background-repeat: no-repeat;
        }
        .android {
          bottom: 0;
          display: inline-block;
          margin-top: 30px;
          width: 180px;
          height: 48px;
          background-image: url('~assets/img/android_download.svg');
          background-size: contain;
          background-repeat: no-repeat;
        }
      }
    }
  }
</style>
