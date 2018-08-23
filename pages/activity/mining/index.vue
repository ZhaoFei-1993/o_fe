<template>
  <div id="mining-page">
    <div class="mining-banner">
    </div>
    <div class="mining-body">
      <div class="mining-slogan"></div>
      <div class="mining-slogan-detail">
        发布广告瓜分每日<span class="mining-text-highlight">20万CET</span>，首次交易获得<span class="mining-text-highlight">100CET</span>奖励
      </div>
      <div class="mining-rule-box">
        <div class="mining-rule-decorator-left"></div>
        <div class="mining-rule-decorator-right"></div>
        <div class="mining-rule-detail">
          <div class="mining-rule-title">
            活动期间，按规则发布广告赢取积分，每天的积分前20名可参与瓜分20万CET ：
          </div>
          <ul class="mining-rule-content">
            <li><span><span class="mining-rule-content-bold">广告发布要求：</span>最低限额 ≤ 10000 CNY、最大限额 ≥ 10000 CNY、广告初始数量折合金额 ≥ 10000 CNY。</span></li>
            <li><span><span class="mining-rule-content-bold">广告排名规则：</span>价格越优排名越靠前、相同价格时越早发布排名越靠前。</span></li>
            <li><span><span class="mining-rule-content-bold">广告积分计算：</span>每分钟进行快照，排名第1至第10依次获得 20、19 … 12、11积分，USDT市场在此基础上采用双倍积分。</span></li>
            <li><span><span class="mining-rule-content-bold">CET奖励分配：</span>每天总积分的第1名奖励<span class="mining-text-highlight">20000CET</span>，第2至第3名奖励<span class="mining-text-highlight">15000CET</span>，第4至10名奖励<span class="mining-text-highlight">10000CET</span>，第11至20名奖励<span class="mining-text-highlight">8000CET</span>。</span></li>
          </ul>
        </div>
      </div>
      <c-block class="mining-my-detail">
        <div class="mining-my-detail-col1">
          <div class="mining-my-detail-icon"></div>
          <div class="mining-my-detail-label">我的今日排名</div>
          <div class="mining-my-detail-value">23</div>
        </div>
        <div class="mining-my-detail-col2">
          <div class="mining-my-detail-icon"></div>
          <div class="mining-my-detail-label">今日累计积分</div>
          <div class="mining-my-detail-value">5235</div>
        </div>
        <div class="mining-my-detail-col3">
          <div class="mining-my-detail-wrapper">
            <div>昨日排名<span class="mining-text-highlight">13</span>，昨日获得奖励<span class="mining-text-highlight">20000</span> CET，累计获得奖励<span class="mining-text-highlight">523534</span>CET。</div>
            <b-link to="/" style="color: #7bbb78;position: absolute;left: 0;bottom: 0;">查看我的奖励明细 ></b-link>
          </div>
        </div>
      </c-block>
      <c-block class="mining-table">
        <div class="mining-table-btn-wrapper">
          <button class="mining-table-btn">积分排名</button>
          <button class="mining-table-btn active">我的历史记录</button>
        </div>
        <div>
          <div style="margin-left: 20px;display: flex;width: 210px;justify-content: space-between;">
            <div style="width: 100px;height: 40px;line-height: 40px;background-color: #5aa256;text-align: center;color: #fff;cursor: pointer;border: solid 1px #eeeeee;border-bottom: 0;font-size: 16px;">今日排名</div>
            <div style="width: 100px;height: 40px;line-height: 40px;background-color: #fff;text-align: center;color: #5aa356;cursor: pointer;border: solid 1px #eeeeee;border-bottom: 0;font-size: 16px;">奖励历史</div>
          </div>
        </div>
        <div style="width: 100%;height: 2px;border: solid 1px #5aa256;"></div>
        <b-table :fields="assetsTableFields" :items="historyItems">
          
        </b-table>
      </c-block>
    </div>
  </div>
</template>

<script>
  import cBlock from '~/components/c-block'
  import { mapState } from 'vuex'

  export default {
    components: {
      cBlock,
    },
    data() {
      return {
        myMiningData: null,
        historyItems: [],
        assetsTableFields: {
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
              width: '185px',
            },
            thClass: ['text-right', 'pr-5'],
            tdClass: ['text-right'],
            sortable: false,
          },
          score: {
            label: '今日积分',
            thStyle: {
              width: '260px',
            },
            thClass: ['text-right', 'pr-5'],
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
      }
    },
    computed: {
      ...mapState(['user']),
    },
    watch: {
      'user.account'(newVal, oldVal) {
        if (newVal && !oldVal) {
          // todo
        }
      },
    },
    mounted() {
      if (this.user.account) {
        // todo
      }
    },
    methods: {
      init() {
  
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
          width: 348px;
          height: 112px;
          font-size: 18px;
        }
      }
    }
    .mining-table {
      padding: 0 !important;
      overflow: hidden;
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
      background-image: url(~assets/img/activity/mining/bg.jpg);
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
        margin: 141px auto 0 auto;
        padding-top: 37px;
        padding-left: 154px;
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
              margin-bottom: 15px;
            }
          }
        }
      }
    }
  }
</style>
