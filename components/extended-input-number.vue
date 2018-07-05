<style lang="scss">
  .extended-input-number {

  }
</style>

<template>
  <b-form-input type="number" :disabled="disabled" :value="value" @input="onInput"
                @change="$emit('change', $event)"></b-form-input>
</template>

<script>
  export default {
    name: 'extended-input-number',
    components: {},
    props: {
      value: [Number, String],
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    methods: {
      onInput(value) {
        // 需要看下为什么emit出去之后，本地的value没有改变 todo
        // value = Number(value)
        // if (value < this.min) {
        //   value = this.min
        // }
        // if (value > this.max) {
        //   value = this.max
        // }
        // console.log(value)
        this.$emit('input', value)
      }
    }
  }
</script>
