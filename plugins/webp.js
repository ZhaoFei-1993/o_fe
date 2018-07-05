import Vue from 'vue'
import {mapState} from 'vuex'

Vue.mixin({
  computed: mapState([
    'webp'
  ]),

  methods: {
    getImage(source) {
      if (typeof source === 'string') {
        return source
      }
      if (!(source && typeof source === 'object')) {
        return null
      }
      if (source.webp && this.webp && this.webp.support) { // 支持webp
        return source.webp
      } else {
        return source.default
      }
    }
  }
})
