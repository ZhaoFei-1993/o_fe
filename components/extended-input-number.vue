<style lang="scss">
  .extended-input-number {
    width: 100%;
    padding: 0 4px;

    &:focus {
      outline: none;
      border-color: #52cbca;
      border-style: solid;
    }
  }
</style>

<template>
  <input class="extended-input-number" type="number" :disabled="disabled" :value="value"
         @input="onInput" :placeholder="placeholder"
         @focus="onFocus"/>
</template>

<script>
  export default {
    name: 'extended-input-number',
    components: {},
    props: {
      value: [Number, String],
      max: {
        type: Number,
        default: Number.MAX_SAFE_INTEGER,
      },
      min: {
        type: Number,
        default: Number.MIN_SAFE_INTEGER,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String,
      },
      decimalDigit: {
        type: Number,
        default: 8,
      }
    },
    methods: {
      onInput(evt) {
        let value = evt.target.value.setDigit(this.decimalDigit)
        // 如果value为空，则直接返回，防止被转为0
        if (value === '') return this.$emit('input', value)

        // 不能用 value = Math.min(this.max, value) 这种形式，会转换成数字
        if (value > this.max) {
          value = `${this.max}`.setDigit(this.decimalDigit)
        }
        if (value < this.min) {
          value = `${this.min}`.setDigit(this.decimalDigit)
        }
        evt.target.value = value
        this.$emit('input', value)
      },
      onFocus(evt) {
        this.$emit('focus', evt)
      }
    },
  }
</script>
