import Vue from 'vue'

let init = () => {}
let show = () => {}

if (process.browser) {
  const toastContainer = document.createElement('div')

  const $toast = new Vue({
    el: toastContainer,
    data: {
      style: {
        toast: {
          position: 'absolute',
          left: '0',
          bottom: '60px',
          width: '100%',
        },
        toastContent: {
          width: '150px',
          height: '22px',
          lineHeight: '22px',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          color: '#fff',
          borderRadius: '5px',
          margin: '0 auto',
          fontSize: '14px',
        },
      },
      text: '',
      show: false,
    },
    render() {
      return (
        <div v-show={this.show} style={this.style.toast}><div style={this.style.toastContent}>{ this.text }</div></div>
      )
    },
  })

  show = (text = '', time = 0) => {
    $toast.text = text
    if (!$toast.show) {
      $toast.show = true
    }
    if (time > 0) {
      const tid = setTimeout(() => {
        $toast.show = false
        clearTimeout(tid)
      }, time)
    }
  }

  init = (target) => {
    if (target) {
      target.appendChild($toast.$el)
    }
  }
}

export default {
  init,
  show,
}
