import Vue from 'vue'

function noop() {}

export default ({app, store}) => {
  if (process.client) {
    const modalContainer = document.createElement('div')

    const $modal = new Vue({
      el: modalContainer,
      data: {
        title: '',
        content: '',        // content的占位
        footer: '',         // footer的占位，会取代modal默认的footer
        okOnly: false,
      },
      render() {
        return (
          <b-modal ref="modal"
            title={this.title}
            onOk={this.onOk}
            onCancel={this.onCancel}
            ok-only={this.okOnly}
            centered={this.centered}
            ok-title={this.okTitle}
            cancel-title={this.cancelTitle}
            ok-variant="gradient-yellow"
            cancel-variant="outline-green"
            hide-footer={this.hideFooter}
            noCloseOnBackdrop={this.noCloseOnBackdrop}
            hideHeaderClose={this.hideHeaderClose}
            button-size="lg"
            class="text-center">
            <div style="line-height: 1.5">{this.content}</div>
          </b-modal>
        )
      },
      methods: {
        onOk() {
          console.log('inner ok')
        },
        onCancel() {
          console.log('inner cancel')
        },
      },
    })

    const  $showDialog = function (config) {
      $modal.title = config.title
      $modal.content = config.content
      $modal.okOnly = config.okOnly
      $modal.centered = config.centered
      $modal.onOk = config.onOk || noop
      $modal.onCancel = config.onCancel || noop
      $modal.okTitle = config.okTitle || $modal.$t('global.misc.确定')
      $modal.cancelTitle = config.cancelTitle || $modal.$t('global.misc.取消')
      $modal.hideFooter = config.hideFooter
      $modal.noCloseOnBackdrop = typeof config.noCloseOnBackdrop === 'boolean' ? config.noCloseOnBackdrop : true // 默认不可以点背景隐藏
      $modal.hideHeaderClose = config.hideHeaderClose

      $modal.$refs.modal.show()

      return $modal
    }

    app.$showDialog = Vue.prototype.$showDialog = $showDialog

    // 测试用代码
    // $showDialog({
    //   title: 'test title',
    //   content: 'test text',
    //   okOnly: true,
    //   onOk: function () {
    //     console.log('ok')
    //   },
    //   onCancel: function () {
    //     console.log('cancel')
    //   }
    // })

    document.body.appendChild($modal.$el)
  }
}
