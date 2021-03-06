import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

const sampleRate = 0.8
if (process.env.MODE === 'production') {
  Raven
    .config('https://920df9cbd56a4eaca855de0e4ab69536@sentry.coinex.com/2', {
      shouldSendCallback: function () {
        return (Math.random() <= sampleRate)
      }
    })
    .addPlugin(RavenVue, Vue)
    .install()
}
export const reportError = (err) => {
  if (process.env.MODE === 'production') {
    Raven.captureException(err)
  } else {
    console.error(err)
  }
}
