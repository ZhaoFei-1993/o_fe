/**
 * 顶部的横条tips提示文案
 */
import Vue from 'vue'

const SHOW_TIME = 3

export default ({app, store}) => {
  if (process.client) {
    const tipsContainer = document.createElement('div')

    const $tips = new Vue({
      el: tipsContainer,
      data: {
        errorContent: '',
        successContent: '',
        time: SHOW_TIME,
      },
      render() {
        if (this.successContent) {
          return (
            <b-alert variant="success" dismissible show={this.time} onDismissed={this.close}>
              {this.successContent}
            </b-alert>
          )
        }

        if (this.errorContent) {
          return (
            <b-alert variant="danger" dismissible show={this.time} onDismissed={this.close}>
              {this.errorContent}
            </b-alert>
          )
        }
      },
      methods: {
        close() {
          this.errorContent = null
          this.successContent = null
        },
      },
    })

    const $showTips = function (content, type = 'success', time = SHOW_TIME) {
      if (type === 'success') {
        $tips.successContent = content
        $tips.errorContent = ''
        $tips.time = time
      }
      if (type === 'error') {
        $tips.errorContent = content
        $tips.successContent = ''
        $tips.time = time
      }
    }

    app.$showTips = Vue.prototype.$showTips = $showTips
    app.$successTips = Vue.prototype.$successTips = $showTips
    app.$errorTips = Vue.prototype.$errorTips = function (content) {
      $showTips(content, 'error')
    }

    // 测试用代码
    // $showTips('fdfdfdfd', 'error')

    document.body.appendChild($tips.$el)
  }
}
