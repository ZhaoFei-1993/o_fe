<template>
  <div class="selection-wrapper">
    <input
      type="text"
      :placeholder="placeholder"
      :name="randomInput"
      :disabled="disabled"
      class="form-control"
      v-model="customInput.name"
      ref="customInput"
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="selectCustomInput"
      @keydown.tab="tab"
      autocomplete="new-password"
      v-if="!selectedOption"
    />
    <div v-else :class="['fake-select',{disabled:disabled}]">
      <div class="option-text">{{selectedOption | translateName}}</div>
      <span v-if="!disabled" class="clear-option" title="清除选项" @click="selectOption(null)">
        <i class="iconfont icon-close"></i>
      </span>
    </div>

    <transition name="fade">
      <div
        class="select-options" v-show="!disabled && showOptions && options && options.length"
      >
        <ul>
          <li
            v-for="option in options"
            v-if="!(option.customInput && (!option.name || option.name.length === 0 || disableCustomOption) || filterMode && translateName(option).indexOf(customInput.name) < 0)"
            :class="{active:selectedOption && selectedOption[identifier]===option[identifier]}"
            @click.prevent="selectOption(option)"
          >
            {{option | translateName}}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  // TODO autocomplete
  // todo: 通过v-model双向同步数据
  export default {
    name: 'auto-complete-selection',
    data() {
      return {
        showOptions: false,
        customInput: {name: '', active: false, customInput: true},
        options: [],
        focused: false,
        randomInput: 'inexist-input' + parseInt(Math.random() * 10000),
        selectedOption: this.selectedId ? this.searchOptions.find(o => o[this.identifier] === this.selectedId) : null,
      }
    },
    computed: mapState(['lang']),
    mounted() {
      this.initOptions(this.searchOptions || [])
    },
    watch: {
      searchOptions(newValue) {
        this.initOptions(newValue)
      },
      selectedId: {
        immediate: true,
        handler(newValue) {
          if (!newValue) {
            this.selectedOption = null
            this.customInput.name = ''
          }
          if (this.searchOptions) {
            this.selectedOption = this.searchOptions.find(o => o[this.identifier] === newValue)
          } else {
            this.selectedOption = null
          }
        }
      },
      parentId() {
        this.customInput.name = ''
      }
    },
    props: {
      placeholder: {
        type: String,
        required: false,
        default: ''
      },
      searchOptions: {              // {name: '', value: ''}
        type: Array,
        required: false,
        default: []
      },
      selectedId: {},
      parentId: {},
      identifier: {
        type: String,
        default: 'id',
      },
      onSelect: {
        type: Function
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      filterMode: {
        type: Boolean,
        default: false,
      },
      disableCustomOption: {
        type: Boolean,
        default: false,
      }
    },
    methods: {
      selectOption(option) {
        if (this.disabled) {
          return
        }
        if (option && option[this.identifier]) {
          this.selectedOption = option
        } else {
          this.selectedOption = null
        }
        this.showOptions = false

        // todo:暂时两种方式共存，后面要只留事件形式的
        this.onSelect && this.onSelect(option)
        this.$emit('change', option)
      },
      onBlur() {
        this.showOptions = false
        this.focused = false
      },
      selectCustomInput(shouldCheckFocus) {
        this.showOptions = false
        // 本身不是focus的话就不用处理后面的东西了
        if (shouldCheckFocus && !this.focused) {
          return
        }
        // 清除focus状态，避免下次不自动出现选项
        this.$refs.customInput.blur()
        if (this.disableCustomOption) {
          return
        }
        if (!this.selectedOption && this.customInput.name && this.customInput.name.length) {
          this.selectOption(this.customInput)
        }
      },
      initOptions(ops) {
        this.options = ops
        this.selectedOption = ops.find(o => o[this.identifier] === this.selectedId)
      },
      onFocus() {
        this.showOptions = true
        this.focused = true
      },
      tab() {
        this.selectCustomInput()
      },
    }
  }
</script>
<style lang="scss" scoped>
  .selection-wrapper {
    position: relative;
    /*padding: 4px 0;*/
    // 这里为什么有padding了？todo
    input {
      height: 32px;
      background-color: transparent;
    }
    .fake-select {
      width: 100%;
      font-size: 1rem;
      line-height: 32px;
      height: 32px;
      color: #27313e;
      background-color: transparent;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-radius: 0;
      position: relative;
      padding-right: 24px;
      &.disabled {
        background-color: #eeeeee;
        color: #6c757d;
        border: none;
      }
      .option-text {
        padding: 0 0.5rem;
        overflow-x: auto;
        overflow-y: hidden;
        word-break: keep-all;
      }
      .clear-option {
        position: absolute;
        right: 4px;
        top: 4px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: #ffbc32;
        cursor: pointer;
        line-height: 22px;
        padding-left: 6px;
        .iconfont {
          font-size: 12px;
          font-weight: bold;
        }

      }
    }
    .select-options {
      position: absolute;
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
      top: 100%;
      left: 0;
      z-index: 10;
      background-color: white;
      box-shadow: 0 0 10px 0 #ececec;
      ul {
        li {
          padding: 10px 20px;
          position: relative;
          &:not(:first-child) {
            border-top: 1px solid #eeeeee;
          }
          &:hover {
            background-color: #ffbc32;
            color: white;
          }
          &.active:before {
            content: '✔';
            position: absolute;
            left: 4px;
            top: 10px;
            color: #ffbc32;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
