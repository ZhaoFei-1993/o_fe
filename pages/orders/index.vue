<template>
  <div class="page-order">
    <c-block>
      <header class="header">订单管理</header>
      <div class="filter-wapper">
        <div @click="onClickFilter(index)" v-for="(item, index) in filterOptions" class="filter-item" :class="{'filter-active': item.active}">{{ item.text }}</div>
      </div>
      <div class="order-table">
        <b-table :fields="orderTableFields" :items="orderTableItems">
          <template slot="orderNo" slot-scope="{ item }">
            <b-link>{{ item.orderNo }}</b-link>
          </template>
          <template slot="type" slot-scope="{ item }">
            <span class="order-type" :style="{ color: item.type === 'buy' ? '#ffbc32' : '#52cbca' }">
              {{ item.type === 'buy' ? '买' : '卖' }}
            </span>
          </template>
        </b-table>
      </div>
    </c-block>
  </div>
</template>

<script>
  import cBlock from '~/components/c-block'

  export default {
    data() {
      return {
        filterOptions: [{
          text: '进行中',
          value: 'processing',
          active: true,
        }, {
          text: '已结束',
          value: 'end',
          active: false,
        }, {
          text: '申诉中',
          value: 'appeal',
          active: false,
        }],
        orderTableFields: {
          orderNo: {
            label: '订单编号',
            sortable: false,
            thStyle: {
              width: '110px',
              paddingLeft: '30px',
            },
            thClass: [ 'text-left' ],
            tdClass: [ 'text-center' ],
          },
          type: {
            label: '类型',
            thStyle: {
              width: '120px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          coinType: {
            label: '币种',
            thStyle: {
              width: '120px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          amount: {
            label: '数量',
            thStyle: {
              width: '150px',
            },
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            sortable: false,
          },
          price: {
            label: '单价',
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            thStyle: {
              width: '150px',
            },
            sortable: false,
          },
          totalAmount: {
            label: '总价',
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            thStyle: {
              width: '150px',
            },
            sortable: false,
          },
          orderTime: {
            label: '下单时间',
            thClass: [ 'text-right' ],
            tdClass: [ 'text-right' ],
            thStyle: {
              width: '150px',
            },
            sortable: false,
          },
          status: {
            label: '状态',
            tdClass: [ 'text-center' ],
            thStyle: {
              textAlign: 'center',
            },
            sortable: false,
          },
        },
        orderTableItems: [{
          orderNo: '134234',
          type: 'buy',
          coinType: 'USDT',
          amount: '2314',
          price: '11.24',
          totalAmount: '42543.00',
          orderTime: Date.now(),
          status: 'waiting',
        }, {
          orderNo: '134234',
          type: 'sell',
          coinType: 'USDT',
          amount: '2314',
          price: '11.24',
          totalAmount: '42543.00',
          orderTime: Date.now(),
          status: 'waiting',
        }],
      }
    },
    components: {
      cBlock,
    },
    methods: {
      onClickFilter(index) {
        for (let i = 0; i < this.filterOptions.length; i++) {
          if (i !== index) {
            this.filterOptions[i].active = false
          } else {
            this.filterOptions[i].active = true
          }
        }
      },
    }
  }
</script>

<style lang="scss">
  .page-order {
    .header {
      font-size: 18px;
      color: #192330;
    }
    .filter-wapper {
      display: flex;
      justify-content: space-between;
      width: 255px;
      margin-top: 28px;
    }
    .filter-item {
      width: 70px;
      height: 24px;
      line-height: 22px;
      border-radius: 100px;
      border: solid 1px #6f6f6f;
      color: #192330;
      text-align: center;
      font-size: 12px;
      cursor: pointer;
    }
    .filter-active {
      border: solid 1px #52cbca;
      color: #52cbca;
    }
    .order-table {
      margin: 20px -30px 0;
      .table thead th {
        background: #f9f9f9;
      }
      .order-type {
        display: inline-block;
        width: 22px;
        height: 22px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 #ececec;
        border-radius: 100px;
        text-align: center;
        font-size: 12px;
        line-height: 22px;
      }
    }
  }
</style>