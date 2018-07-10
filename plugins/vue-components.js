import Vue from 'vue'
import CBlock from '~/components/c-block.vue'
import Language from '~/components/language.vue'

if (!Vue._vueComponentInstalled) {
  Vue._vueComponentInstalled = true

  Vue.component('CBlock', CBlock)
  Vue.component('Language', Language)
}
