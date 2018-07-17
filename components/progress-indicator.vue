<!--订单状态的指示器-->
<style lang="scss">
  @import "~assets/scss/variables.scss";

  .progress-indicator-container {
    min-height: 100px;
    /*padding-bottom: 40px;*/
    display: flex;
    flex-direction: column;
    justify-content: center;

    .order-progress-indicator {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin: 0 auto;
      width: 940px;
    }

    .order-progress-item {
      flex: 1 1 0;
      text-align: center;
      /*color: #acacac;*/

      &._blank { // 完全没有激活的状态，特殊处理为黑色
        color: $dark;
      }

      &._passed {
        color: $dark;

        .order-progress-dot {
          background-color: $brandYellow;
        }

        .order-progress-line-before,
        .order-progress-line-after {
          border-color: $brandYellow;
        }
      }

      &._active {
        color: $dark;

        .order-progress-dot {
          background-color: #ffffff;
          border: solid 2px $brandYellow;
        }

        .order-progress-line-before {
          border-color: $brandYellow;
        }
      }

      &:first-child .order-progress-line-before,
      &:last-child .order-progress-line-after {
        border-color: transparent;
      }
    }

    .order-progress-time {
      margin-bottom: 20px;
      font-size: 12px;
      color: #acacac;
    }

    .order-progress-line {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .order-progress-line-before,
    .order-progress-line-after {
      flex: 1 1 0;
      height: 0;
      border: solid 1px #eeeeee;
    }

    .order-progress-line-after {

    }

    .order-progress-dot {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: #d8d8d8;
    }
  }
</style>

<template>
  <div class="progress-indicator-container">
    <slot name="prepend"/>
    <div class="order-progress-indicator">
      <div v-for="(item, index) in progress"
           class="order-progress-item"
           :class="{_passed: index < currentStep, _blank: active === -1}">
        <p class="order-progress-time">{{item.time}}</p>
        <div class="order-progress-line">
          <div class="order-progress-line-before"></div>
          <div class="order-progress-dot"></div>
          <div class="order-progress-line-after"></div>
        </div>
        <p>{{item.text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'order-progress-indicator',
    props: {
      // 当前激活的步骤，优先从order中拿数据，其次用active的数据
      active: {
        type: Number,         // -1代表没有激活
      },
      order: {
        type: Object
      },
      progressKey: {
        type: String,
        default: 'merchant'
      }       // 根据传入的key，来选择显示哪种progress，优先级最高
    },
    computed: {
      'progress': function () {
        return [
          {
            text: '完善信息',
          },
          {
            text: '提交认证视频',
          },
          {
            text: '缴纳保证金',
          },
          {
            text: '资料审核',
          },
        ]
      },

      // currentStep 表示当前的步骤
      'currentStep': function () {
        return this.active
      }
    }
  }
</script>
