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
    data() {
      return {
        inputVal: this.value,
      }
    },
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
        value = Math.min(this.max, value)
        value = Math.max(this.min, value)
        evt.target.value = value
        this.$emit('input', value)
      },
      onFocus(evt) {
        this.$emit('focus', evt)
      }
    },
  }
</script>
