<style lang="scss">

</style>

<template>
  <Selects v-if="constant.globalCities.length"
           :countries="constant.globalCities"
           :country="value.countryCode"
           :province="value.provinceCode"
           :city="value.cityCode"
           @update:country="onUpdate('country', $event)"
           @update:province="onUpdate('province', $event)"
           @update:city="onUpdate('city', $event)"
  />
</template>

<script>
import Selects from './city-select.vue'
import {mapState} from 'vuex'

export default {
  name: 'CitySelect',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Selects
  },
  computed: {
    ...mapState(['constant'])
  },
  methods: {
    onUpdate(level, value) {
      if (level === 'country') {
        this.$emit('input', Object.assign({}, this.value, {countryCode: value}))
      }
      if (level === 'province') {
        this.$emit('input', Object.assign({}, this.value, {provinceCode: value}))
      }
      if (level === 'city') {
        this.$emit('input', Object.assign({}, this.value, {cityCode: value}))
      }
    }
  },
  // 在客户端再加载地理位置数据
  mounted() {
    this.$store.dispatch('initGlobalCities')
  }
}
</script>
