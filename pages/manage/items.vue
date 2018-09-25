<style lang="scss">
  .page-my-items {
    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      font-size: 18px;
    }
    .items-header-left {
      display: flex;
      align-items: center;
      .available-time-wrapper {
        display: flex;
        width: 350px;
        align-items: center;
        margin-left: 8px;
        .available-time-label {
          display: inline-block;
          margin: 0 6px;
        }
      }
    }

    .items-table {
      th {
        text-align: center;
        outline: none;
      }

      .sorting {
        &::before {
          right: .75em;
          content: "\2193" !important;
        }

        &::after {
          right: .25em;
          content: "\2191" !important;
        }
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

      .order-type-buy {
        color: #ffbc32;
      }

      .order-type-sell {
        color: #52cbca;
      }
      .unavailable-tooltip i {
        color: #e35555;
        font-size: 12px;
        margin-left: 5px;
      }
    }

    .item-coin-amount-container {
      position: absolute;
      width: 400px;
      padding-bottom: 10px !important;

      .item-coin-amount-confirm-input {
        width: 240px;
      }

      .item-coin-amount-confirm {
        display: flex;
        align-items: center;
      }
    }
  }
</style>

<template>
  <div class="page-content-container">
    <CBlock class="page-my-items" x="0">
      <div class="items-header" v-if="user.merchant">
        <span class="items-header-left">
          广告管理
          <ToggleButton :value="user.merchant.is_available" class="mb-0 mx-5" @input="onUserStatusChange"/>
          <span v-if="user.merchant.is_available" class="c-brand-green fz-12">正在接单</span>
          <span v-else class="c-gray fz-12">暂停接单</span>
          <div class="fz-12 available-time-wrapper" v-if="user.settings">
            自动接单时间：
            <TimeSelector type="available_start_time" @click="onClickTimeSelector" :before-click="onBeforeClickTimeSelector" :options="startTimeRangeOptions" :value="startTimeRangeValue"></TimeSelector>
            <span style="display: inline-block;" v-show="startTimeRangeValue > -1 && endTimeRangeValue > -1">
              <span class="available-time-label">至</span>
              <TimeSelector type="available_end_time" @click="onClickTimeSelector" :before-click="onBeforeClickTimeSelector" :options="endTimeRangeOptions" :value="endTimeRangeValue"></TimeSelector>
            </span>
          </div>
        </span>

        <PublishItemButton @published="onItemPublished">
          <b-btn size="xs" variant="gradient-yellow">发布广告</b-btn>
        </PublishItemButton>
      </div>

      <div class="my-25 px-30">
        <b-btn v-for="(status, index) in filterOptions"
               :variant="itemStatus === status.value ? 'outline-green' : 'outline-gray'"
               :key="index" size="xxs" class="mr-20"
               @click="onSetItemStatus(status.value)">
          {{status.text}}
        </b-btn>
      </div>

      <b-table :fields="itemTableFields" :items="itemsCurrent" class="items-table">
        <template slot="HEAD_side" slot-scope="{ item }">
          <div>
            <TableHeadDropdown :options="itemTypeOptions" label="类型"
                               @click="onClickSideDropdown"></TableHeadDropdown>
          </div>
        </template>
        <template slot="HEAD_coin_type" slot-scope="{ item }">
          <div>
            <TableHeadDropdown :options="coinTypeFilterOptions" label="币种"
                               @click="onClickCoinTypeDropdown"></TableHeadDropdown>
          </div>
        </template>
        <template slot="id" slot-scope="{ item }">
          <b-link>{{ item.id }}</b-link>
          <span v-if="itemStatus === constant.ITEM_STATUS.ONLINE && !item.itemLimit.available"
                class="unavailable-tooltip"
                v-b-tooltip.hover title="可交易数量不足最小限额，无法在首页中展示"><i class="iconfont icon-error"></i></span>
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
          {{formatMoney(item.itemLimit.minDealCashAmount,2)}} - {{formatMoney(item.itemLimit.maxDealCashAmount,2)}}
          {{item.cash_type}}
        </template>
        <template slot="price" slot-scope="{ item }">
          <!--浮动定价需要显示浮动的定价，会和price不一致（由于后台更新延迟所导致）-->
          <!--这里先不考虑最高、最低价，简单地显示个市价*比例，等后续用户反馈和产品决定，再看怎么显示-->
          <span v-if="item.pricing_type === constant.PRICING_TYPE.FLOAT">
          {{(balance.currentRate[item.coin_type] * item.float_rate / 100).setDigit(2)}} {{item.cash_type}}
          <span style="color:#00b275">({{item.float_rate}}%)</span>
        </span>
          <span v-else>
          {{item.price}} {{item.cash_type}}
        </span>
        </template>
        <!--暂时不显示用户的最后编辑时间 jeff 20180721-->
        <template v-if="itemStatus === constant.ITEM_STATUS.ONLINE" slot="on_time" slot-scope="{item}">
          {{utils.getTimeText(item.on_time)}}
        </template>
        <template v-if="itemStatus === constant.ITEM_STATUS.OFFLINE" slot="off_time" slot-scope="{item}">
          {{utils.getTimeText(item.off_time)}}
        </template>
        <template slot="action" slot-scope="{ item }">
          <b-btn v-if="itemStatus === constant.ITEM_STATUS.ONLINE" variant="plain-green" size="xxs"
                 @click="onItemOffline(item)">下架
          </b-btn>
          <div v-else>
            <b-btn variant="plain-green" size="xxs" @click="onItemEdit(item)">编辑</b-btn>

            <b-btn v-if="user.payments && user.payments.length"
                   variant="plain-green" size="xxs" class="mx-10" @click="onItemOnline(item, $event)">
              上架
            </b-btn>

            <template v-else>
              <b-btn :id="`deleteDisabled_${item.id}`"
                     variant="plain-light-gray" size="xxs" class="mx-10">
                上架
              </b-btn>
              <b-tooltip :target="`deleteDisabled_${item.id}`">
                您尚未激活支付方式，请先激活再上架广告。
                <b-link to="/my/payments">去激活支付方式</b-link>
              </b-tooltip>
            </template>

            <b-btn variant="plain-green" size="xxs" @click="onItemDelete(item)">删除</b-btn>
          </div>
        </template>
      </b-table>

      <Blank v-if="!itemsCurrent.length"/>

      <CBlock v-show="isItemAmountEditing" class="item-coin-amount-container" ref="coin-amount" x="20" y="20"
              v-click-outside="onClickOutsideAmount">
        <div class="item-coin-amount-confirm">
          <CurrencyInput v-model="onlineItemCoinAmount" class="item-coin-amount-confirm-input"
                         :currency="editingItem.coin_type"/>
          <b-btn variant="plain-green" size="xs" class="mx-20" :disabled="onlineItemCoinAmount<=0"
                 @click="onItemOnlineConfirm">确定
          </b-btn>
          <b-btn variant="plain" size="xs" @click="onItemOnlineCancel">取消</b-btn>
        </div>
        <Language v-if="editingItem.coin_type && editingItem.side === constant.SIDE.SELL" text="最多可售[a][/a][c][/c]"
                  class="mt-1" :class="{'c-red': !editingAmountValid}" tag="div">
          <span slot="a"> {{balance.otcMap[editingItem.coin_type].available}} </span>
          <span slot="c">{{editingItem.coin_type}}</span>
        </Language>
      </CBlock>

      <PublishItemModal v-model="isItemEditing" :editingItem="editingItem" :editing="true" @edited="onItemEdited"/>
    </CBlock>
    <LinkModal v-model="showConstraintModal"
               :content="itemLimitReason||'您今日已取消交易3次，无法发布和上架广告'"
               title="发布广告限制"
               linkText="查看规则"
               link="//support.coinex.com/hc/articles/360007643734"
               :isOutLink="true">
    </LinkModal>
    <b-modal title="价格警告"
             ok-variant="gradient-yellow"
             cancel-variant="outline-green"
             button-size="lg"
             class="text-center"
             v-model="showPriceAlertModal"
             okTitle="确认发布"
             cancel-title="取消"
             @ok="confirmSumbitItemOnline">
      <div>
        您设置的广告价格
        <span class="c-brand-green">（{{priceAlert.price}}）</span>
        {{priceAlert.direction > 0 ? '高' : '低'}}于当前市场价格
        <span class="c-brand-green">（{{priceAlert.basePrice}}）</span>的
        {{(priceAlert.bias *100).setDigit(2)}}%，请确认是否以该价格发布广告。
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import PublishItemModal from '~/components/publish-item-modal/index'
  import PublishItemButton from '~/components/publish-item-modal/publish-item-button'
  import ToggleButton from '~/components/toggle-button'
  import CurrencyInput from '~/components/currency-input'
  import TableHeadDropdown from '~/components/table-head-dropdown'
  import LinkModal from '~/components/link-modal'
  import Blank from '~/components/blank'
  import TimeSelector from './_c/time-selector'
  import {mapState} from 'vuex'
  import ClickOutside from 'vue-click-outside'

  Vue.directive('ClickOutside', ClickOutside)

  export default {
    name: 'page-my-items',
    components: {
      PublishItemModal,
      CurrencyInput,
      ToggleButton,
      Blank,
      PublishItemButton,
      TableHeadDropdown,
      LinkModal,
      TimeSelector,
    },
    data() {
      return {
        itemsOnline: [],
        itemsOffline: [],
        itemStatus: '',
        editingItem: {},        // 正在编辑or上架的广告
        onlineItemCoinAmount: 0, // 正在上架的广告的数量
        isItemAmountEditing: false,   // 正在上架的广告的币量，是否在编辑
        isItemEditing: false,   // 是否在编辑广告
        queryParams: {},
        showConstraintModal: false,
        itemLimitReason: null,
        showPriceAlertModal: false,
        priceAlert: {},
        startTimeRangeValue: -1, // 接单开始时间
        endTimeRangeValue: -1, // 接单结束时间
      }
    },
    head() {
      return {
        title: '广告管理' +
        this.$t('global.pageTitle.common')
      }
    },
    watch: {
      'user.settings'() {
        if (this.user && this.user.settings) {
          const {available_start_time: startTime, available_end_time: endTime} = this.user.settings
          if (startTime === 0 && endTime === 0) {
            this.startTimeRangeValue = -1
            this.endTimeRangeValue = -1
          } else {
            this.startTimeRangeValue = startTime
            this.endTimeRangeValue = endTime
          }
        }
      },
    },
    computed: {
      ...mapState(['user', 'constant', 'balance']),
      startTimeRangeOptions() {
        return this.getTimeRangeOptions('available_start_time')
      },
      endTimeRangeOptions() {
        return this.getTimeRangeOptions('available_end_time')
      },
      // 当前展示的广告列表
      itemsCurrent: function () {
        return this.itemStatus === this.constant.ITEM_STATUS.ONLINE ? this.itemsOnline : this.itemsOffline
      },
      filterOptions: function () {
        return [{
          text: '进行中',
          value: this.constant.ITEM_STATUS.ONLINE,
        }, {
          text: '已下架',
          value: this.constant.ITEM_STATUS.OFFLINE,
        }]
      },
      itemTypeOptions() {
        return [
          {text: '不限', value: null, active: true},
          {text: '买', value: this.constant.SIDE.BUY, active: false},
          {text: '卖', value: this.constant.SIDE.SELL, active: false},
        ]
      },
      coinTypeFilterOptions() {
        const defaultOption = {
          active: true,
          text: '不限',
          value: null,
        }
        return [defaultOption, ...this.constant.COIN_TYPE_OPTIONS.map(item => ({active: false, ...item}))]
      },
      // 正在编辑的广告是否有效
      editingAmountValid: function () {
        return this.editingItem.side === this.constant.SIDE.BUY || Number(this.onlineItemCoinAmount) <= Number(this.balance.otcMap[this.editingItem.coin_type].available)
      },
      itemTableFields: function () {
        const fields = {
          id: {
            label: '广告编号',
            thClass: ['pl-20', 'w-120'],
            tdClass: ['pl-40', 'w-120', 'text-left'],
          },
          side: {
            label: '类型',
            thStyle: {
              width: '100px'
            },
          },
          coin_type: {
            label: '币种',
            thStyle: {
              width: '100px'
            },
          },
          remain_coin_amount: {
            label: '数量',
            thStyle: {
              width: '150px'
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
              width: '250px'
            },
          },
        }

        if (this.itemStatus === this.constant.ITEM_STATUS.ONLINE) {
          fields.on_time = {
            label: '上架时间',
            thStyle: {},
          }
        } else {
          fields.off_time = {
            label: '下架时间',
            thStyle: {},
          }
        }

        fields.action = {
          label: '操作',
          thStyle: {
            width: '150px',
          },
          thClass: ['text-right', 'pr-30'],
          tdClass: ['text-right', 'pr-30'],
        }

        return fields
      }
    },

    fetch({app, store, redirect, route, req}) {
      app.axios.init(req)
      return Promise.all([
        store.dispatch('fetchUserMerchant'),
        store.dispatch('fetchOtcBalance'),
        store.dispatch('fetchExchangeRate'),
        store.dispatch('fetchUserPayments'),
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
      onBeforeClickTimeSelector(data, type) { // 点击接单时间段下拉选项前的检查，防止设置同一时间段
        const timeMap = {
          available_start_time: 'available_end_time',
          available_end_time: 'available_start_time',
        }
        if (data.value > 0 && data.value === this.user.settings[timeMap[type]]) {
          this.$errorTips('不能设置同一时间段')
          return false
        }
        return true
      },
      onClickTimeSelector(data, type) { // 修改接单时间, 逻辑很复杂。。。请亲自问作者
        let finalData = {
          [type]: data.value,
        }
        if (data.value === -1) {
          finalData = {
            available_start_time: 0,
            available_end_time: 0,
          }
          this.startTimeRangeValue = -1
          this.endTimeRangeValue = -1
        } else {
          const {available_start_time: startTime, available_end_time: endTime} = this.user.settings
          if (startTime === 0 && endTime === 0 && type === 'available_start_time') { // 从`不设置`状态到具体时间状态
            this.startTimeRangeValue = data.value
            let nextTime = data.value + 30
            if (nextTime > this.startTimeRangeOptions[this.startTimeRangeOptions.length - 1].value) {
              nextTime = this.startTimeRangeOptions[1].value
            }

            finalData.available_end_time = nextTime // 结束时间给个延后30分钟的时间，防止一直显示`不设置`
          } else {
            if (type === 'available_start_time') {
              this.startTimeRangeValue = data.value
            } else if (type === 'available_end_time') {
              this.endTimeRangeValue = data.value
            }
          }
        }
        this.$store.dispatch('setUserSettings', {
          ...this.user.settings,
          ...finalData,
        }).catch(err => {
          this.$errorTips(`设置失败，error=${err}`)
        })
      },
      getTimeRangeOptions(type) {
        const {settings} = this.user
        const range = []
        if (settings) {
          const availableTime = settings[type]
          const {available_start_time: startTime, available_end_time: endTime} = settings
          const notAvailable = (startTime === 0 && endTime === 0) // 开始与结束时间都为0表示不设置接单时间
          range.push({text: '不设置', value: -1, active: notAvailable})
          for (let i = 0, step = 0; i < 24; i++) {
            range.push({text: `${`${i}`.padStart(2, '0')}:00`, value: step, active: availableTime === step && !notAvailable})
            step += 30
            range.push({text: `${`${i}`.padStart(2, '0')}:30`, value: step, active: availableTime === step && !notAvailable})
            step += 30
          }
        }
        return range
      },
      onClickSideDropdown(item) {
        this.queryParams.side = item.value
        this.getItems()
      },
      onClickCoinTypeDropdown(item) {
        this.queryParams.coin_type = item.value
        this.getItems()
      },
      getItems() {
        const params = Object.assign({}, this.queryParams, {status: this.itemStatus})
        this.axios.item.userItems(params).then(res => {
          res.data.forEach(item => {
            item.itemLimit = this.helpers.getItemLimit(item)
          })
          this[this.itemStatus === this.constant.ITEM_STATUS.ONLINE ? 'itemsOnline' : 'itemsOffline'] = res.data
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      onUserStatusChange(bool) {
        this.axios.user.changeMerchantAvailable(bool).then(res => {
          return this.$store.dispatch('fetchUserMerchant')
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
          // 每次下架之后都重新请求资产数据
          this.$store.dispatch('fetchOtcBalance')
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      onClickOutsideAmount() {
        if (this.isItemAmountEditing) {
          this.isItemAmountEditing = false
        }
      },
      async onItemOnline(item, e) {
        const constraintResponse = await this.axios.user.dynamicConstraint()
        const constraint = constraintResponse.data
        if (!constraint.can_publish_item) {
          this.showConstraintModal = true
          this.itemLimitReason = constraint.item_limit_reason
          return
        }
        const onlineItems = this.itemsOnline.filter(onlineItem => onlineItem.coin_type === item.coin_type && onlineItem.side === item.side)

        if (onlineItems.length >= 2) {
          return this.$errorTips('每个币种每个类型的广告最多只能上架2条')
        }

        if (!this.user.payments.some(payment => payment.status === this.constant.PAYMENT_STATUS.ON)) {
          return this.$showDialog({
            title: '开启支付方式',
            content: '您需要开启支付方式后，才可以上架广告。',
            okTitle: '去开启',
            onOk: () => {
              this.$router.push('/my/payments')
            }
          })
        }

        this.editingItem = item
        this.onlineItemCoinAmount = item.remain_coin_amount

        const rect = e.target.getBoundingClientRect()
        this.$refs['coin-amount'].$el.style.left = rect.left - 420 + 'px'
        this.$refs['coin-amount'].$el.style.top = rect.top + window.scrollY - 30 + 'px'
        // 为了与clickoutside兼容，所以在nextTick再显示
        this.$nextTick(() => {
          this.isItemAmountEditing = true
        })
      },
      onItemOnlineConfirm() {
        if (!this.editingAmountValid) return
        // 判定价格是否偏离, 广告发布页面有一个类似的上架
        const delta = this.constant.ITEM_PRICE_DELTA
        const basePrice = this.balance.currentRate[this.editingItem.coin_type]
        const direction = this.editingItem.side === this.constant.SIDE.BUY ? 1 : -1
        const bias = (this.editingItem.price - basePrice) * direction / basePrice
        if (basePrice && bias > delta) {
          this.priceAlert = {
            price: this.editingItem.price,
            isEdit: true,
            direction,
            bias,
            basePrice,
          }
          this.showPriceAlertModal = true
        } else {
          this.confirmSumbitItemOnline()
        }
      },
      confirmSumbitItemOnline() {
        this.axios.item.online(this.editingItem.id, this.onlineItemCoinAmount).then(res => {
          this.getItems()
          // 每次上架之后都重新请求资产数据
          this.$store.dispatch('fetchOtcBalance')
          this.isItemAmountEditing = false
        }).catch(err => {
          this.axios.onError(err)
        })
      },
      onItemOnlineCancel() {
        this.isItemAmountEditing = false
      },
      onItemDelete(item) {
        this.$showDialog({
          title: '删除广告',
          content: '删除的广告将不可恢复。',
          onOk: () => {
            this.axios.item.delete(item.id).then(res => {
              this.getItems()
              this.$showTips('删除成功')
            }).catch(err => {
              this.axios.onError(err)
            })
          }
        })
      },

      onItemPublished() {
        this.itemStatus === this.constant.ITEM_STATUS.ONLINE && this.getItems()
      },

      onItemEdit(item) {
        this.isItemEditing = true
        this.editingItem = item
      },

      onItemEdited() {
        this.isItemEditing = false
        this.getItems()
      }
    }
  }
</script>
