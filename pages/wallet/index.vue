<template>
  <div class="page-wallet">
    <c-block style="min-height: 240px;">
      <div class="float-left asset-info">
        <p class="total">总资产估值</p>
        <p class="total-tips">
          <span style="font-size:24px;">
            {{ totalBalance | formatMoney }} CNY
          </span>
        </p>
        <div class="total-coin">
          <span> ≈ {{ totalCoin }}</span>
          <div class="order-menu" @mouseover="toggleDropdown(true)" @mouseout="toggleDropdown(false)">
            <div class="menu-select-wrapper">
              <span class="menu-select-label">{{ selectedCoin }}</span>
            </div>
            <div class="menu-container" v-show="showCoinDropdown">
              <div class="list-menu">
                <div v-for="(item, index) in priceCoins" :key="index" @click="onChangePriceCoin(index)">
                  <div class="order-menu-item">{{item}}</div>
                  <div v-if="index < priceCoins.length - 1" class="order-separator"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="rate">
          <span>实时汇率：</span>
          <span>{{selectedCoin}}/{{balance.currentCash}}={{ balance.currentRate[selectedCoin] }}</span>
        </p>
      </div>
      <div class="float-right ps-r">
        <div class="pie-chart-container" v-if="showPieChart">
          <fund-pie :datas="pieDatas" :asset="defaultAsset" name="市场份额"></fund-pie>
        </div>
      </div>
    </c-block>
    <div class="row-header">
      <span>资产结构</span>
    </div>
    <c-block class="no-padding">
      <b-table :fields="assetsTableFields" :items="otcBalance">
        <template slot="available" slot-scope="{ item }">
          {{ item.available | formatMoney }}
        </template>
        <template slot="frozen" slot-scope="{ item }">
          {{ item.frozen | formatMoney }}
        </template>
        <template slot="total" slot-scope="{ item }">
          {{ item.total | formatMoney }}
        </template>
        <template slot="action" slot-scope="{ item }">
          <b-link @click="onShowTransferModal('in', item)">转入</b-link>
          <span class="space-margin"></span>
          <b-link @click="onShowTransferModal('out', item)">转出</b-link>
        </template>
      </b-table>
      <blank v-if="!otcBalance.length"></blank>
    </c-block>
    <div class="row-header">
      <span>资产流水</span>
      <div class="float-right">
        <div style="display: inline-block;" >
          <span style="font-size: 12px;">币种：</span>
          <b-form-select style="width: 100px;"
            v-model="historyQueryParams.coin_type"
            :options="[{ text: '全部', value: null }, ...constant.COIN_TYPE_OPTIONS]">
          </b-form-select>
        </div>
        <div style="display: inline-block;margin-left: 30px;">
          <span style="font-size: 12px;">流水类型：</span>
          <b-form-select style="width: 100px;"
            v-model="historyQueryParams.side"
            :options="operationOptions">
          </b-form-select>
        </div>
      </div>
    </div>
    <c-block class="no-padding">
      <b-table :fields="assetsHistoryFields" :items="assetHistoryItems">
        <template slot="amount" slot-scope="{ item }">
          {{ item.amount | formatMoney }}
        </template>
        <template slot="total" slot-scope="{ item }">
          {{ item.total | formatMoney }}
        </template>
      </b-table>
      <blank v-if="!assetHistoryItems.length"></blank>
      <b-pagination v-if="assetHistoryItems.length" :total-rows="historyQueryParams.totalRows"
                    v-model="historyQueryParams.page"
                    :per-page="historyQueryParams.limit"></b-pagination>
    </c-block>

    <b-modal title="资金划转" v-model="showTransferModal" hide-footer no-close-on-backdrop>
      <b-form>
        <b-form-group label="选择币种" horizontal>
          <b-form-select v-model="form.coinType" :options="constant.COIN_TYPE_OPTIONS"></b-form-select>
        </b-form-group>
        <b-form-group label="从" horizontal>
          <b-form-select v-model="form.from" :options="walletOptions" @change="onSwap"></b-form-select>
        </b-form-group>
        <b-form-group label="划转至" horizontal>
          <b-form-select v-model="form.to" :options="walletOptions" @change="onSwap"></b-form-select>
        </b-form-group>
        <b-form-group label="划转数量" horizontal>
          <ExtendedInputNumber v-model="form.amount" :min="0" :max="+availableAmount" class="amount-input"/>
        </b-form-group>
        <b-form-group horizontal>
          <div class="amount-available">
            <span>可转数量：</span>
            <span>{{ availableAmount | formatMoney }}</span>
            <b-link class="float-right" @click="onshowHand">全部划转</b-link>
          </div>
        </b-form-group>
        <div class="submit-btn-wrapper">
          <b-btn type="button" variant="gradient-yellow" class="submit-btn" @click="onTransfer">提交
          </b-btn>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
  import ExtendedInputNumber from '~/components/extended-input-number'
  import cBlock from '~/components/c-block'
  import Blank from '~/components/blank'
  import FundPie from './_c/fund-pie'
  import {mapState} from 'vuex'

  // 每页条数
  const limit = 10

  export default {
    data() {
      return {
        bussinessTypeMap: { // 流水类型映射
          buy_order: '购买',
          sell_order: '出售',
          transfer_in: '转入',
          transfer_out: '转出',
          transfer_return: '转出失败退还',
        },
        totalBalance: 0,
        showTransferModal: false,
        form: {
          coinType: 'USDT',
          from: 'otc',
          to: 'coinex',
          amount: 0,
        },
        walletOptions: [{
          value: 'otc',
          text: 'OTC钱包',
        }, {
          value: 'coinex',
          text: '交易所钱包',
        }],
        historyFilterCoin: null,
        defaultAsset: 'CNY',
        availableAmount: 0, // 资金可转数量
        pieDatas: [],
        showPieChart: true,
        showCoinDropdown: false,
        totalCoin: 0,
        selectedCoin: 'BCH',
        priceCoins: ['BCH', 'BTC', 'ETH', 'USDT'],
        assetsTableFields: {
          coin_type: {
            label: '币种',
            sortable: false,
            thStyle: {
              width: '110px',
              paddingLeft: '28px',
            },
            thClass: ['text-left'],
            tdClass: ['text-left', 'td-pl'],
          },
          total: {
            label: '总额',
            thStyle: {
              width: '250px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          frozen: {
            label: '冻结',
            thStyle: {
              width: '250px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          available: {
            label: '可用',
            thStyle: {
              width: '250px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          action: {
            label: '与主站资金划转',
            tdClass: ['text-center'],
            thStyle: {
              textAlign: 'center',
            },
            sortable: false,
          },
        },
        assetHistoryItems: [],
        assetsHistoryFields: {
          coin_type: {
            label: '币种',
            sortable: false,
            thStyle: {
              width: '110px',
              paddingLeft: '28px',
            },
            thClass: ['text-left'],
            tdClass: ['text-left', 'td-pl'],
          },
          create_time: {
            label: '时间',
            thStyle: {
              width: '250px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          operation_type: {
            label: '流水类型',
            thStyle: {
              width: '250px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          amount: {
            label: '金额数量',
            thStyle: {
              width: '250px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          total: {
            label: '余额',
            tdClass: ['text-center'],
            thStyle: {
              textAlign: 'center',
            },
            sortable: false,
          },
        },
        historyQueryParams: {}, // 流水接口请求参数
        curAssetItem: null, // 当前点击`转入``转出`的资产项目
      }
    },
    fetch({store}) {
     return Promise.all([
       store.dispatch('fetchOtcBalance'),
       store.dispatch('fetchCoinexBalance'),
       store.dispatch('fetchExchangeRate'),
     ])
    },
    async asyncData({ app, query, req, error, store }) {
      const [ historyData ] = await Promise.all([
        app.axios.balance.history({ page: 1, limit }),
      ])
    },
    async asyncData({app, req, redirect, route}) {
      try {
        const historyQueryParams = {
          coin_type: null,
          side: null,
          page: 1,
          total: 0,
          limit,
        }
        app.axios.init(req)
        // 获取资产流水
        const historyData = await app.axios.balance.history(historyQueryParams)
        let assetHistoryItems = []

        if (historyData.code === 0 && historyData.data) {
          const {data, curr_page: currentPage, total: totalRows} = historyData.data

          historyQueryParams.page = currentPage
          historyQueryParams.totalRows = totalRows

          assetHistoryItems = data.map(item => {
            return {
              ...item,
              create_time: app.utils.getTimeText(item.create_time),
            }
          })
        }

        return {
          historyQueryParams,
          assetHistoryItems,
        }
      } catch (err) {
        app.axios.needAuth(err, redirect, route.fullPath)
      }
    },
    components: {
      cBlock,
      FundPie,
      Blank,
      ExtendedInputNumber,
    },
    computed: {
      ...mapState(['balance', 'constant']),
      otcBalance() {
        if (this.balance.otcBalance) {
          const pieDatas = []
          let totalBalance = 0
          this.balance.otcBalance.forEach((item, index) => {
            if (item.total > 0) {
              pieDatas.push({
                name: item.coin_type,
                y: +item.total,
                colorIndex: index,
                virtual: false,
              })
              totalBalance += (+item.total)
            }
          })
          this.pieDatas = pieDatas
          this.totalBalance = `${totalBalance}`
          return this.balance.otcBalance
        }
        return []
      },
      coinexBalance() {
        if (this.balance.coinexBalance) {
          return this.balance.coinexBalance
        }
        return []
      },
      operationOptions() {
        return [{text: '全部', value: null}, ...Object.keys(this.bussinessTypeMap).map(key => {
          return {
            text: this.bussinessTypeMap[key],
            value: key,
          }
        })]
      }
    },
    watch: {
      'historyQueryParams.coin_type'() {
        this.fetchBalanceHistory()
      },
      'historyQueryParams.side'() {
        this.fetchBalanceHistory()
      },
      'historyQueryParams.page'() {
        this.fetchBalanceHistory()
      },
    },
    methods: {
      onTransfer() {
        const {amount} = this.form
        if (amount > 0) {
          if (!this.form.submitting) {
            this.form.submitting = true
            this.axios.balance[`${this.form.from}2${this.form.to}`]({
              coin_type: this.form.coinType,
              amount: this.form.amount,
            })
              .then(res => {
                if (res.code === 0) {
                  this.$successTips('划转成功')
                  this.showTransferModal = false
                }
              })
              .catch(err => {
                this.$errorTips(`划转失败${err}`)
              })
              .finally(() => {
                this.form.submitting = false
              })
          }
        }
      },
      fetchBalanceHistory() {
        const {page, limit, coin_type: coinType, side} = this.historyQueryParams
        const query = {
          page,
          limit,
        coin_type: coinType,
      side,
       }
        this.axios.balance.history(query).then(historyData => {
          if (historyData.code === 0 && historyData.data) {
            const {data, curr_page: currentPage, total: totalRows} = historyData.data
            this.historyQueryParams.page = currentPage
            this.historyQueryParams.totalRows = totalRows
            this.assetHistoryItems = data.map(item => {
              return {
                ...item,
                create_time: this.utils.getTimeText(item.create_time),
              }
            })
          }
        })
      },
      toggleDropdown(val) {
        this.showCoinDropdown = !!val
      },
      onChangePriceCoin(index) {
        this.totalCoin = 1234235
        this.selectedCoin = this.priceCoins[index]
        this.showCoinDropdown = false
      },
      onshowHand() {
        this.form.amount = this.availableAmount
      },
      onSwap() {
        const tmp = this.form.from
        this.form.from = this.form.to
        this.form.to = tmp

        const {coin_type: coinType} = this.curAssetItem
        const fromBalance = this[`${this.form.from}Balance`].find(item => {
          return item.coin_type === coinType
        })
        this.availableAmount = fromBalance ? fromBalance.available : 0
        this.form.amount = 0
      },
      onShowTransferModal(type, item) {
        const {coin_type: coinType} = item
        if (type === 'in') {
          this.form.from = 'coinex'
          this.form.to = 'otc'
        } else if (type === 'out') {
          this.form.from = 'otc'
          this.form.to = 'coinex'
        }
        const fromBalance = this[`${this.form.from}Balance`].find(item => {
          return item.coin_type === coinType
        })
        this.availableAmount = fromBalance ? fromBalance.available : 0
        this.showTransferModal = true
        this.curAssetItem = item
      },
    },
  }
</script>

<style lang="scss">
  .page-wallet {
    .total {
      color: #192330;
      font-size: 18px;
    }
    .total-coin {
      color: #192330;
    }
    .total-tips {
      height: 40px;
      display: block;
      margin-top: 40px;
      color: #192330;
    }
    .asset-info {
      position: absolute;
      z-index: 9;
    }
    .order-menu {
      display: inline-block;
      position: relative;
      user-select: none;
      .menu-container {
        position: absolute;
        top: -20px;
        left: 22px;
        padding-top: 30px;

        &.en_US {
          left: 0px;
        }
      }
      .list-menu {
        transform: translate3d(-31px, 14px, 0px);
        z-index: 9999;
        will-change: transform;
        border-radius: 0;
        min-width: 110px;
        height: auto;
        padding: 0;
        background-clip: border-box;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
      }

      .menu-select-label {
        text-align: right;
        margin-right: 9px;
        margin-left: 9px;
        cursor: pointer;
      }

      .menu-select-wrapper {
        cursor: pointer;
        &::after {
          display: inline-block;
          width: 0;
          height: 0;
          margin-left: -4px;
          vertical-align: 4px;
          content: "";
          border-top: 4px solid;
          border-right: 4px solid transparent;
          border-left: 4px solid transparent;
        }
      }

      .menu-separator {
        height: 0;
        overflow: hidden;
        border-top: 1px solid #e9ecef;
      }

      .order-separator {
        height: 0;
        overflow: hidden;
        border-top: 1px solid #e9ecef;
      }

      .order-menu-item {
        z-index: 9999;
        color: #6f6f6f;
        font-size: 14px;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        padding: 0 20px;
        text-align: left;
        cursor: pointer;

        &:hover {
          color: #52cbca;
        }
      }
    }
    .row-header {
      padding: 36px 0 20px;
      font-size: 18px;
      text-align: left;
      color: #192330;
      padding-bottom: 15px;
    }
    .td-pl {
      padding-left: 28px;
    }
    .amount-input {
      height: 100%;
    }
    .amount-available {
      font-size: 14px;
      color: #192330;
    }
    .no-padding {
      padding: 0;
    }
    .rate {
      font-size: 14px;
      color: #6f6f6f;
      white-space: nowrap;
      margin-top: 36px;
    }
    .submit-btn-wrapper {
      width: 280px;
      height: 44px;
      margin: 0 auto;
    }
    .submit-btn {
      width: 100%;
      height: 100%;
      border-radius: 100px;
    }
    .space-margin {
      display: inline-block;
      width: 30px;
    }
  }
</style>
