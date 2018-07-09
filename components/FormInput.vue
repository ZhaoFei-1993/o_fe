<template>
  <div class="via-input-container">
    <div class="via-input-wrapper">
      <input ref="input" :readonly="readonly" :type="type" :value="localValue" :maxlength="maxlength" @focus="onFocus" :autofocus="autofocus" @blur="onBlur" @input="onInput" @change="onChange" class="via-input-text" :class="{'readonly':readonly}">
      <template v-if="!buttonDisabled">
        <b-link class="via-input-button" href="javascript:;" v-show="!buttonInactive" @click="onButtonClick">{{buttonText}} </b-link>
        <b-link class="via-input-button2" href="javascript:;" v-show="buttonInactive">{{buttonText2}}</b-link>
      </template>
    </div>
    <span :class="['via-input-label',{inputed:inputed},stateClass]">{{placeholder}}</span>
    <p class="via-input-error">{{error}}</p>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    value: {
      default: null,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    error: {
      type: String,
      required: false,
      default: '',
    },
    state: {
      // true/'valid', false/'invalid', '',null
      type: [Boolean, String],
      default: null,
    },
    formatter: {
      type: Function,
    },
    lazyFormatter: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: [String, Number],
      required: false,
      default: '',
    },
    autofocus: {
      type: [String, Boolean],
    },

    buttonDisabled: {
      type: Boolean,
      default: true,
    },

    buttonInactive: {
      type: Boolean,
      default: false,
    },

    leftDropdown: {
      type: Boolean,
      default: false,
    },

    buttonText: {
      type: String,
      default: '',
    },
    buttonText2: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      focused: false,
      localValue: this.value,
    }
  },

  computed: {
    inputed() {
      return this.focused || !!this.localValue
    },
    computedState() {
      const state = this.state
      if (state === true || state === 'valid') {
        return true
      } else if (state === false || state === 'invalid') {
        return false
      }
      return null
    },
    stateClass() {
      const state = this.computedState
      if (state === true) {
        return 'is-valid'
      } else if (state === false) {
        return 'is-invalid'
      }
      return null
    },
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.localValue = newVal
      }
    },
    localValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal)
      }
    },
  },

  methods: {
    format(value, e) {
      if (this.formatter) {
        const formattedValue = this.formatter(value, e)
        if (formattedValue !== value) {
          return formattedValue
        }
      }
      return value
    },
    onFocus(e) {
      this.tempFocused = true
      this.focused = true
      this.$emit('focus', this.localValue)
    },
    onBlur(e) {
      this.tempFocused = false
      setTimeout(() => {
        if (!this.tempFocused) {
          this.focused = false
        }
      }, 100)
      this.$emit('blur', this.localValue)
    },
    onInput(e) {
      const value = e.target.value
      if (!this.lazyFormatter) {
        this.localValue = this.format(value, e)
      }
    },
    onChange(e) {
      const value = e.target.value
      this.localValue = this.format(value, e)
      this.$emit('change', this.localValue)
    },
    onButtonClick() {
      this.$emit('button-click', true)
    },
  },

}
</script>

<style lang="scss">

.via-input-container {
  position: relative;
  width:100%;
  height: 70px;

  .via-input-label {
    pointer-events: none;
    position: absolute;
    top: 16px;
    left:0;
    line-height: 32px;
    text-align: left;
    font-size: 16px;
    color: #6f6f6f;
    transition: .2s ease-in-out all;

    &.inputed {
      top: 0;
      font-size: 12px;
      line-height: 17px;
      color: #6f6f6f;
    }
  }

  .via-input-wrapper {
    padding-top: 15px;
    position: relative;
    width:100%;
    height: 50px;
  }

  .via-input-text {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0;
    border-bottom: solid 1px #dedede;
    vertical-align: bottom;
    line-height: 32px;
    font-size: 16px;
    color: #6f6f6f;
    &.readonly{
      color:#C3C3C3; 
    }
  }

  .via-input-button {
    position: absolute;
    right: 0;
    height: 22px;
    font-size: 16px;
    color: #52cbca;
    bottom: 8px;
  }

  .via-input-button2 {
    position: absolute;
    right: 0;
    height: 20px;
    font-size: 14px;
    color: #6f6f6f;
    bottom: 8px;
  }

  .via-input-error {
    height: 17px;
    font-size: 12px;
    line-height: 17px;
    color: #e45555;
    text-align: left;
  }
}
</style>
