import Vue from 'vue'
import CBlock from '~/components/c-block.vue'

if (!Vue._vueComponentInstalled) {
  Vue._vueComponentInstalled = true

  Vue.component('CBlock', CBlock)
}
