<!--带有单位的input-->
<style lang="scss">
  @import "~assets/scss/variables.scss";

  .currency-input {
    .extended-input-number {
      height: 40px;
      padding-right: 10px;
      padding-left: 10px;
      border: solid 1px #d1d1d1;
      font-size: 18px;
      color: #192330;

      &:focus {
        border: solid 1px $brandGreen;

        .input-group-text {
          color: $brandGreen;
        }
      }

      &:disabled {
        background-color: #f9f9f9;
        /*border: none;*/
      }
    }

    .input-group-append {
      position: absolute;
      right: 1px;
      top: 1px;
      height: 38px;

      .input-group-text {
        background-color: transparent;
        border: none;
        color: #6f6f6f;
      }
    }
  }
</style>

<template>
  <b-input-group :append="currency" class="currency-input">
    <ExtendedInputNumber :id="id" :value="value"
                         :disabled="disabled"
                         :placeholder="placeholder"
                         :decimalDigit="decimalDigit"
                         @input="onInput"
                         @focus="onFocus"/>
  </b-input-group>
</template>

<script>
import ExtendedInputNumber from '~/components/extended-input-number.vue'
export default {
  name: 'currency-input',
  components: {
    ExtendedInputNumber,
  },
  props: {
    currency: String,           // 附带的货币类型
    value: [String, Number],
    placeholder: String,
    width: Number,              // 组件总宽度
    disabled: Boolean,
    decimalDigit: Number,
    id: {
      type: String,
      default: null,
    },
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
    },
    onFocus(e) {
      this.$emit('focus', e)
    },
  }
}
</script>
