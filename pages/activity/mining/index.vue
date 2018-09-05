<template>
  <div id="mining-page">
    <div class="mining-banner">
    </div>
    <div class="mining-body">
      <div class="mining-slogan"></div>
      <div class="mining-slogan-detail">
        发布广告瓜分每日<span class="mining-text-highlight">20万CET</span>，首次交易获得<span class="mining-text-highlight">100CET</span>奖励
      </div>
      <div style="width: 200px;height: 40px;border-radius: 20px;border: solid 2px #59a155;font-size: 20px;line-height: 36px;text-align: center;margin: 30px auto auto;">
        <b-link href="https://support.coinex.com/hc/zh-cn/articles/360008525693-%E4%BB%80%E4%B9%88%E6%98%AF%E6%8C%82%E5%8D%95%E5%8D%B3%E6%8C%96%E7%9F%BF" target="_blank" style="color: #5aa356;">了解活动规则 ></b-link>
      </div>
      <div class="mining-rule-box">
        <div class="mining-left-point"></div>
        <div class="mining-right-point"></div>
        <div class="mining-rule-decorator-left"></div>
        <div class="mining-rule-decorator-right"></div>
        <div class="mining-rule-detail">
          <div class="mining-rule-title">
            活动期间，按规则发布广告赢取积分，每天的积分前20名可参与瓜分20万CET ：
          </div>
          <ul class="mining-rule-content">
            <li><span><span class="mining-rule-content-bold">广告发布要求：</span>最低限额 ≤ 10000 CNY、最大限额 ≥ 50000 CNY，剩余数量金额 ≥ 10000 CNY。</span></li>
            <li><span><span class="mining-rule-content-bold">广告排名规则：</span>1. 价格越优，排名越靠前 2. 价格相同时，剩余数量越多越靠前 3. 价格与剩余数量均相同时，越早发布越靠前。</span></li>
            <li><span><span class="mining-rule-content-bold">广告积分计算：</span>每分钟进行快照，排名第1至第20依次获得 20、19 … 2、1积分，USDT市场在此基础上采用双倍积分。</span></li>
            <li><span><span class="mining-rule-content-bold">CET奖励分配：</span>每天总积分的第1名奖励<span class="mining-text-highlight">20000CET</span>，第2至第3名奖励<span class="mining-text-highlight">15000CET</span>，第4至10名奖励<span class="mining-text-highlight">10000CET</span>，第11至20名奖励<span class="mining-text-highlight">8000CET</span>。</span></li>
          </ul>
        </div>
      </div>
      <c-block class="mining-my-detail">
        <div class="mining-my-detail-col1">
          <div class="mining-my-detail-icon"></div>
          <div class="mining-my-detail-label">我的今日排名<CTooltip content="排名和积分每5分钟更新一次" x="4" size="18" color="#6f6f6f" /></div>
          <div class="mining-my-detail-value">
            <ICountUp
              v-if="myMiningData && myMiningData.today_rank && +myMiningData.today_rank.sort"
              :startVal="coutupParams.startVal"
              :endVal="+myMiningData.today_rank.sort"
              :decimals="coutupParams.decimals"
              :duration="coutupParams.duration"
              :options="coutupParams.options"/>
            <template v-else>- -</template>
          </div>
        </div>
        <div class="mining-my-detail-col2">
          <div class="mining-my-detail-icon"></div>
          <div class="mining-my-detail-label">今日累计积分<CTooltip content="排名和积分每5分钟更新一次" x="4" size="18" color="#6f6f6f" /></div>
          <div class="mining-my-detail-value">
            <ICountUp
              v-if="myMiningData && myMiningData.today_rank && +myMiningData.today_rank.score"
              :startVal="coutupParams.startVal"
              :endVal="+myMiningData.today_rank.score"
              :decimals="coutupParams.decimals"
              :duration="coutupParams.duration"
              :options="coutupParams.options"/>
            <template v-else>- -</template>
          </div>
        </div>
        <div class="mining-my-detail-col3">
          <div class="mining-my-detail-wrapper" v-if="user.account">
            <div>
              昨日排名<span style="color: #7bbb78;">{{ myMiningData && myMiningData.yesterday_rank && +myMiningData.yesterday_rank.sort ? myMiningData.yesterday_rank.sort : '- -' }}</span>，昨日获得奖励<span style="color: #7bbb78;">{{ myMiningData && myMiningData.yesterday_rank && +myMiningData.yesterday_rank.award_amount ? myMiningData.yesterday_rank.award_amount : '- -' }}</span>CET，
            </div>
            <div>
              累计获得奖励<span style="color: #7bbb78;">{{ myMiningData && +myMiningData.total_award_amount ? myMiningData.total_award_amount : '- -' }}</span>CET。
            </div>
            <b-link to="/wallet?business_type=gift&coin_type=CET" class="wallet-link">查看我的奖励明细 ></b-link>
          </div>
          <div class="mining-my-detail-wrapper mining-my-detail-login-wrapper" v-else>
            <button class="mining-my-detail-login-btn" @click="onLogin">登录查看我的积分 ></button>
          </div>
        </div>
      </c-block>
      <c-block class="mining-table">
        <div class="mining-table-btn-wrapper">
          <button
            v-for="(item, index) in firstTabs"
            :class="['mining-table-btn', item.active ? 'active' : '']"
            @click="onClickTab({level: 'first', index})">
            {{ item.text }}
          </button>
        </div>
        <div style="width: 100%;min-height: 42px;">
          <div v-if="firstTabs.find(item => item.active).value === 'rank'">
            <div class="mining-table-tab-wrapper">
              <div
                v-for="(item, index) in secondTabs"
                :class="['mining-table-tab-btn', item.active ? 'active' : '']"
                @click="onClickTab({level: 'second', index})">
                {{ item.text }}
              </div>
            </div>
            <div class="mining-line"></div>
            <b-input v-if="showDatePicker" style="width: 140px;height: 30px;margin: 10px 20px;" type="date" size="sm" v-model="selectedDate" :max="maxDate" required/>
          </div>
        </div>
        <b-table :fields="tableFields" :items="tableItems">
          <template slot="score" slot-scope="{ item }">
            {{ item.score | formatMoney }}
          </template>
          <template slot="trading_amount" slot-scope="{ item }">
            {{ item.trading_amount | formatMoney }} 元
          </template>
          <template slot="award_amount" slot-scope="{ item }">
            {{ item.award_amount | formatMoney }} CET
          </template>
          <template slot="date" slot-scope="{ item }">
            {{ item.date | getTimeText('day') }}
          </template>
        </b-table>
        <div v-if="targetTableName === 'myHistory' && !user.account" class="mining-table-login-wrapper">
          <b-link style="color: #5da759;" @click="onLogin">登录</b-link>后查看
        </div>
        <Blank v-else-if="!tableItems.length" text="无内容"></Blank>
        <ViaPagination v-if="tableItems.length && targetTableName === 'myHistory'"
                       :total-rows="myHistoryQuery.totalRows"
                       :current-page="myHistoryQuery.page"
                       @change="changePage"
                       :per-page="myHistoryQuery.limit">
        </ViaPagination>
      </c-block>
    </div>
  </div>
</template>

<script>
  import cBlock from '~/components/c-block'
  import Blank from '~/components/blank'
  import ViaPagination from '~/components/via-pagination'
  import CTooltip from '~/components/c-tooltip.vue'
  import ICountUp from 'vue-countup-v2'
  import { mapState } from 'vuex'
  import {loginPage, webDomain} from '~/modules/variables'

  export default {
    head() {
      return {
        title: `挂单挖矿${this.$t('global.pageTitle.common')}`,
      }
    },
    components: {
      cBlock,
      Blank,
      ViaPagination,
      CTooltip,
      ICountUp,
    },
    data() {
      return {
        coutupParams: {
          startVal: 0,
          decimals: 0,
          duration: 1,
          options: {
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: ''
          },
        },
        loginPage: `${loginPage}?redirect=${encodeURIComponent(webDomain + this.$route.fullPath)}`,
        myHistoryQuery: {
          page: 1,
          limit: 30,
          totalRows: 0,
        },
        showDatePicker: false,
        firstTabs: [{
          text: '积分排名',
          value: 'rank',
          active: true,
        }, {
          text: '我的历史记录',
          value: 'myHistory',
          active: false,
        }],
        secondTabs: [{
          text: '今日排名',
          value: 'todayRank',
          active: true,
        }, {
          text: '奖励历史',
          value: 'awardHistory',
          active: false,
        }],
        myMiningData: null,
        tableItems: [],
        todayRankFields: {
          username: {
            label: '用户昵称',
            sortable: false,
            thStyle: {
              width: '185px',
            },
            thClass: ['text-left', 'pl-20'],
            tdClass: ['text-left', 'pl-20'],
          },
          sort: {
            label: '今日排名',
            thStyle: {
              width: '135px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          score: {
            label: '今日积分',
            thStyle: {
              width: '260px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          trading_amount: {
            label: '今日成交额',
            thStyle: {
              width: '275px',
            },
            thClass: ['text-right', 'pr-20'],
            tdClass: ['text-right', 'pr-20'],
            sortable: false,
          },
        },
        awardHistoryFields: {
          username: {
            label: '用户昵称',
            sortable: false,
            thStyle: {
              width: '185px',
            },
            thClass: ['text-left', 'pl-20'],
            tdClass: ['text-left', 'pl-20'],
          },
          sort: {
            label: '当日排名',
            thStyle: {
              width: '185px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          score: {
            label: '当日积分',
            thStyle: {
              width: '260px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          trading_amount: {
            label: '当日成交额',
            thStyle: {
              width: '260px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          award_amount: {
            label: '当日获得奖励',
            thStyle: {
              width: '275px',
            },
            thClass: ['text-right', 'pr-20'],
            tdClass: ['text-right', 'pr-20'],
            sortable: false,
          },
        },
        myHistoryFields: {
          date: {
            label: '日期',
            sortable: false,
            thStyle: {
              width: '185px',
            },
            thClass: ['text-left', 'pl-20'],
            tdClass: ['text-left', 'pl-20'],
          },
          sort: {
            label: '当日排名',
            thStyle: {
              width: '135px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          score: {
            label: '当日积分',
            thStyle: {
              width: '260px',
            },
            thClass: ['text-right'],
            tdClass: ['text-right'],
            sortable: false,
          },
          award_amount: {
            label: '当日获得奖励',
            thStyle: {
              width: '275px',
            },
            thClass: ['text-right', 'pr-20'],
            tdClass: ['text-right', 'pr-20'],
            sortable: false,
          },
        },
        tableFields: {},
        selectedDate: '2018-01-01',
        maxDate: '2018-01-01',
        targetTableName: '',
      }
    },
    computed: {
      ...mapState(['user']),
    },
    watch: {
      'user.account'(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.init()
        }
      },
      targetTableName(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          this.tableFields = this[`${this.targetTableName}Fields`]
          this[`${newVal}Fetch`]()
        }
      },
      selectedDate(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          this.awardHistoryFetch()
        }
      },
    },
    mounted() {
      if (this.user.account) {
        this.init()
      }
      this.selectedDate = this.getDate()
      this.maxDate = this.selectedDate
      this.targetTableName = 'todayRank'
      this.tableFields = this[`${this.targetTableName}Fields`]
    },
    methods: {
      onLogin() {
        window.location.href = this.loginPage
      },
      changePage(page) {
        this.myHistoryQuery.page = page
        this.myHistoryFetch()
      },
      getDate() {
        const d = new Date()
        d.setDate(d.getDate() - 1) // 取昨天date
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const year = String(d.getFullYear()).padStart(2, '0')

        return [year, month, day].join('-')
      },
      onClickTab(payload) {
        this[`${payload.level}Tabs`].forEach((item, index) => {
          if (index === payload.index) {
            if (!item.active) {
              item.active = true
              if (payload.level === 'first') { // 点击一级tab
                if (item.value === 'myHistory') { // 点击`我的历史记录`更新targetTableName
                  this.targetTableName = item.value
                } else if (item.value === 'rank') { // 点击`积分排名`需要查找二级tab
                  this.targetTableName = this.secondTabs.find(tab => tab.active).value
                }
              } else { // 点击二级tab
                this.targetTableName = item.value
              }
              this.showDatePicker = this.targetTableName === 'awardHistory' // 只有点击`奖励历史`才显示日期选择框
            }
          } else {
            item.active = false
          }
        })
      },
      todayRankFetch() {
        if (this.targetTableName !== 'todayRank') return

        this.axios.mining.getTodayRankRank().then(res => {
          if (res.data && Array.isArray(res.data)) {
            this.tableItems = res.data
          }
        })
      },
      myHistoryFetch() {
        if (this.targetTableName !== 'myHistory') return
        if (!this.user.account) {
          this.tableItems = []
          return
        }

        const { limit, page } = this.myHistoryQuery

        this.axios.mining.getMyHistory({
          limit,
          page,
        }).then(res => {
          if (res.data && res.data.data) {
            const {data, curr_page: currentPage, total: totalRows} = res.data
            this.myHistoryQuery.page = currentPage
            this.myHistoryQuery.totalRows = totalRows
            this.tableItems = data
          }
        })
      },
      awardHistoryFetch() {
        if (this.targetTableName !== 'awardHistory') return

        const dateTime = parseInt(new Date(this.selectedDate).getTime() / 1000)
        this.axios.mining.getAllHistory({
          date: dateTime,
        }).then(res => {
          if (res.data && Array.isArray(res.data)) {
            this.tableItems = res.data
          }
        })
      },
      init() {
        this.axios.mining.getMyRank().then(res => {
          if (res.data) {
            this.myMiningData = res.data
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  #mining-page {
    width: 100%;
    height: auto;
    margin-top: -60px;
    .mining-my-detail {
      margin-top: 25px;
      height: 180px;
      padding: 0 !important;
      display: flex;
      .mining-my-detail-col1 {
        display: inline-block;
        height: 100%;
        flex: 0 0 358px;
        border-right: 1px solid #eeeeee;
        .mining-my-detail-icon {
          margin: 26px auto 0 auto;
          width: 38px;
          height: 38px;
          background-size: contain;
          background-image: url(~assets/img/activity/mining/my-rank.png);
        }
        .mining-my-detail-label {
          margin-top: 17px;
          color: #00273b;
          font-size: 18px;
          text-align: center;
        }
        .mining-my-detail-value {
          text-align: center;
          font-size: 40px;
          color: #7bbb78;
          font-weight: 300;
        }
      }
      .mining-my-detail-col2 {
        display: inline-block;
        flex: 0 0 375px;
        height: 100%;
        border-right: 1px solid #eeeeee;
        .mining-my-detail-icon {
          margin: 26px auto 0 auto;
          width: 38px;
          height: 38px;
          background-size: contain;
          background-image: url(~assets/img/activity/mining/my-score.png);
        }
        .mining-my-detail-label {
          margin-top: 17px;
          color: #00273b;
          font-size: 18px;
          text-align: center;
        }
        .mining-my-detail-value {
          text-align: center;
          font-size: 40px;
          color: #7bbb78;
          font-weight: 300;
        }
      }
      .mining-my-detail-col3 {
        display: inline-block;
        height: 100%;
        .mining-my-detail-wrapper {
          position: relative;
          margin: 34px 68px;
          margin-right: 0;
          width: 400px;
          height: 112px;
          font-size: 18px;
          &.mining-my-detail-login-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            .mining-my-detail-login-btn {
              outline: 0;
              cursor: pointer;
              width: 220px;
              height: 48px;
              border-radius: 100px;
              border: solid 1px #5aa356;
              background-color: #fff;
              color: #5aa356;
              &:hover {
                background-color: #5aa356;
                color: #fff;
              }
            }
          }
          .wallet-link {
            color: #7bbb78;
            position: absolute;
            left: 0;bottom: 0;
          }
        }
      }
    }
    .mining-table {
      padding: 0 !important;
      margin-top: 10px;
      margin-bottom: 150px;
      overflow: hidden;
      thead th {
        min-height: 40px;
        line-height: 40px;
        height: 40px;
        font-weight: normal;
      }
      .mining-table-login-wrapper {
        text-align: center;
        background: #fff;
        height: 115px;
        line-height: 115px;
        color: #898989;
        font-size: 16px;
      }
      .mining-line {
        width: 100%;
        height: 2px;
        border: solid 1px #5aa256;
      }
      .mining-table-tab-wrapper {
        margin-left: 20px;
        display: flex;
        width: 210px;
        justify-content: space-between;
        .mining-table-tab-btn {
          width: 100px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
          border: solid 1px #eeeeee;
          color: #5aa356;
          border-bottom: 0;
          font-size: 16px;
          &.active {
            background-color: #5aa256;
            color: #fff;
          }
        }
      }
      .mining-table-btn-wrapper {
        width: 420px;
        margin: 40px auto 0 auto;
        display: flex;
        justify-content: space-between;
        .mining-table-btn {
          width: 200px;
          height: 40px;
          border-radius: 100px;
          border: solid 1px #5aa256;
          background-color: #fff;
          color: #5aa356;
          font-size: 22px;
          line-height: 38px;
          outline: 0;
          cursor: pointer;
          &.active {
            background-color: #5aa356;
            color: #fff;
          }
        }
      }
    }
    .mining-banner {
      width: 100%;
      height: 600px;
      background-image: url(~assets/img/activity/mining/bg.png);
      background-size: cover;
    }
    .mining-body {
      width: 1200px;
      height: auto;
      margin: 0 auto;
      .mining-text-highlight {
        color: #88de84 !important;
      }
      .mining-slogan {
        width: 640px;
        height: 70px;
        margin: -432px auto 0 auto;
        background-image: url(~assets/img/activity/mining/slogan.png);
        background-size: contain;
      }
      .mining-slogan-detail {
        font-size: 24px;
        color: #fff;
        text-align: center;
        margin-top: 28px;
      }
      .mining-rule-box {
        position: relative;
        width: 1180px;
        height: 240px;
        background-color: #013456;
        margin: 72px auto 0 auto;
        padding-top: 37px;
        padding-left: 154px;
        .mining-left-point {
          position: absolute;
          left: 90px;
          top: -84px;
          width: 216px;
          height: 64px;
          background-image: url(~assets/img/activity/mining/left-point.png);
          background-size: contain;
        }
        .mining-right-point {
          position: absolute;
          right: 62px;
          top: -138px;
          width: 350px;
          height: 100%;
          background-image: url(~assets/img/activity/mining/right-point.png);
          background-size: contain;
        }
        .mining-rule-decorator-left {
          width: 100px;
          height: 200px;
          position: absolute;
          left: -10px;
          bottom: -10px;
          border-width: 10px;
          border-style: solid;
          border-image: linear-gradient(to bottom, #96d292, #5da759) 1;
          border-top: 0;
          border-right: 0;
        }
        .mining-rule-decorator-right {
          width: 100px;
          height: 200px;
          position: absolute;
          right: -10px;
          top: -10px;
          border: 10px solid #5da759;
          border-bottom: 0;
          border-left: 0;
        }
        .mining-rule-detail {
          .mining-rule-title {
            color: #88de84;
            font-size: 20px;
            font-weight: 500;
          }
          .mining-rule-content {
            margin-top: 21px;
            font-size: 14px;
            list-style-type: square;
            margin-left: 16px;
            .mining-rule-content-bold {
              font-weight: bold;
            }
            li {
              color: #88de84;
              span {
                color: #cbcbcb;
              }
            }
            li:not(:last-child) {
              margin-bottom: 11px;
            }
          }
        }
      }
    }
  }
</style>
