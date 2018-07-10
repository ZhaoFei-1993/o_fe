<style lang="scss">
  $total-width:46px;
  $total-height:24px;
  $slider-width:22px;

  .switch {
    width: $total-width;
    height: $total-height;
    border-radius: $total-height;
    border: solid 1px #d3d3d3;
    overflow: hidden;
    cursor: pointer;
  }

  .switch-input {
    display: none;
  }

  .switch-handle {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    outline: 0;
    box-sizing: border-box;
    background-color: #fff;
    transition:background-color .3s;
    user-select: none;

    &.checked {
      background-color: #52cbca;
      &:before{
        transform: translate(22px,0);
      }
    }
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      z-index: 20;
      width: $slider-width;
      height:$slider-width;
      transition: transform .3s;
      border-radius: 100%;
      background-color: #ffffff;
      box-shadow: 0 2px 4px 0 #9b9b9b;
    }
  }

  .switch-handle.disabled{
    opacity: 0.5;
  }
</style>

<template>
  <label class="switch">
    <input class="switch-input" type="checkbox" @change.stop="toggle" @click.stop="click" value="isChecked" :disabled="disabled">
    <span :class="['switch-handle',{'checked':isChecked},disabled?'disabled':'']"></span>
  </label>
</template>

<script>
export default {
  data() {
    return {
      isChecked: this.value
    }
  },

  props: {
    value: {
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    value(val) {
      this.isChecked = val
    }
  },

  methods: {
    click(event) {
      this.$emit('beforeChange', event.target.checked, event)
    },
    toggle(event) {
      this.$emit('change', event.target.checked, event)
      this.$emit('input', event.target.checked, event)
    }
  }
}
</script>
