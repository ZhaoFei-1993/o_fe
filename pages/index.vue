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
          display: flex;
          .side {
            height: 50px;
            line-height: 50px;
            width: 120px;
            color: white;
            background-image: linear-gradient(to left, #ffe070, #ffb900);
            font-size: 22px;
            i.iconfont {
              font-size: 22px;
              margin-right: 0.5rem;
            }
          }
          .coin-types {
            height: 50px;
            line-height: 50px;
            flex: 1;
            .coin-type {
              line-height: 50px;
              width: 80px;
              display: inline-block;
              cursor: pointer;
            }
          }
          &.active {
            .coin-type.active {
              border-bottom: 2px solid $brandYellow;
            }
            &.sell .coin-type.active {
              border-bottom: 2px solid $brandGreen;
            }
          }
          &.sell {
            .side {
              background-image: linear-gradient(to left, #22e6b8, #00c1ce);
            }
          }
        }
      }
      .items-list {
        box-shadow: 0 0 10px 0 #ececec;
        .list-title {
          display: flex;
          justify-content: space-between;
          padding: 24px 20px 8px;
          background-color: white;
          span:first-of-type {
            font-size: 18px;
          }
        }
        .list-header {
          padding: 0 20px;
          height: 40px;
          line-height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f9f9f9;
          .col-narrow, .col-wide {
            text-align: center;
          }
          .select-payment {
            height: 24px;
            border: 1px solid #dddddd;
          }
        }
        .list {
          &.sell .item-row:nth-of-type(even) {
            background-color: #fafffe;
          }
          .item-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: white;
            height: 90px;
            padding: 20px;
            &:nth-of-type(even) {
              background-color: #fffdfa;
            }
            .btn-order {
              width: 100px;
              height: 26px;
              border-radius: 100px;
              font-size: 14px;
              line-height: 22px;
            }
            .payment {
              i {
                margin: 0 4px;
              }
              .icon-bank {
                color: $brandYellow;
              }
              .icon-alipay {
                color: rgb(0, 174, 239);
              }
              .icon-wechat-round {
                color: rgb(89, 170, 0);
              }
            }
          }
        }

        .col-narrow {
          width: 12%;
          padding: 0 16px;
        }
        .col-wide {
          flex: 1;
          padding: 0 16px;
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
          <div :class="['choice-block buy', {active:'BUY'===selectedSide}]">
            <div class="side"><i class="iconfont icon-arrow-down"></i>购买</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems('BUY',coin)">{{coin}}</span>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div :class="['choice-block sell', {active:'SELL'===selectedSide}]">
            <div class="side"><i class="iconfont icon-arrow-up"></i>出售</div>
            <div class="coin-types">
              <span :class="['coin-type', {active:coin===selectedCoin}]" v-for="coin in constant.COIN_TYPES"
                    @click="showItems('SELL',coin)">{{coin}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="items-list">
        <div class="list-title">
          <span>广告列表</span>
          <span>没有合适的？<a href="/items/create">自己发布广告&gt;</a></span>
        </div>
        <div class="list-header">
          <span class="col-narrow">{{selectedSide==='BUY'?'卖家':'买家'}}</span>
          <span class="col-narrow">30天成单/完成率</span>
          <span class="col-narrow">数量</span>
          <span class="col-wide">限额</span>
          <b-form-select class='select-payment col-narrow' v-model="selectedPayment"
                         :options="constant.PAYMENT_OPTIONS"></b-form-select>
          <span :class="['sort-price col-wide',sortPrice]">单价</span>
          <span class="col-narrow">操作</span>
        </div>
        <div :class="['list',selectedSide.toLowerCase()]">
          <div class="item-row" v-for="item in items">
            <span class="col-narrow text-center fz-18 c-6f">{{item.user.name}}</span>
            <div class="col-narrow">
              <div class="fz-12 c-4a">1024单/50%</div>
              <div class="fz-12 c-6f">放行时间7分钟</div>
            </div>
            <span class="col-narrow text-right fz-12 c-6f">{{item.coin_amount+' '+selectedCoin}}</span>
            <span class="col-wide text-right pr-60 fz-12 c-6f">{{item.min_deal_cash_amount+ '-'+ item.max_deal_cash_amount + 'CNY'}}</span>
            <span class='payment col-narrow'>
              <i class="iconfont icon-bank"></i>
              <i class="iconfont icon-alipay"></i>
              <i class="iconfont icon-wechat-round"></i>
            </span>
            <span :class="['sort-price col-wide pr-60 text-right',sortPrice]">{{item.price + ' CNY'}}</span>
            <span class="col-narrow">
              <button
                :class="['btn btn-order',{'btn-outline-yellow':selectedSide==='BUY','btn-outline-green':selectedSide==='SELL'}]"
                @click="placeOrder(item)"
              >
              {{(selectedSide==='BUY'?'购买':'出售')+ selectedCoin}}
            </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <PlaceOrderModal
      v-if="selectedItem"
      :item="selectedItem"
      :balance="userBalance"
      v-model="showPlaceOrderModal"
    ></PlaceOrderModal>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import PlaceOrderModal from '~/components/place-order-modal'

  export default {
    components: {
      PlaceOrderModal,
    },
    layout: 'fullwidth',
    data() {
      return {
        message: 'Hello OTC',
        selectedCoin: this.$route.query.coin || 'BTC',
        selectedSide: this.$route.query.side || 'BUY',
        selectedPayment: this.$route.query.payment || 'ALL',
        sortPrice: this.$route.query.sort || this.selectedSide === 'BUY' ? 'ASC' : 'DESC',
        items: [],
        selectedItem: null,
        showPlaceOrderModal: false,
        busy: false,
        userBalance: {
          BTC: 1000,
          BCH: 1000,
          ETH: 1000,
          USDT: 1000,
        },
      }
    },
    computed: {
      ...mapState(['constant']),
    },
    beforeMount() {
      this.initItems()
    },
    methods: {
      showItems(side, coin) {
        this.selectedSide = side
        this.selectedCoin = coin
        this.$router.replace({
          query: {
            side,
            coin,
          },
        })
      },
      initItems() {
        this.busy = true
        this.axios.item.getItems({side: this.selectedSide, coin_type: this.selectedCoin}).then(response => {
          this.busy = false
          this.items = response.data.data.slice(0, 30)
        })
      },
      placeOrder(item) {
        this.selectedItem = item
        this.showPlaceOrderModal = true
        this.initItems()
      },
    },
  }
</script>
