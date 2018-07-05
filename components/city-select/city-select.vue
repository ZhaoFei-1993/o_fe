<!--全球国家、省、城市选择器-->
<style lang="scss">
  .province-select {
    display: flex;

    select {
      margin-right: 20px;
    }
  }
</style>
<template>
  <div class="province-select">
    <select :value="country" @input="onCountryChange" :class="selectClass">
      <option value="">选择国家</option>
      <option v-for="country in countries" :value="country[valueKey]">{{country[textKey]}}</option>
    </select>
    <select :value="province" @input="onProvinceChange" :class="selectClass">
      <option value="">选择省份</option>
      <option v-for="province in provinces" :value="province[valueKey]">{{province[textKey]}}</option>
    </select>
    <select :value="city" @input="onCityChange" :class="selectClass">
      <option value="">选择城市</option>
      <option v-for="city in cities" :value="city[valueKey]">{{city[textKey]}}</option>
    </select>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    selectClass: {
      type: String,
      default: 'form-control'
    },
    textKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'code'
    },
    countries: {
      type: Array,
      default: []
    },
    country: undefined, // country value
    province: undefined,
    city: undefined
  },
  data() {
    return {
      provinces: [],
      cities: [],
    }
  },
  mounted() {
    let selectedCountry = this.countries.filter(item => item[this.valueKey] === this.country)[0]

    if (selectedCountry) {
      this.provinces = selectedCountry['level2']

      let selectedCity = this.provinces.filter(item => item[this.valueKey] === this.province)[0]

      if (selectedCity) {
        this.cities = selectedCity['level3']
      }
    }
  },
  methods: {
    onCountryChange(e) {
      let selectedCountry = this.countries.filter(item => item[this.valueKey] === e.target.value)[0]

      this.$emit('update:country', e.target.value) // this.country = e.target.value
      // this.$emit('countryChange', selectedCountry)

      this.provinces = selectedCountry ? selectedCountry['level2'] : []
      // 这里很奇怪...看起来update:province是异步触发而不是同步的，因此会造成一些问题，如果要保证他们的先后，就需要手动nextTick
      this.$nextTick(() => this.$emit('update:province', undefined))

      this.cities = []
      this.$nextTick(() => this.$emit('update:city', undefined))
    },
    onProvinceChange(e) {
      let selectedCity = this.provinces.filter(item => item[this.valueKey] === e.target.value)[0]
      // this.$emit('provinceChange', selectedCity)

      this.$emit('update:province', e.target.value)

      this.cities = selectedCity ? selectedCity['level3'] : []
      this.$nextTick(() => this.$emit('update:city', undefined))
    },
    onCityChange(e) {
      // let selectedCity = this.cities.filter(item => item[this.valueKey] === e.target.value)[0]

      this.$emit('update:city', e.target.value)
      // this.$emit('cityChange', selectedCity)
    },
  }
}
</script>
