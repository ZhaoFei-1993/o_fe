<style lang="scss">
  .location-cascade-select {
    display: flex;
  }
</style>

<template>
  <div class="location-cascade-select">
    <AutoCompleteSelection
      class="location-select"
      name="location_country_code"
      identifier="code"
      :selectedId="selected[0]"
      :searchOptions="countryOptions"
      :placeholder="placeholders[0]"
      :filterMode="true"
      :disableCustomOption="true"
      @change="onCountryChange"
    />
    <AutoCompleteSelection
      v-if="provinceOptions"
      class="location-select"
      name="location_province_code"
      identifier="code"
      :selectedId="selected[1]"
      :searchOptions="provinceOptions"
      :placeholder="placeholders[1]"
      :filterMode="true"
      :disableCustomOption="true"
      @change="onProvinceChange"
    />
    <AutoCompleteSelection
      v-if="cityOptions"
      class="location-select"
      name="location_city_code"
      identifier="code"
      :selectedId="selected[2]"
      :searchOptions="cityOptions"
      :placeholder="placeholders[2]"
      :filterMode="true"
      :disableCustomOption="true"
      @change="onCityChange"
    />
  </div>
</template>

<script>
import AutoCompleteSelection from '~/components/auto-complete-selection.vue'

// todo: 将其他几个位置选择器也用本组件代替
export default {
  name: 'location-cascade-select',
  components: {
    AutoCompleteSelection,
  },
  props: {
    // 默认选中的选项
    selected: {
      type: Array,
      default: () => [],
    },
    // 各个输入框里面的占位文字
    placeholders: {
      type: Array,
      default: () => [],
    },
    // 国家的信息要外部传入
    countryOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    const [countryCode, provinceCode, cityCode] = this.selected

    return {
      countryCode,
      provinceCode,
      cityCode,
    }
  },
  computed: {
    'provinceOptions': function () {
      const countryCode = this.countryCode

      if (countryCode) {
        const country = this.countryOptions.find(option => option.code === countryCode)
        return country ? country.level2 : null
      } else {
        return null
      }
    },
    'cityOptions': function () {
      const provinceCode = this.provinceCode

      if (provinceCode && this.provinceOptions) {
        const province = this.provinceOptions.find(option => option.code === provinceCode)
        return province ? province.level3 : null
      } else {
        return null
      }
    },
  },
  methods: {
    onCountryChange(option) {
      if (option && option.code) {
        this.countryCode = option.code

        // todo: 同步phone的逻辑要考虑下
        // if (constant.phoneCodeOptions && !this.form.contact_phone) {
        //   this.form.contact_phone_country_code = constant.phoneCodeOptions.find(c => c.code === option.code).value
        // }
      } else {
        this.countryCode = null
      }

      this.provinceCode = null
      this.cityCode = null

      this.onChange()
    },
    onProvinceChange(option) {
      this.provinceCode = option ? option.code : null
      this.cityCode = null

      this.onChange()
    },
    onCityChange(option) {
      this.cityCode = option ? option.code : null

      this.onChange()
    },
    onChange() {
      this.$emit('change', [this.countryCode, this.provinceCode, this.cityCode])
    },
  },
}
</script>
