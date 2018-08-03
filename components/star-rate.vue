<!--五星评级/评分-->
<template>
  <div class="star-rate" v-if="length > 0">
    <svg height="0" width="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <symbol id="icon-star-empty" viewBox="0 0 32 32">
          <title>star-empty</title>
          <path
            d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path>
        </symbol>

        <symbol id="icon-star-full" viewBox="0 0 32 32">
          <title>star-full</title>
          <path
            d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
        </symbol>
      </defs>
    </svg>

    <template v-for="n in length">
      <button :class="{'star-button': true, 'hover': n <= hoverRate, 'filled': n <= value}"
              type="button" :key="n" :disabled="disabled"
              @click="setRate(n)" @mouseover="onOver(n)" @mouseout="onOut()" @keyup="onOver(n)" @keyup.enter="setRate(n)">
        <svg class="star-icon" v-show="isFilled(n)" :height="size" :width="size">
          <use xlink:href="#icon-star-full"></use>
        </svg>
        <svg class="star-icon" v-show="isEmpty(n)" :height="size" :width="size">
          <use xlink:href="#icon-star-empty"></use>
        </svg>
      </button>
    </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'star-rate',
    props: {
      // 传进来的评分
      value: {
        type: [Number, String]
      },
      // 星星总个数
      length: {
        type: Number
      },
      required: {
        type: Boolean
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {         // 是否只读(不可更改)
        type: Boolean,
        default: false
      },
      size: {
        type: Number,
        default: 16
      }
    },
    data() {
      return {
        hoverRate: 0,      // 当前悬浮的star对应的评分
      }
    },
    watch: {
      value: function (newValue) {
        this.hoverRate = newValue
      }
    },
    created() {
      let value = this.value
      if (this.value >= this.length) {
        value = this.length
      } else if (this.value < 0) {
        value = 0
      }
      this.hoverRate = value
    },
    methods: {
      onOver(index) {
        if (this.readonly) return

        this.hoverRate = index
      },
      onOut() {
        if (this.readonly) return

        this.hoverRate = this.value
      },
      setRate(index) {
        if (this.readonly) return

        this.$emit('beforeRate', index)
        this.$emit('input', index)
        this.$emit('afterRate', index)
      },
      isFilled(index) {
        return index <= this.hoverRate
      },
      isEmpty(index) {
        return index > this.hoverRate || (!this.value && !this.hoverRate)
      },
    },
  }
</script>

<style lang="scss">
  .star-rate {
    cursor: default;

    .star-button {
      display: inline-block;
      padding: 0px;
      border: 0;
      line-height: 0;
      text-decoration: none;
      background: transparent none;

      &:hover {
        cursor: default !important;
        text-decoration: none;
      }
      &:focus {
        outline: 0 !important;
        text-decoration: none;
      }
      &[disabled] {
        color: #ccc;
        opacity: 0.8;
      }
    }

    .star-icon {
      color: #ffbc32;
      display: inline-block;
      position: relative;
      margin: 0 4px;
      top: 0;
      width: 16px;
      height: 16px;
      vertical-align: middle;
      stroke-width: 0;
      stroke: currentColor;
      fill: currentColor;
    }
  }
</style>
