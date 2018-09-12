<template>
  <div class="time-selector-wrapper" v-click-outside="hide">
    <div class="time-selector-label" @click="showSelector = !showSelector">
      <div class="time-selector-selected">{{ selectedValue }}</div>
      <div class="time-selector-arrow"><i class="iconfont icon-icon_drop_down_arrow"></i></div>
    </div>
    <div class="time-selector-dropdown-wrapper" v-show="showSelector">
      <ul>
        <li v-for="(option, index) in options" @click="onClickDropdown({index, option})" class="time-selector-dropdown-item"
            :class="{'time-selector-dropdown-item-active': option.active}">
          <span class="time-selector-dropdown-item-placeholder">
            <i class="iconfont icon-tick" v-show="option.active"></i>
          </span>
          <span>{{ option.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import ClickOutside from 'vue-click-outside'

  export default {
    props: {
      options: {
        type: Array,
        default: [],
      },
      type: { // 下拉框类型，为了区分开始时间 or 结束时间
        type: String,
        default: '',
      },
      beforeClick: { // 改变下拉项前的检查钩子，返回true才勾选
        type: Function,
        default: () => {
          return true
        },
      },
    },
    directives: {
      ClickOutside,
    },
    data() {
      return {
        showSelector: false,
        activeId: 0,
      }
    },
    computed: {
      selectedValue: {
        get() {
          if (this.options.length) {
            for (let i = 0, len = this.options.length; i < len; i++) {
              const item = this.options[i]
              if (item.active) {
                this.activeId = i
                return item.text
              }
            }
          }
          return ''
        },
        set() {},
      },
    },
    methods: {
      hide() {
        this.showSelector = false
      },
      onClickDropdown({index, option}) {
        this.showSelector = false
        if (this.activeId === index) return // 重复点击同一个item不触发事件

        if (this.beforeClick(option, this.type)) {
          this.activeId = index
          this.options.forEach((item, id) => {
            if (this.activeId === id) {
              item.active = true
            } else {
              item.active = false
            }
          })
          this.selectedValue = option.value
          this.$emit('click', option, this.type)
        }
      },
    },
  }
</script>

<style lang="scss">
  .time-selector-wrapper {
    display: inline-block;
    position: relative;
    .time-selector-label {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 90px;
      height: 30px;
      border: 1px solid #dddddd;
      cursor: pointer;
      color: #52cbca;
      font-size: 14px;
      .time-selector-arrow {
        color: #192330;
      }
      .time-selector-selected {
        margin-left: 14px;
      }
    }
    .time-selector-dropdown-wrapper {
      display: block;
      position: absolute;
      left: 50%;
      width: 90px;
      box-shadow: 0 0 20px 0 #ececec;
      background-color: #fff;
      transform: translate3d(-50%, 0, 0);
      z-index: 1;
      ul {
        max-height: 180px;
        overflow-y: scroll;
      }
      .time-selector-dropdown-item {
        cursor: pointer;
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding-left: 9px;
        text-align: left;
        color: #192330;
        font-size: 12px;
        &:hover {
          background-color: #f9f9f9;
        }
        .time-selector-dropdown-item-placeholder {
          display: inline-block;
          width: 16px;
          height: 16px;
          line-height: 16px;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #e9ecef;
        }
      }
      .time-selector-dropdown-item-active {
        color: #52cbca;
      }
    }
  }
</style>
