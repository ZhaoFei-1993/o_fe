<!--带加/减-->
<style lang="scss">
  @import "~assets/scss/variables.scss";

  .input-number-counter {
    flex-grow: 0;
    width: auto;

    &._xs {
      width: 100px;

      .btn {
        width: 21px;
        max-width: 21px;
        min-width: 21px;
        height: 26px;
        line-height: 1;
      }

      input[type=number] {
        height: 26px;
        width: 60px;
        text-align: center;
      }
    }

    .btn {
      width: 30px;
      min-width: 30px;
      max-width: 30px;
      height: 32px;
      background-color: #f9f9f9;
      border: solid 1px #d1d1d1;
      color: $dark;
    }

    input[type=number] {
      width: 80px;
      height: 32px;
      border: solid 1px #d1d1d1;
      flex-grow: 0;
    }
  }
</style>

<template>
  <b-input-group class="input-number-counter" :class="`_${size}`" size="sm">
    <b-btn slot="prepend" @click="onDec">-</b-btn>
    <ExtendedInputNumber :value="value" :min="min" :max="max" @input="onInput"/>
    <b-btn slot="append" @click="onInc">+</b-btn>
  </b-input-group>
</template>

<script>
  import ExtendedInputNumber from './extended-input-number.vue'

  export default {
    name: 'input-number-counter',
    components: {
      ExtendedInputNumber,
    },
    props: {
      value: [Number, String],
      size: {
        type: String,
        default: 'sm'
      },
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      }
    },
    methods: {
      onInput(value) {
        this.$emit('input', value)
        // 需要看下为什么emit出去之后，本地的value没有改变
        // if (value > this.min && value < this.max) {
        //   this.$emit('input', value)
        // }
      },
      onInc() {
        // 当输入奇怪字符的时候，加法会变为字符串拼接，因此要先parseInt一下
        const value = parseInt(this.value) + 1
        if (value <= this.max) {
          this.$emit('input', value)
        }
      },
      onDec() {
        const value = parseInt(this.value) - 1
        if (value >= this.min) {
          this.$emit('input', value)
        }
      }
    }
  }
</script>
