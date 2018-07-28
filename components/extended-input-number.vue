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
  <input class="extended-input-number" type="input" :disabled="disabled" :value="value"
         :step="step"
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
      },
      step: {
        type: Number,
        default: 0.1 ** 8,
      }
    },
    methods: {
      onInput(evt) {
        // 应该说全局没有负数的，所以这里武断地把0-9.以外的字符给过滤掉了。如果有需要后期可以加参数来配置这一特性
        let numberExp = /[^0-9.]/gi
        if (this.decimalDigit === 0) {
          numberExp = /[^0-9]/gi
        }
        let value = evt.target.value.replace(numberExp, '')
        // 如果value为空，则直接返回，防止被转为0
        if (value === '') {
          this.setValue(value, evt)
          return
        }
        value = value.setDigit(this.decimalDigit)
        // 不能用 value = Math.min(this.max, value) 这种形式，会转换成数字，遇到0.0变成0导致无法输入的问题
        if (value > this.max) {
          value = `${this.max}`.setDigit(this.decimalDigit)
        }
        if (value < this.min) {
          value = `${this.min}`.setDigit(this.decimalDigit)
        }
        this.setValue(value, evt)
      },
      setValue(value, evt) {
        evt.target.value = value
        this.$emit('input', value)
      },
      onFocus(evt) {
        this.$emit('focus', evt)
      }
    },
  }
</script>
