<style lang="scss">
  .extended-input-number {
    width: 100%;
    padding: 0 4px;

    &:focus{
      outline:none;
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
        // 应该说全局没有负数的，所以这里武断地把0-9.以外的字符给过滤掉了。如果有需要后期可以加参数来配置这一特性
        let value = evt.target.value.replace(/[^0-9.]/gi, '')
        // 如果value为空，则直接返回，防止被转为0
        if (value === '') {
          this.setValue(value, evt)
          return
        }

        value = value.setDigit(this.decimalDigit)

        value = Math.min(this.max, value)
        value = Math.max(this.min, value)

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
