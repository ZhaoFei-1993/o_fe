<style lang="scss">
  .extended-input-number {
    width: 100%;
    padding-left:4px;
    &:focus{
      outline:none;
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
        default: Infinity,
      },
      min: {
        type: Number,
        default: -Infinity,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String,
      },
    },
    methods: {
      onInput(evt) {
        this.$emit('input', evt.target.value)
        this.$emit('change', evt, evt.target.value)
      },
      onFocus(evt) {
        this.$emit('focus', evt)
      }
    },
  }
</script>
