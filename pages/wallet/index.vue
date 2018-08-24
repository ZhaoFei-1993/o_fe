<template>
  <div class="page-content-container">
    <div class="page-wallet">
      <c-block style="min-height: 240px;">
        <div class="float-left asset-info">
          <p class="total">总资产估值</p>
          <p class="total-tips">
          <span style="font-size:24px;">
            {{ `${totalBalance}`.setDigit(2) }} CNY
          </span>
          </p>
          <div class="total-coin">
            <span> ≈ {{ `${totalCoin}`.setDigit(4) }}</span>
            <div class="order-menu" @mouseover="toggleDropdown(true)" @mouseout="toggleDropdown(false)">
              <div class="menu-select-wrapper">
                <span class="menu-select-label">{{ selectedCoin }}</span>
              </div>
              <div class="menu-container" v-show="showCoinDropdown">
                <div class="list-menu">
                  <div v-for="(item, index) in constant.COIN_TYPES" :key="index" @click="onChangePriceCoin(index)">
                    <div class="order-menu-item">{{item}}</div>
                    <div v-if="index < constant.COIN_TYPES.length - 1" class="order-separator"></div>
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
      <c-block class="p-0">
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
          <template slot="marketValue" slot-scope="{ item }">
            {{ item.marketValue | formatMoney }} CNY
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
          <div style="display: inline-block;">
            <span style="font-size: 12px;">币种：</span>
            <b-form-select class="history-filter-select"
                           v-model="historyQueryParams.coin_type"
                           :options="constant.COIN_TYPE_OPTIONS">
              <option slot="first" :value="null">不限</option>
            </b-form-select>
          </div>
          <div style="display: inline-block;margin-left: 30px;">
            <span style="font-size: 12px;">操作：</span>
            <b-form-select class="history-filter-select"
                           v-model="historyQueryParams.business_type"
                           :options="operationOptions">
              <option slot="first" :value="null">不限</option>
            </b-form-select>
          </div>
        </div>
      </div>
      <c-block class="p-0">
        <b-table :fields="assetsHistoryFields" :items="assetHistoryItems">
          <template slot="amount" slot-scope="{ item }">
            {{ item.amount | formatMoney }}
          </template>
          <template slot="total" slot-scope="{ item }">
            {{ item.total | formatMoney }}
          </template>
          <template slot="create_time" slot-scope="{ item }">
            {{ item.create_time | getTimeText }}
          </template>
        </b-table>
        <blank v-if="!assetHistoryItems.length"></blank>
        <ViaPagination v-if="assetHistoryItems.length"
                       :total-rows="historyQueryParams.totalRows"
                       :current-page="historyQueryParams.page"
                       @change="changePage"
                       :per-page="historyQueryParams.limit">
        </ViaPagination>
      </c-block>

      <b-modal title="资金划转" v-model="showTransferModal" hide-footer no-close-on-backdrop>
        <b-form>
          <b-form-group label="选择币种" horizontal>
            <b-form-select v-model="form.coinType" :options="walletCoinTypes"
                           @change="onChangeCoinType"></b-form-select>
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
              <span>{{ availableAmountShown | formatMoney }}</span>
              <span v-if="showTransferTooltip" class="ml-5 c-gray fz-12" v-b-tooltip.hover
                    title="存在充值未完全确认或挂单冻结的情况，部分金额无法划转"><i
                class="iconfont icon-tooltip"></i></span>
              <b-link class="float-right" @click="onShowhand">全部划转</b-link>
            </div>
          </b-form-group>
          <div class="submit-btn-wrapper">
            <b-btn type="button" variant="gradient-yellow" class="submit-btn" @click="onTransfer">提交</b-btn>
          </div>
        </b-form>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import ExtendedInputNumber from '~/components/extended-input-number'
  import cBlock from '~/components/c-block'
  import ViaPagination from '~/components/via-pagination'
  import Blank from '~/components/blank'
  import FundPie from './_c/fund-pie'
  import {mapState} from 'vuex'

  const P_LIMIT = 10 // 每页条数, P_前缀表示页面组件全局常量
  const P_INTERVAL = 60000 // 资产轮询时间

  export default {
    data() {
      return {
        bussinessTypeMap: { // 操作映射
          buy_order: '购买',
          sell_order: '出售',
          transfer_in: '转入',
          transfer_out: '转出',
          gift: '赠送',
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
        coinexCanWidthDraw: null, // coinex可提现金额，用null避免恰好为零的时候不好判断
        pieDatas: [],
        showPieChart: false,
        showCoinDropdown: false,
        totalCoin: 0,
        selectedCoin: 'USDT', // 实时汇率默认选择币种
        assetsTableFields: {
          coin_type: {
            label: '币种',
            sortable: false,
            thStyle: {
              width: '70px',
            },
            thClass: ['text-left', 'pl-30'],
            tdClass: ['text-left', 'pl-30'],
          },
          total: {
            label: '总额',
            thStyle: {
              width: '235px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          frozen: {
            label: '冻结',
            thStyle: {
              width: '235px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          available: {
            label: '可用',
            thStyle: {
              width: '235px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          marketValue: {
            label: '市值',
            thStyle: {
              width: '235px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          action: {
            label: '与主站资金划转',
            tdClass: ['text-right', 'pr-30'],
            thStyle: {
              textAlign: 'right',
              paddingRight: '30px',
            },
            sortable: false,
          },
        },
        assetHistoryItems: [],
        assetsHistoryFields: {
          create_time: {
            label: '时间',
            thStyle: {
              width: '185px',
            },
            thClass: ['text-center'],
            tdClass: ['text-left', 'pl-30'],
            sortable: false,
          },
          business_type: {
            label: '操作',
            thStyle: {
              width: '340px',
            },
            thClass: ['text-center'],
            sortable: false,
          },
          coin_type: {
            label: '币种',
            sortable: false,
            thStyle: {
              width: '180px',
            },
            thClass: ['text-center'],
            tdClass: ['text-center'],
          },
          amount: {
            label: '资产变化',
            thStyle: {
              width: '210px',
            },
            thClass: ['text-right', 'pr-5'],
            tdClass: ['text-right'],
            sortable: false,
          },
          total: {
            label: '账户余额',
            tdClass: ['text-right', 'pr-30'],
            thStyle: {
              textAlign: 'right',
              paddingRight: '30px',
            },
            sortable: false,
          },
        },
        historyQueryParams: {
          coin_type: this.$route.query.coin_type || null,
          business_type: this.$route.query.business_type || null,
          page: 1,
          total: 0,
          limit: P_LIMIT,
        }, // 流水接口请求参数
        timer: null,
      }
    },
    fetch({store, app, req, redirect, route}) {
      app.axios.init(req)
      return Promise.all([
        store.dispatch('fetchOtcBalance'),
        store.dispatch('fetchCoinexBalance'),
        store.dispatch('fetchExchangeRate'),
      ]).catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    created() {
      this.fetchBalanceHistory()
      this.timer = setInterval(() => {
        this.updateAllBalance()
      }, P_INTERVAL)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    components: {
      cBlock,
      FundPie,
      Blank,
      ExtendedInputNumber,
      ViaPagination,
    },
    computed: {
      ...mapState(['balance', 'constant']),
      walletCoinTypes() { // 增加币种CET, 只在钱包使用
        return [ ...this.constant.COIN_TYPES, 'CET' ]
      },
      otcBalance() {
        if (this.balance.otcBalance) {
          const pieDatas = []
          let totalBalance = 0
          const defaultRate = this.balance.allRate[this.defaultAsset] // 各币种CNY汇率
          const sortedBalance = this.walletCoinTypes.map((coin, index) => { // 根据配置的币种顺序输出数组
            const item = this.balance.otcMap[coin]
            if (item) {
              let curCoinMarketValue = 0
              if (item.total > 0) {
                curCoinMarketValue = (+item.total) * defaultRate[item.coin_type] // 市值
                pieDatas.push({
                  name: item.coin_type,
                  y: curCoinMarketValue,
                  colorIndex: index,
                  virtual: false,
                })
                totalBalance += curCoinMarketValue
              }
              return { ...item, marketValue: curCoinMarketValue }
            }
          })
          this.pieDatas = pieDatas
          if (pieDatas.length) {
            const tid = setTimeout(() => {
              this.showPieChart = true // 为了饼图有加载动画效果需要延迟显示
              clearTimeout(tid)
            }, 500)
          }
          this.totalBalance = totalBalance
          const rate = this.balance.currentRate[this.selectedCoin] // 币种汇率
          this.totalCoin = rate ? this.totalBalance / rate : 0
          return sortedBalance || []
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
        return Object.keys(this.bussinessTypeMap).map(key => {
          return {
            text: this.bussinessTypeMap[key],
            value: key,
          }
        })
      },
      showTransferTooltip() {
        return this.form.from === 'coinex' && this.coinexCanWidthDraw !== null && this.coinexCanWidthDraw.setDigit(8) < (parseFloat(this.availableAmount)).setDigit(8)
      },
      availableAmountShown() {
        return this.showTransferTooltip ? this.coinexCanWidthDraw : this.availableAmount
      },
    },
    watch: {
      'historyQueryParams.coin_type'() {
        this.historyQueryParams.page = 1
        this.$router.replace({
          query: {
            ...this.$route.query,
            coin_type: this.historyQueryParams.coin_type || undefined
          }
        }) // 不限的时候用undefined清掉query，而不是null
        this.fetchBalanceHistory()
      },
      'historyQueryParams.business_type'() {
        this.historyQueryParams.page = 1
        this.$router.replace({
          query: {
            ...this.$route.query,
            business_type: this.historyQueryParams.business_type || undefined
          }
        })
        this.fetchBalanceHistory()
      },
    },
    head() {
      return {
        title: 'OTC钱包' +
        this.$t('global.pageTitle.common')
      }
    },
    methods: {
      changePage(page) {
        this.historyQueryParams.page = page
        this.fetchBalanceHistory()
      },
      onChangeCoinType(coinType) {
        const fromBalance = this[`${this.form.from}Balance`].find(item => {
          return item.coin_type === coinType
        })
        this.availableAmount = fromBalance ? fromBalance.available : 0
        if (this.form.from === 'coinex') {
          this.updateCanWithDraw(coinType)
        }
      },
      updateCanWithDraw(coinType) {
        // 先置空然后请求实时数据
        this.coinexCanWidthDraw = null
        this.axios.balance.getCanWithdrawAmount(coinType).then(response => {
          this.coinexCanWidthDraw = parseFloat(response.data.can_withdraw_amount)
        })
      },
      onTransfer() {
        if (this.form.amount > 0) {
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
                  this.updateAllBalance()

                  const {coin_type: coinType, business_type: businessType} = this.historyQueryParams
                  const isTransferIn = this.form.from === 'coinex' && this.form.to === 'otc'
                  const isTransferOut = this.form.from === 'otc' && this.form.to === 'coinex'
                  if ((coinType === this.form.coinType || coinType === null) && this.historyQueryParams.page === 1) { // 当流水筛选选择全部or当前划转币种并且处在第一页才更新流水列表
                    if (businessType === null || (businessType === 'transfer_in' && isTransferIn) || (businessType === 'transfer_out' && isTransferOut)) { // 并且操作选择全部or转入转出才更新流水
                      this.fetchBalanceHistory()
                    }
                  }
                }
                this.form.submitting = false
              })
              .catch(err => {
                this.form.submitting = false
                this.$errorTips(`划转失败${err}`)
              })
          }
        }
      },
      fetchBalanceHistory() {
        const {page, limit, coin_type: coinType, business_type: bussType} = this.historyQueryParams
        const query = {
          page,
          limit,
          coin_type: coinType,
          business_type: bussType,
        }
        this.axios.balance.history(query).then(historyData => {
          if (historyData.code === 0 && historyData.data) {
            const {data, curr_page: currentPage, total: totalRows} = historyData.data
            this.historyQueryParams.page = currentPage
            this.historyQueryParams.totalRows = totalRows
            this.assetHistoryItems = data.map(item => {
              const {business_type: bussType} = item
              return {
                ...item,
                business_type: this.bussinessTypeMap[bussType] || bussType,
              }
            })
          }
        })
      },
      toggleDropdown(val) {
        this.showCoinDropdown = !!val
      },
      onChangePriceCoin(index) {
        const rate = this.balance.currentRate[this.selectedCoin] // 币种汇率
        this.totalCoin = rate ? this.totalBalance / rate : 0
        this.selectedCoin = this.constant.COIN_TYPES[index]
        this.showCoinDropdown = false
      },
      onShowhand() {
        this.form.amount = +this.availableAmount === 0 ? 0 : this.availableAmount // 后端可能返回0e-8或者0.00000000这种数字，统一转0
      },
      onSwap() { // 资产流向互换
        const tmp = this.form.from // 交换操作必须放在异步函数外面，否则不生效，因为v-model修改是先于异步函数执行
        this.form.from = this.form.to
        this.form.to = tmp
        if (this.form.from === 'coinex') {
          this.updateCanWithDraw(this.form.coinType)
        }
        this.updateAllBalance()
          .then(() => {
            const fromBalance = this[`${this.form.from}Balance`].find(item => {
              return item.coin_type === this.form.coinType
            })
            this.availableAmount = fromBalance ? fromBalance.available : 0
            this.form.amount = 0
          })
          .catch(err => {
            console.error(`资产更新失败${err}`)
          })
      },
      onShowTransferModal(type, item) {
        this.updateAllBalance()
          .then(() => {
            const {coin_type: coinType} = item
            this.form.coinType = coinType // 设置划转币种
            if (type === 'in') {
              this.form.from = 'coinex'
              this.form.to = 'otc'
              this.updateCanWithDraw(coinType) // coinex提现才需要
            } else if (type === 'out') {
              this.form.from = 'otc'
              this.form.to = 'coinex'
            }
            this.form.amount = 0 // 划转数量重置0
            const fromBalance = this[`${this.form.from}Balance`].find(item => {
              return item.coin_type === coinType
            })
            this.availableAmount = fromBalance ? fromBalance.available : 0
            this.showTransferModal = true
          })
          .catch(err => {
            console.log(`资产更新失败${err}`)
          })
      },
      updateAllBalance() {
        return Promise.all([
          this.$store.dispatch('fetchOtcBalance'), // otc资产
          this.$store.dispatch('fetchCoinexBalance'), // coinex资产
          this.$store.dispatch('fetchExchangeRate'), // 汇率
        ])
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
      .history-filter-select {
        width: 100px !important;
        height: 30px !important;
        font-size: 12px !important;
      }
    }
    .amount-input {
      height: 100%;
    }
    .amount-available {
      font-size: 14px;
      color: #192330;
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
      font-size: 20px;
    }
    .space-margin {
      display: inline-block;
      width: 30px;
    }
  }
</style>
