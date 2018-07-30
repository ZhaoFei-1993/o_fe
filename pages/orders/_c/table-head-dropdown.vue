<template>
  <div class="th-filter">
    <span style="cursor: pointer;" @click="showSideType = !showSideType"><span>{{ title }}</span><i class="iconfont icon-arrowdown"></i></span>
    <div class="filter-dropdown-wrapper" v-show="showSideType">
      <ul>
        <li @click="onClickDropdown({index, option})" v-for="(option, index) in options" class="filter-dropdown-item" :class="{'filter-dropdown-item-active': option.active}">
          <span class="filter-dropdown-item-placeholder"><i class="iconfont icon-tick" v-show="option.active"></i></span>
          <span>{{ option.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      options: {
        type: Array,
        default: [],
      },
      label: {
        type: String,
        default: '',
      },
      onClick: {
        type: Function,
        default: () => {},
      },
    },
    data() {
      return {
        showSideType: false,
        title: '',
        activeId: 0,
      }
    },
    mounted() {
      this.title = this.label
    },
    methods: {
      onClickDropdown({ index, option }) {
        this.showSideType = false
        if (this.activeId === index) return // 重复点击同一个item不触发事件

        this.activeId = index
        this.options.forEach((item, id) => {
          if (this.activeId === id) {
            item.active = true
          } else {
            item.active = false
          }
        })
        if (option.value === null) {
          this.title = this.label
        } else {
          this.title = option.text
        }
        this.$emit('click', option)
      },
    },
  }
</script>

<style lang="scss">
  .th-filter {
    position: relative;
    .filter-dropdown-wrapper {
      display: block;
      position: absolute;
      top: 45px;
      left: 50%;
      width: 80px;
      box-shadow: 0 0 20px 0 #ececec;
      background-color: #fff;
      transform: translate3d(-50%, 0, 0);
      .filter-dropdown-item {
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
        .filter-dropdown-item-placeholder {
          display: inline-block;
          width: 16px;
          height: 16px;
          line-height: 16px;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #e9ecef;
        }
      }
      .filter-dropdown-item-active {
        color: #52cbca;
      }
    }
  }
</style>
