<template>
  <div class="page-wallet">
    <c-block style="min-height: 240px;">
      <div class="float-left asset-info">
        <p style="color: #192330;font-size: 18px;">总资产估值</p>
        <p style="height: 40px;display: block;margin-top: 40px;color: #192330;" >
          <span style="font-size:24px;">
            {{ totalBalance | formatMoney }} CNY
          </span>
        </p>
        <div style="color: #192330;">
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
        <p style="font-size: 14px;color: #6f6f6f;white-space: nowrap;margin-top:36px;">
          <span>实时汇率：</span>
          2341234
        </p>
      </div>
      <div class="float-right" style="position:relative;">
        <div class="pie-chart-container" v-if="showPieChart">
          <fund-pie :datas="pieDatas" :asset="defaultAsset" name="市场份额"></fund-pie>
        </div>
      </div>
    </c-block>
    <div class="row-header" style="padding-bottom:15px;">
      <span>资产结构</span>
    </div>
    <c-block style="padding: 0;">
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
          <span style="display: inline-block;width: 30px;"></span>
          <b-link @click="onShowTransferModal('out', item)">转出</b-link>
        </template>
      </b-table>
    </c-block>
    <div class="row-header" style="padding-bottom:15px;">
      <span>资产流水</span>
      <div class="float-right">
        <div style="display: inline-block;" ><span style="font-size: 12px;">币种：</span><b-form-select style="width: 100px;" v-model="filterCoin" :options="coinOptions" @change="onFilterHistory"></b-form-select></div>
        <div style="display: inline-block;margin-left: 30px;"><span style="font-size: 12px;">流水类型：</span><b-form-select style="width: 100px;" v-model="filterOperationType" :options="operationOptions" @change="onFilterHistory"></b-form-select></div>
      </div>
    </div>
    <c-block style="padding: 0;">
      <b-table :fields="assetsHistoryFields" :items="assetHistoryItems">
        <template slot="amount" slot-scope="{ item }">
          {{ item.amount | formatMoney }}
        </template>
        <template slot="total" slot-scope="{ item }">
          {{ item.total | formatMoney }}
        </template>
      </b-table>
      <b-pagination :total-rows="assetHistoryPage.totalRows" v-model="assetHistoryPage.currentPage" :per-page="assetHistoryPage.perPage"></b-pagination>
    </c-block>

    <b-modal title="资金划转" v-model="showTransferModal" hide-footer no-close-on-backdrop>
      <b-form>
        <b-form-group label="选择币种" horizontal>
          <b-form-select v-model="form.coinType" :options="coinOptions"></b-form-select>
        </b-form-group>
        <b-form-group label="从" horizontal>
          <b-form-select v-model="form.from" :options="walletOptions" @change="onSwap"></b-form-select>
        </b-form-group>
        <b-form-group label="划转至" horizontal>
          <b-form-select v-model="form.to" :options="walletOptions" @change="onSwap"></b-form-select>
        </b-form-group>
        <b-form-group label="划转数量" horizontal>
            <ExtendedInputNumber v-model="form.amount" :min="0" :max="+availableAmount" class="amount-input" />
        </b-form-group>
        <b-form-group horizontal>
          <div class="amount-available">
            <span>可转数量：</span>
            <span>{{ availableAmount | formatMoney }}</span>
            <b-link class="float-right" @click="onshowHand">全部划转</b-link>
          </div>
        </b-form-group>
        <div style="width: 280px;height: 44px;margin: 0 auto;">
          <b-btn type="button" variant="gradient-yellow" style="width: 100%;height: 100%;border-radius: 100px;">提交</b-btn>
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
  import { mapState } from 'vuex'

  const limit = 10

  export default {
    data() {
      return {
        filterOperationType: 'all',
        operationOptions: [{
          value: 'all',
          text: '全部',
        }, {
          value: 'payout',
          text: '支出',
        }, {
          value: 'income',
          text: '收入',
        }],
        assetHistoryPage: {},
        totalBalance: '0',
        showTransferModal: false,
        form: {
          coinType: 'BCH',
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
        filterCoin: 'BCH',
        coinOptions: [{
          value: 'BCH',
          text: 'BCH',
        }, {
          value: 'BTC',
          text: 'BTC',
        }, {
          value: 'EOS',
          text: 'EOS',
        }],
        defaultAsset: 'CNY',
        availableAmount: '0',
        pieDatas: [],
        showPieChart: true,
        showCoinDropdown: false,
        totalCoin: '-',
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
            thClass: [ 'text-left' ],
            tdClass: [ 'text-left', 'td-pl' ],
          },
          total: {
            label: '总额',
            thStyle: {
              width: '250px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          frozen: {
            label: '冻结',
            thStyle: {
              width: '250px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          available: {
            label: '可用',
            thStyle: {
              width: '250px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          action: {
            label: '与主站资金划转',
            tdClass: [ 'text-center' ],
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
            thClass: [ 'text-left' ],
            tdClass: [ 'text-left', 'td-pl' ],
          },
          create_time: {
            label: '时间',
            thStyle: {
              width: '250px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          operation_type: {
            label: '流水类型',
            thStyle: {
              width: '250px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          amount: {
            label: '金额数量',
            thStyle: {
              width: '250px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          total: {
            label: '余额',
            tdClass: [ 'text-center' ],
            thStyle: {
              textAlign: 'center',
            },
            sortable: false,
          },
        },
      }
    },
    async fetch({ store }) {
      await store.dispatch('fetchOtcBalance')
      await store.dispatch('fetchCoinexBalance')
    },
    async asyncData({ app, query, req, error, store }) {
      const [ historyData ] = await Promise.all([
        app.axios.balance.history({ page: 1, limit }),
      ])
      let assetHistoryItems = []
      let assetHistoryPage = {
        currentPage: 0,
        totalRows: 0,
        perPage: 0,
      }
      if (historyData.code === 0 && historyData.data) {
        const { data, curr_page: currentPage, total: totalRows } = historyData.data
        assetHistoryPage = {
          currentPage,
          totalRows,
          perPage: limit,
        }
        assetHistoryItems = data.map(item => {
          return {
            ...item,
            create_time: app.utils.getTimeText(item.create_time),
          }
        })
      }

      return {
        assetHistoryItems,
        assetHistoryPage,
      }
    },
    components: {
      cBlock,
      FundPie,
      Blank,
      ExtendedInputNumber,
    },
    computed: {
      ...mapState(['balance']),
      otcBalance() {
        if (this.balance.otcBalance) {
          const pieDatas = []
          let totalBalance = 0
          this.balance.otcBalance.forEach((item, index) => {
            pieDatas.push({
              name: item.coin_type,
              y: +item.total,
              colorIndex: index,
              virtual: false,
            })
            totalBalance += (+item.total)
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
    },
    methods: {
      onInputAmount(val) {
        this.form.amount = val
      },
      onFilterHistory() {
        this.fetchBalanceHistory({
          coin_type: this.filterCoin,
          side: this.filterOperationType,
          page: this.assetHistoryPage.currentPage,
          limit,
        })
      },
      fetchBalanceHistory(query = { page: 1, limit }) {
        this.axios.balance.history({
          page: 1,
          limit,
        }).then(historyData => {
          if (historyData.code === 0 && historyData.data) {
            const { data, curr_page: currentPage, total: totalRows } = historyData.data
            this.assetHistoryPage = {
              currentPage,
              totalRows,
              perPage: limit,
            }
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
      },
      onShowTransferModal(type, item) {
        const { coin_type: coinType } = item
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
        this.availableAmount = fromBalance ? fromBalance.available : '0'
        this.showTransferModal = true
      },
    },
  }
</script>

<style lang="scss">
  .page-wallet {
    .asset-info {
      position: absolute;
      z-index: 9;
    }
    .order-menu {
      display: inline-block;
      position: relative;
      user-select: none;
      .menu-container{
        position: absolute;
        top: -20px;
        left: 22px;
        padding-top: 30px;

        &.en_US{
          left: 0px;
        }
      }
      .list-menu{
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
        &::after{
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
  }
</style>
