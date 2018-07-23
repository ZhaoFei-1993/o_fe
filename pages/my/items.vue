<style lang="scss">
  .page-my-items {
    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
    }
    .items-header-left {
      display: flex;
      align-items: center;
    }

    .items-table {
      th {
        text-align: center;
      }
    }

    .item-coin-amount-container {
      position: absolute;
      width: 400px;
      padding-bottom: 10px !important;

      .item-coin-amount-confirm {
        display: flex;
        align-items: center;
      }
    }
  }
</style>

<template>
  <CBlock class="page-my-items">
    <h2 class="items-header">
      <span class="items-header-left">
        广告管理
        <ToggleButton :value="user.merchant.is_available" class="mb-0 mx-5" @input="onUserStatusChange"/>
        <span v-if="user.merchant.is_available" class="c-brand-green fz-12">正在接单</span>
        <span v-else class="c-gray fz-12">暂停接单</span>
      </span>

      <b-btn size="xs" variant="gradient-yellow" @click="onItemPublish">发布广告</b-btn>
    </h2>

    <div class="mt-30">
      <b-btn v-for="(status, index) in filterOptions"
             :variant="itemStatus === status.value ? 'outline-green' : 'outline-gray'"
             :key="index" size="xxs" class="mr-20"
             @click="onSetItemStatus(status.value)">
        {{status.text}}
      </b-btn>
    </div>

    <b-table :fields="itemTableFields" :items="items" class="items-table">
      <template slot="id" slot-scope="{ item }">
        <b-link>{{ item.id }}</b-link>
      </template>
      <template slot="side" slot-scope="{ item }">
        <!-- 自定义的属性 -->
        <span :class="['order-type', item.side === 'buy' ? 'order-type-buy' : 'order-type-sell']">
              {{ item.side === 'buy' ? '买' : '卖' }}
            </span>
      </template>
      <template slot="remain_coin_amount" slot-scope="{ item }">
        {{ formatMoney(item.remain_coin_amount) }}
      </template>
      <template slot="cashAmountLimit" slot-scope="{ item }">
        {{formatMoney(item.min_deal_cash_amount)}} - {{formatMoney(item.max_deal_cash_amount)}} {{item.cash_type}}
      </template>
      <template slot="price" slot-scope="{ item }">
        {{item.price}} {{item.cash_type}}
      </template>
      <!--暂时不显示用户的最后编辑时间 jeff 20180721-->
      <template v-if="itemStatus === constant.ITEM_STATUS.ONLINE" slot="on_time" slot-scope="{item}">
        {{utils.getTimeText(item.on_time)}}
      </template>
      <template slot="action" slot-scope="{ item }">
        <b-btn v-if="itemStatus === constant.ITEM_STATUS.ONLINE" variant="plain-green" size="xxs" @click="onItemOffline(item)">下架</b-btn>
        <div v-else>
          <b-btn variant="plain-green" size="xxs" @click="onItemEdit(item)">编辑</b-btn>
          <b-btn variant="plain-green" size="xxs" class="mx-10" @click="onItemOnline(item, $event)">上架</b-btn>
          <b-btn variant="plain-green" size="xxs" @click="onItemDelete(item)">删除</b-btn>
        </div>
      </template>
    </b-table>
    <CBlock v-show="isItemAmountEditing" class="item-coin-amount-container" ref="coin-amount" x="20" y="20">
      <div class="item-coin-amount-confirm">
        <CurrencyInput v-model="onlineItemCoinAmount" class="item-coin-amount-confirm-input" :currency="editingItem.cash_type"/>
        <b-btn variant="plain-green" size="xs" class="mx-20" @click="onItemOnlineConfirm">确定</b-btn>
        <b-btn variant="plain" size="xs" @click="onItemOnlineCancel">取消</b-btn>
      </div>
      <Language v-if="editingItem.coin_type && editingItem.side === constant.SIDE.SELL" text="最多可售[a][/a][c][/c]" class="c-red mt-1" tag="div">
        <span slot="a"> {{balance.otcMap[editingItem.coin_type].available}} </span>
        <span slot="c">{{editingItem.coin_type}}</span>
      </Language>
    </CBlock>
    <PublishItemModal v-model="publishModalShowing" @published="onItemPublished"/>
    <PublishItemModal v-model="isItemEditing" :item="editingItem" :editing="isItemEditing" @edited="onItemEdited"/>
  </CBlock>
</template>

<script>
import PublishItemModal from '~/components/publish-item-modal/index.vue'
import ToggleButton from '~/components/toggle-button.vue'
import CurrencyInput from '~/components/currency-input.vue'
import {mapState} from 'vuex'

export default {
  name: 'page-my-items',
  components: {
    PublishItemModal,
    CurrencyInput,
    ToggleButton,
  },
  data() {
    return {
      publishModalShowing: false,
      items: [],
      itemStatus: '',
      editingItem: {},        // 正在编辑or上架的广告
      onlineItemCoinAmount: 0, // 正在上架的广告的数量
      isItemAmountEditing: false,   // 正在上架的广告的币量，是否在编辑
      isItemEditing: false,   // 是否在编辑广告
    }
  },
  computed: {
    ...mapState(['user', 'constant', 'balance']),
    filterOptions: function () {
      return [{
        text: '进行中',
        value: this.constant.ITEM_STATUS.ONLINE,
      }, {
        text: '已下架',
        value: this.constant.ITEM_STATUS.OFFLINE,
      }]
    },
    itemTableFields: function () {
      const fields = {
        id: {
          label: '广告编号',
          thStyle: {
            width: '70px'
          },
        },
        side: {
          label: '类型',
          thStyle: {
            width: '70px'
          },
        },
        coin_type: {
          label: '币种',
          thStyle: {
            width: '80px'
          },
        },
        remain_coin_amount: {
          label: '数量',
          thStyle: {
            width: '100px'
          },
        },
        cashAmountLimit: {
          label: '限额',
          thStyle: {
            width: '200px'
          },
        },
        price: {
          label: '交易价格',
          thStyle: {
            width: '180px'
          },
        },
      }

      if (this.itemStatus === this.constant.ITEM_STATUS.ONLINE) {
        fields.on_time = {
          label: '上架时间',
          thStyle: {
          },
        }
      }

      fields.action = {
        label: '操作'
      }

      return fields
    }
  },

  fetch({app, store, redirect, route, req}) {
    app.axios.init(req)
    return Promise.all([
      store.dispatch('fetchUserMerchant'),
      store.dispatch('fetchOtcBalance'),
    ]).catch(err => {
      app.axios.needAuth(err, redirect, route.fullPath)
    })
  },
  mounted() {
    this.itemStatus = this.constant.ITEM_STATUS.ONLINE
    this.getItems()

    // 覆盖默认的position，以使得amount输入框可以相对于document.body定位
    document.querySelector('.layout-content').style.position = 'static'
  },
  methods: {
    getItems() {
      this.axios.item.userItems(this.itemStatus).then(res => {
        this.items = res.data
      })
    },
    onUserStatusChange(bool) {
      this.axios.user.changeMerchantAvailable(bool).then(res => {
        this.$store.dispatch('fetchUserMerchant')
      }).catch(err => {
        this.axios.onError(err)
      })
    },
    onSetItemStatus(itemStatus) {
      this.itemStatus = itemStatus
      this.getItems()
    },
    onItemOffline(item) {
      this.axios.item.offline(item.id).then(res => {
        this.getItems()
      }).catch(err => {
        this.axios.onError(err)
      })
    },

    onItemOnline(item, e) {
      this.editingItem = item
      this.isItemAmountEditing = true
      this.onlineItemCoinAmount = item.remain_coin_amount

      const rect = e.target.getBoundingClientRect()
      this.$refs['coin-amount'].$el.style.left = rect.left - 420 + 'px'
      this.$refs['coin-amount'].$el.style.top = rect.top + window.scrollY - 30 + 'px'
    },
    onItemOnlineConfirm() {
      this.axios.item.online(this.editingItem.id, this.onlineItemCoinAmount).then(res => {
        this.getItems()
        this.isItemAmountEditing = false
      }).catch(err => {
        this.axios.onError(err)
      })
    },
    onItemOnlineCancel() {
      this.isItemAmountEditing = false
    },
    onItemDelete(item) {
      this.axios.item.delete(item.id).then(res => {
        this.getItems()
        this.$showTips('删除成功')
      }).catch(err => {
        this.axios.onError(err)
      })
    },
    onItemPublish() {
      this.publishModalShowing = true
    },
    onItemPublished() {
      this.publishModalShowing = false
      this.itemStatus === this.constant.ITEM_STATUS.ONLINE && this.getItems()
    },

    onItemEdit(item) {
      this.isItemEditing = true
      this.editingItem = item
    },

    onItemEdited() {
      this.isItemEditing = false
      this.getItems()
      this.$showTips('编辑成功')
    }
  }

}
</script>
