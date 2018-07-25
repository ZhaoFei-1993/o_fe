<style lang="scss">
  @import "~assets/scss/variables.scss";

  .publish-item-modal {
    .modal-dialog {
      max-width: 940px !important;
    }
    // custom
    .col-form-label {
      font-size: 18px;
      margin-bottom: 5px;
      margin-top: 30px;
    }

    div[role="group"] {
      /*display: flex;*/
    }
    // layout
    .col-left,
    .col-right {
      flex: 1 1 400px;
      max-width: 400px;
    }

    .col-right {
      margin-left: 40px;
    }

    .input-label {
      color: #6f6f6f;
      margin-bottom: 5px;
    }

    .group-purpose {
      div[role="group"] {
        display: flex;
      }
    }

    .item-price-group {
      .item-float-price-container {
        margin-top: 10px;
        display: flex;
        align-items: center;

        .item-price-container {
          flex: 1 1 250px;
        }

        .icon-bothway {
          width: 50px;
          text-align: center;
        }

        .item-float-rate-container {
          flex: 1 1 150px;
        }

        .item-price-limit-container {
          margin-left: 30px;
          flex: 1 1 300px;
        }
      }

      .item-price-float {
      }
    }

    .coin-amount-group {
      .coin-amount-container {
        display: flex;
      }
    }

    .order-cash-limit-group {
      margin-top: 20px;
      margin-bottom: 0;

      div[role="group"] {
        display: flex;
        align-items: center;
      }

      .order-cash-limit-separator {
        width: 50px;
        text-align: center;
        color: #6f6f6f;
      }
    }

    .more-setting-container {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted $brandGreen;

      .btn-more-setting {
        font-size: 18px;
      }
    }
  }
</style>

<template>
  <b-modal class="publish-item-modal"
           v-model="modalShowing"
           size="lg" ok-variant="gradient-yellow" cancel-variant="outline-green" button-size="lg"
           :title="editing ? '编辑广告' : '发布广告'"
           :okTitle="editing ? '保存' : '确定'"
           cancelTitle="取消"
           @ok="onSubmit">
    <b-form v-if="balance.currentRate">
      <!--<TabButtons :tabs="tradeSideOptions" v-model="form.side"/>-->
      <b-form-group label="我想" class="group-purpose">
        <b-form-select v-model="form.side" :disabled="editing" class="col-left" :options="tradeSideOptions"></b-form-select>
        <b-form-select v-model="form.coin_type" :disabled="editing" class="col-right" :options="constant.COIN_TYPE_OPTIONS" @input="onCoinTypeChange"></b-form-select>
      </b-form-group>

      <b-form-group label="交易价格" class="item-price-group">
        <b-form-radio-group v-model="form.pricing_type" :options="pricingTypeOptions" class="mb-10" @input="onPricingTypeChange"></b-form-radio-group>

        <div v-if="form.pricing_type === constant.PRICING_TYPE.FIXED">
          <div class="input-label" todo="todo:应该是参考价格吧？">
            当前市场价格
            <b-btn variant="plain-yellow" size="xxs" @click="onSetPrice2MarketPrice">{{marketPrice}}</b-btn>
            <CTooltip content="采用Bitfinex、Coinbase和Bitstamp 三个交易所的平均价格，仅供参考。" x="4"/>
          </div>
          <CurrencyInput v-model="form.price" :currency="balance.currentCash" :decimalDigit="2" placeholder="请输入价格" class="col-left"/>
        </div>

        <div v-else class="item-float-price-container">
          <div class="item-price-container">
            <div class="input-label">
              当前市场价格
              <b-btn variant="plain-yellow" size="xxs" @click="onSetPrice2MarketPrice">{{marketPrice}}</b-btn>
              <CTooltip content="采用Bitfinex、Coinbase和Bitstamp 三个交易所的平均价格，仅供参考。" x="4"/>
            </div>
            <CurrencyInput v-model="form.price" :currency="balance.currentCash" :decimalDigit="2" :disabled="true" placeholder="请输入价格"/>
          </div>

          <i class="iconfont icon-bothway"></i>

          <div class="item-float-rate-container">
            <div class="input-label">
              浮动比例
              <CTooltip content=" 以当前市场价为基数设定浮动比例，大于100%为溢价；小于100%为折价。" x="4"/>
            </div>
            <CurrencyInput v-model="form.float_rate" currency="%" placeholder="请输入价格" :decimalDigit="2"/>
          </div>

          <div class="item-price-limit-container">
            <div class="input-label">
              {{form.side === 'buy' ? '最高单价（可留空）' : '最低单价（可留空）'}}
            </div>
            <CurrencyInput v-model="form.price_limit" :currency="balance.currentCash" :decimalDigit="2" placeholder="请输入价格"/>
          </div>
        </div>
      </b-form-group>

      <b-form-group label="交易数量" class="coin-amount-group">
        <Language text="最多可售[a][/a][c][/c]" v-if="form.side === 'sell'">
          <b-btn slot="a" variant="plain-yellow" @click="onSetCoinAmount2All">{{balance.otcMap[form.coin_type].available}}</b-btn>
          <span slot="c">{{form.coin_type}}</span>
        </Language>
        <div class="coin-amount-container">
          <CurrencyInput v-model="form.coin_amount" :currency="form.coin_type" placeholder="请输入数量" class="col-left"/>
          <div class="col-right fz-22">
            <span>总金额 ≈</span>
            <span class="c-bright-yellow ml-1"> {{totalCash}} {{balance.currentCash}}</span>
          </div>
        </div>
        <div class="c-6f mt-2">
          * 当日取消订单超过3次，会被冻结买入功能。
          <b-link href="todo" class="ml-1" target="_blank">更多交易须知 ></b-link>
        </div>
      </b-form-group>

      <div class="more-setting-container">
        <b-btn variant="plain-green" class="btn-more-setting" size="xs" @click="onClickMoreSetting">
          更多设置 <i class="iconfont icon-double-arrow-down ml-1"></i>
        </b-btn>
        <span class="c-6f fz-18">广告设置 <CTooltip content="更多设置内容，可在广告设置中统一进行设置模板。" size="18" :x="2"/></span>
      </div>

      <!--更多设置-->
      <div v-if="moreSettingShowing">
        <b-form-group label="交易限额" class="order-cash-limit-group">
          <div class="col-left">
            <Language text="最低金额 [p][/p] 元" class="input-label" tag="div">
              <span slot="p">{{constant.DEAL_CASH_AMOUNT.MIN}}</span>
            </Language>
            <CurrencyInput v-model="form.min_deal_cash_amount" :currency="balance.currentCash" placeholder="最低单笔金额" :decimalDigit="2"/>
            <EMsgs :result="$v.form" :messages="itemValidations.messages" keyName="min_deal_cash_amount"/>
          </div>
          <div class="order-cash-limit-separator">至</div>
          <div class="col-right ml-0">
            <Language text="最高金额 [p][/p] 元" class="input-label" tag="div">
              <span slot="p">{{constant.DEAL_CASH_AMOUNT.MAX.formatMoney()}}</span>
            </Language>
            <CurrencyInput v-model="form.max_deal_cash_amount" :currency="balance.currentCash" placeholder="最高单笔金额" :decimalDigit="2"/>
            <EMsgs :result="$v.form" :messages="itemValidations.messages" keyName="max_deal_cash_amount"/>
          </div>
        </b-form-group>

        <b-form-group label="自动回复">
          <b-form-textarea v-model="form.auto_reply_content" rows="3"></b-form-textarea>
          <EMsgs :result="$v.form" :messages="itemValidations.messages" keyName="auto_reply_content" class="ps-a"/>
          <p class="text-right" :class="{'c-red': form.auto_reply_content.length > constant.MAX_AUTO_REPLY_LENGTH}">
            {{form.auto_reply_content.length}} / {{constant.MAX_AUTO_REPLY_LENGTH}}字
          </p>
        </b-form-group>

        <b-form-group label="交易方限制">
          <b-form-checkbox-group v-model="form.counterparty_limit"
                                 :options="constant.COUNTERPARTY_LIMIT_OPTIONS">
          </b-form-checkbox-group>
        </b-form-group>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import TabButtons from '~/components/tab-buttons.vue'
import CurrencyInput from '~/components/currency-input.vue'
import CTooltip from '~/components/c-tooltip.vue'
import EMsgs from '~/components/error-message.vue'
import getItemSettingConfig from './item-setting-config'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

export default {
  name: 'publish-ad-modal',
  components: {
    TabButtons,
    CurrencyInput,
    CTooltip,
    EMsgs,
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    editing: Boolean,     // 当前是否编辑广告
    editingItem: Object,         // 被编辑的广告
  },
  data() {
    return {
      form: {
        side: 'buy',
        float_rate: 100,
        price: 0,
        price_limit: '',           // 价格限制，根据买卖方向不同，表示最大限制/最小限制
        coin_amount: '',
        pricing_type: 'fixed',
        min_deal_cash_amount: '',
        max_deal_cash_amount: '',
        coin_type: 'BCH',
        cash_type: '',
        auto_reply_content: '',
        counterparty_limit: [],
      },

      moreSettingShowing: false,
    }
  },
  computed: {
    ...mapState(['constant', 'user', 'balance']),
    tradeSideOptions: function () {
      return [{
        value: 'buy',
        text: '购买'
      }, {
        value: 'sell',
        text: '出售'
      }]
    },
    pricingTypeOptions: function () {
      const PRICING_TYPE = this.constant.PRICING_TYPE
      // usdt没有浮动定价
      if (this.form.coin_type === 'USDT') {
        return [{
          value: PRICING_TYPE.FIXED,
          text: '固定价格'
        }]
      } else {
        return [{
          value: PRICING_TYPE.FIXED,
          text: '固定价格'
        }, {
          value: PRICING_TYPE.FLOAT,
          text: '浮动价格',
        }]
      }
    },
    modalShowing: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    // 总额
    totalCash: function () {
      return this.form.coin_amount.decimalMul(this.form.price)
    },
    // 当前coin当前cash下的市场参考价
    marketPrice: function () {
      return this.balance.currentRate[this.form.coin_type]
    },
    itemValidations: function () {
      return this.utils.processValidationConfig(getItemSettingConfig(this.$t, this.$tt))
    }
  },
  validations() {
    return {
      form: this.itemValidations.validations
    }
  },
  watch: {
    'form.price': function (price) {
      // 暂时只有单向变化，不做双向的 jeff 20180724
      // const form = this.form
      // form.float_rate = price.decimalDiv(this.balance.currentRate[form.coin_type]).decimalMul(100)
      //
      // if (form.side === 'buy' && form.price_limit < price && Number(price) !== 0) form.price_limit = price
      // if (form.side === 'sell' && form.price_limit > price && Number(price) !== 0) form.price_limit = price
    },
    'form.float_rate': function (floatRate) {
      if (this.form.pricing_type !== this.constant.PRICING_TYPE.FLOAT) return
      // 价格限制2位小数
      this.form.price = floatRate.decimalDiv(100).decimalMul(this.balance.currentRate[this.form.coin_type]).setDigit(2)
    },
    // 用editingItem覆盖form
    editingItem: function (newValue) {
      Object.assign(this.form, newValue, {
        coin_amount: newValue.remain_coin_amount // 一个现有的广告，其amount是 remain_coin_amount
      })
    }
  },
  mounted() {
    return Promise.all([
      this.$store.dispatch('fetchExchangeRate'),
      this.$store.dispatch('fetchOtcBalance'),
      this.$store.dispatch('fetchUserSettings'),
    ]).then(() => {
      // 从用户配置中获取默认的广告配置
      Object.assign(this.form, this.user.settings)
      this.form.price = this.marketPrice
    }).catch(err => {
      if (err.code === this.constant.ERROR_CODE.UNAUTHORIZED) return
      this.axios.onError(err)
    })
  },
  methods: {
    onClickMoreSetting() {
      this.moreSettingShowing = !this.moreSettingShowing
    },
    onSetPrice2MarketPrice() {
      this.form.price = this.balance.currentRate[this.form.coin_type]
    },
    onSetCoinAmount2All() {
      this.form.coin_amount = this.balance.otcMap[this.form.coin_type].available
    },
    onPricingTypeChange(pricingType) {
      const form = this.form
      // form.price_limit = this.marketPrice
      form.price = this.marketPrice
      form.float_rate = 100
    },

    doCreateOrUpdateItem(isEdit) {
      const itemPromise = isEdit ? this.axios.item.updateItem : this.axios.item.createItem

      itemPromise(this.form).then(res => {
        this.$showTips(isEdit ? '广告编辑成功' : '广告发布成功')

        this.$emit(isEdit ? 'edited' : 'published', this.form)
      }).catch(err => {
        const ERROR_CODE = this.constant.ERROR_CODE
        if (err.code === ERROR_CODE.MISSING_PAY_METHODS) {
          this.$showTips('缺少支付方式，请先添加支付方式')   // todo:可能需要在点击之前就提示
        } else {
          this.axios.onError(err)
        }
      })
    },

    onSubmit(e) {
      e.preventDefault()
      this.$v.$touch()
      if (this.$v.$invalid) return

      const form = this.form
      if (!Number(form.price)) return this.$showTips('价格不可以为0')
      if (!Number(form.coin_amount)) return this.$showTips('请输入交易数量')
      if (form.auto_reply_content.length > this.constant.MAX_AUTO_REPLY_LENGTH) return this.$showTips(this.$tt('最大自动回复长度不可超过{0}', this.constant.MAX_AUTO_REPLY_LENGTH))

      if (this.editing) {
        this.doCreateOrUpdateItem(true)
      } else {
        this.form.cash_type = this.balance.currentCash
        this.doCreateOrUpdateItem(false)
      }

      // if (Math.abs((form.price / this.marketPrice) - 1) > 0.1) {
      //   this.$showDialog({
      //     title: '差价过大',
      //     content: '当前价格偏离市价过大，将可能不会显示在首页。确认要以此价格下交易单？',
      //     onOk: () => {
      //       this.doCreateItem()
      //     }
      //   })
      // } else {
      //   this.doCreateItem()
      // }
    },
    onCoinTypeChange() {
      this.form.price = this.balance.currentRate[this.form.coin_type]
      // usdt没有浮动定价
      if (this.form.coin_type === 'USDT') {
        this.form.pricing_type = this.constant.PRICING_TYPE.FIXED
      }
    }
  }
}
</script>
