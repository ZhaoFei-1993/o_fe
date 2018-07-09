<style lang="scss">
  @import "~assets/scss/variables.scss";

  .page-index {
    .announcement-bar {
      width: 100%;
      height: 40px;
      background-color: #fffcf6;
      .container {
        height: 100%;
        position: relative;
      }
      .announcement-title {
        color: $brandYellow;
        margin-left: 1rem;
        padding: 0 10px;
        &:not(:last-of-type) {
          border-right: 1px solid $brandYellow;
        }
      }
      .more {
        position: absolute;
        right: 0;
        color: $brandYellow;
      }
    }
    .layout-content {
      width: 1200px;
      margin: 40px auto;
      position: relative;
      .trade-choices {
        margin-bottom: 20px;
        .choice-block {
          background-color: white;
          box-shadow: 0 0 10px 0 #ececec;
          text-align: center;
          .direction {
            border-bottom: 1px solid #eeeeee;
            height: 50px;
            line-height: 50px;
            color: $brandYellow;
            font-size: 22px;
          }
          .coin-types {
            height: 50px;
            padding-top: 10px;
            .coin-type {
              line-height: 40px;
              margin: 0 10px;
              width: 80px;
              display: inline-block;
              cursor: pointer;
            }
          }
          &.active {
            .coin-type.active {
              border-bottom: 2px solid $brandYellow;
            }
          }
          &.sell {
            .direction {
              color: $brandGreen;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="page-index">
    <div class="announcement-bar">
      <div class="container d-flex align-items-center">
        <span><i class="iconfont icon-announcement"></i>公告:</span>
        <span class="announcement-title">公告1</span>
        <span class="announcement-title">公告2</span>
        <span class="announcement-title">公告3</span>
        <b-link class="more" href="#">更多 &gt;</b-link>
      </div>
    </div>
    <div class="layout-content">
      <div class="trade-choices row">
        <div class="col-6">
          <div :class="['choice-block buy', {active:'buy'===selectedDirection}]">
            <div class="direction">购买</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems('buy',coin)">{{coin}}</span>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div :class="['choice-block sell', {active:'sell'===selectedDirection}]">
            <div class="direction">出售</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems('sell',coin)">{{coin}}</span>
            </div>
          </div>
        </div>
      </div>
      <CBlock>
        <div v-for="item in items">
          {{item.id}}
        </div>
      </CBlock>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    components: {},
    layout: 'fullwidth',
    data() {
      return {
        message: 'Hello OTC',
        selectedCoin: 'BTC',
        selectedDirection: 'buy',
        items: [],
      }
    },
    computed: {
      ...mapState(['constant']),
    },
    beforeMount() {
      this.initItems()
    },
    methods: {
      showItems(direction, coin) {
        this.selectedDirection = direction
        this.selectedCoin = coin
        this.$router.replace({
          query: {
            direction,
            coin,
          },
        })
      },
      initItems() {
        this.axios.item.getItems({direction: this.selectedDirection, coin: this.selectedCoin}).then(response => {
          console.log(response)
          this.items = response.data.data.slice(0, 30)
        })
      },
    },
  }
</script>
