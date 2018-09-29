<style lang="scss">
  @import "~assets/scss/variables.scss";

  .publish-item-modal {
    .modal-dialog {
      max-width: 940px !important;
      .modal-body {
        max-height: 500px;
        overflow-y: auto;
      }
    }
    // custom
    .col-form-label {
      font-size: 18px;
      margin-bottom: 5px;
    }

    .b-form-group {
      margin-bottom: 30px;
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

    .item-total-cash {
      display: flex;
      align-items: center;
    }

    .input-label {
      margin-bottom: 5px;
      font-size: 14px;
      color: #6f6f6f;
    }

    .group-purpose {
      div[role="group"] {
        display: flex;
      }
    }

    .item-price-group {
      .item-float-price-container {
        margin-top: 25px;
        display: flex;
        align-items: center;

        .item-price-container {
          flex: 1 1 250px;
        }

        .icon-bothway {
          margin-top: 25px;
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

    .auto-reply-group {
      position: relative;

      .auto-reply-content-limit {
        margin-top: 2px;
        position: absolute;
        width: 100%;
        text-align: right;
        font-size: 14px;
        color: #6f6f6f;
      }
    }

    .counterparty-limit-group {
      margin-bottom: -5px;
    }

    .more-setting-container {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted $brandGreen;

      .btn-more-setting {
        font-size: 18px;
      }

      .icon-double-arrow-down {
        display: inline-block;
        transition: 0.4s transform;

        &.upsideDown {
          transform: rotateZ(180deg);
        }
      }
    }
  }
</style>

<template>
  <div>
    <b-modal class="publish-item-modal"
             v-model="modalShowing"
             size="lg" ok-variant="gradient-yellow" cancel-variant="outline-green" button-size="lg"
             :title="editing ? '编辑广告' : '发布广告'"
             :okTitle="editing ? '保存并发布' : '确定'"
             cancelTitle="取消"
             :noCloseOnBackdrop="true"
             @ok="onSubmit">
      <b-form v-if="balance.currentRate">
        <!--<TabButtons :tabs="tradeSideOptions" v-model="form.side"/>-->
        <b-form-group label="我想" class="group-purpose">
          <b-form-select v-model="form.side" :disabled="editing" class="col-left fz-16"
                         :options="tradeSideOptions"></b-form-select>
          <b-form-select v-model="form.coin_type" :disabled="editing" class="col-right fz-16"
                         :options="constant.COIN_TYPE_OPTIONS" @input="onCoinTypeChange"></b-form-select>
        </b-form-group>

        <b-form-group label="交易价格" class="item-price-group">
          <b-form-radio-group v-model="form.pricing_type" :options="pricingTypeOptions"
                              class="mb-10"></b-form-radio-group>

          <div v-if="form.pricing_type === constant.PRICING_TYPE.FIXED" class="mt-25">
            <div class="input-label">
              当前参考价格
              <b-btn variant="plain-yellow" size="xxs" @click="onSetPrice2MarketPrice">{{marketPrice}}</b-btn>
              <CTooltip v-if="form.coin_type !== 'USDT'" content="采用Bitfinex、Coinbase和Bitstamp 三个交易所的平均价格，仅供参考。" x="4"/>
            </div>
            <CurrencyInput v-model="form.price" :currency="balance.currentCash" :decimalDigit="2" placeholder="请输入价格"
                           class="col-left"/>
          </div>

          <div v-else class="item-float-price-container">
            <div class="item-price-container">
              <div class="input-label">
                当前参考价格
                <b-btn variant="plain-yellow" size="xxs" @click="onSetPrice2MarketPrice">{{marketPrice}}</b-btn>
                <CTooltip v-if="form.coin_type !== 'USDT'" content="采用Bitfinex、Coinbase和Bitstamp 三个交易所的平均价格，仅供参考。"
                          x="4"/>
              </div>
              <CurrencyInput :value="floatPrice" :currency="balance.currentCash" :disabled="true" plain
                             placeholder="请输入价格"/>
            </div>

            <i class="iconfont icon-bothway"></i>

            <!--todo: 浮动比例的限制、amount的限制(特别是卖的时候的限制）-->
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
              <CurrencyInput v-model="form.price_limit" :currency="balance.currentCash" :decimalDigit="2"
                             placeholder="请输入价格"/>
            </div>
          </div>
        </b-form-group>

        <b-form-group label="交易数量" class="coin-amount-group">
          <div v-if="form.side === constant.SIDE.SELL && balance.otcMap">
            <Language text="最多可售[a][/a][c][/c]">
              <b-btn slot="a" variant="plain-yellow" @click="onSetCoinAmount2All">
                {{balance.otcMap[form.coin_type].available}}
              </b-btn>
              <span slot="c">{{form.coin_type}}</span>
            </Language>
            <b-btn variant="plain-green" size="xxs" class="ml-10" @click="onSetCoinAmount2All">全部出售</b-btn>
          </div>

          <div class="coin-amount-container">
            <!--todo:coin_amount、float_rate最大值100,000,000-->
            <CurrencyInput v-model="form.coin_amount" :currency="form.coin_type" placeholder="请输入数量" class="col-left"/>
            <div class="item-total-cash col-right">
              <span class="fz-16">总金额 ≈</span>
              <span class="c-bright-yellow fz-22 ml-1"> {{totalCash}} {{balance.currentCash}}</span>
            </div>
          </div>
          <div class="c-9b mt-2 fz-14">
            *
            <span v-if="form.side === constant.SIDE.BUY">
            当日取消订单超过3次，会被限制交易功能。
          </span>
            <span v-else>
            广告上架期间，您的数字货币会被冻结。
          </span>
            <b-link href="https://support.coinex.com/hc/articles/360007643734" class="ml-1" target="_blank">更多交易须知 >
            </b-link>
          </div>
        </b-form-group>

        <div class="more-setting-container">
          <b-btn variant="plain-green" class="btn-more-setting" size="xs" @click="onClickMoreSetting">
            更多设置 <i class="iconfont icon-double-arrow-down" :class="{'upsideDown': moreSettingShowing}"></i>
          </b-btn>
          <b-btn class="btn-item-setting" variant="plain" to="/my/item-setting" @click="onClickItemSetting">
            广告设置
            <CTooltip content="交易限额、自动回复、交易方限制可在广告设置中统一编辑默认值" size="16" :x="2"/>
          </b-btn>
        </div>

        <!--更多设置-->
        <div v-if="moreSettingShowing">
          <b-form-group label="交易限额" class="order-cash-limit-group">
            <div class="col-left">
              <Language text="最低金额 [p][/p] 元" class="input-label" tag="div">
                <span slot="p">{{constant.DEAL_CASH_AMOUNT.MIN}}</span>
              </Language>
              <CurrencyInput v-model="form.min_deal_cash_amount" :currency="balance.currentCash" placeholder="最低单笔金额"
                             :decimalDigit="2"/>
              <EMsgs :result="$v.form" :messages="itemValidations.messages" keyName="min_deal_cash_amount"/>
            </div>
            <div class="order-cash-limit-separator">至</div>
            <div class="col-right ml-0">
              <Language text="最高金额 [p][/p] 元" class="input-label" tag="div">
                <span slot="p">{{constant.DEAL_CASH_AMOUNT.MAX.formatMoney()}}</span>
              </Language>
              <CurrencyInput v-model="form.max_deal_cash_amount" :currency="balance.currentCash" placeholder="最高单笔金额"
                             :decimalDigit="2"/>
              <EMsgs :result="$v.form" :messages="itemValidations.messages" keyName="max_deal_cash_amount"/>
            </div>
          </b-form-group>

          <b-form-group label="商家备注" class="auto-reply-group">
            <b-form-textarea v-model="form.remark" rows="3" class="fz-14"></b-form-textarea>
            <EMsgs :result="$v.form" :messages="itemValidations.messages" keyName="remark" class="ps-a"/>
            <p class="auto-reply-content-limit"
               :class="{'c-red': form.remark.length > constant.MAX_REMARK_LENGTH}">
              {{form.remark.length}} / {{constant.MAX_REMARK_LENGTH}}字
            </p>
          </b-form-group>

          <b-form-group label="自动回复" class="auto-reply-group">
            <b-form-textarea v-model="form.auto_reply_content" rows="3" class="fz-14"></b-form-textarea>
            <EMsgs :result="$v.form" :messages="itemValidations.messages" keyName="auto_reply_content" class="ps-a"/>
            <p class="auto-reply-content-limit"
               :class="{'c-red': form.auto_reply_content.length > constant.MAX_AUTO_REPLY_LENGTH}">
              {{form.auto_reply_content.length}} / {{constant.MAX_AUTO_REPLY_LENGTH}}字
            </p>
          </b-form-group>

          <b-form-group label="交易方限制" class="counterparty-limit-group">
            <b-form-checkbox-group v-model="form.counterparty_limit"
                                   :options="constant.COUNTERPARTY_LIMIT_OPTIONS"
                                   class="fz-14" style="line-height: 21px;">
            </b-form-checkbox-group>
          </b-form-group>
        </div>
      </b-form>
    </b-modal>
    <b-modal title="价格警告"
             ok-variant="gradient-yellow"
             cancel-variant="outline-green"
             button-size="lg"
             class="text-center"
             v-model="showPriceAlertModal"
             okTitle="确认发布"
             cancel-title="取消"
             @cancel="reopenPublishModal"
             @ok="confirmPriceAlert">
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
          side: 'sell',  // 方向 buy/sell
          float_rate: 100, // 浮动比例, float定价类型必填
          price: 0, // 单价，fixed定价类型必填
          price_limit: 0, // 价格限制，根据买卖方向不同，表示最大限制/最小限制
          coin_amount: '', // 币量
          pricing_type: 'float', // 定价方式 fixed/float，除了usdt外默认是浮动价格
          min_deal_cash_amount: '', // 最小成交额
          max_deal_cash_amount: '', // 最大成交额
          coin_type: 'BCH',  // 币种
          cash_type: '', // 法币类型
          auto_reply_content: '', // 自动回复内容
          counterparty_limit: [],
          remark: '',
        },
        priceAlert: {},
        showPriceAlertModal: false,
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
          this.form.pricing_type = 'fixed'
          return [{
            value: PRICING_TYPE.FIXED,
            text: '固定价格'
          }]
        } else {
          this.form.pricing_type = 'float'
          return [{
            value: PRICING_TYPE.FLOAT,
            text: '浮动价格',
          }, {
            value: PRICING_TYPE.FIXED,
            text: '固定价格'
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
        const price = this.form.pricing_type === this.constant.PRICING_TYPE.FIXED ? this.form.price : this.floatPrice
        return this.form.coin_amount.decimalMul(price).setDigit(2)
      },
      // 当前coin当前cash下的市场参考价
      marketPrice: function () {
        return this.balance.currentRate[this.form.coin_type]
      },
      floatPrice() {
        return (this.marketPrice * this.form.float_rate / 100).setDigit(2)
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
      // 用editingItem覆盖form
      editingItem: function (newValue) {
        Object.assign(this.form, newValue, {
          coin_amount: newValue.remain_coin_amount // 一个现有的广告，其amount是 remain_coin_amount
        })
      },
      $route: function (route) {
        this.onRouteChange(route)
      }
    },
    mounted() {
      this.onRouteChange(this.$route)

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
      onRouteChange(route) {
        // 可能会重复打开弹窗，不需要更新方向
        const {coin, side} = route.query
        if (coin) {
          this.form.coin_type = coin
        }
        if (side) {
          this.form.side = side === 'sell' ? 'buy' : 'sell'
        }
      },
      onClickMoreSetting() {
        this.moreSettingShowing = !this.moreSettingShowing
        if (this.moreSettingShowing) {
          this.$nextTick(() => document.querySelector('.more-setting-container').scrollIntoView())
        }
      },
      onClickItemSetting() {
        this.$emit('input', false)
      },
      onSetPrice2MarketPrice() {
        this.form.price = this.balance.currentRate[this.form.coin_type]
      },
      onSetCoinAmount2All() {
        this.form.coin_amount = this.balance.otcMap[this.form.coin_type].available
      },
      doCreateOrUpdateItem(isEdit) {
        // 判定价格是否偏离, 广告管理页面有一个类似的上架
        const delta = this.constant.ITEM_PRICE_DELTA
        const basePrice = parseFloat(this.balance.currentRate[this.form.coin_type])
        const price = this.form.pricing_type === this.constant.PRICING_TYPE.FIXED ? this.form.price : this.floatPrice
        const direction = this.form.side === this.constant.SIDE.BUY ? 1 : -1
        const bias = price * direction / basePrice
        if (basePrice && bias > delta) {
          this.priceAlert = {
            price: this.form.price,
            isEdit,
            direction,
            bias,
            basePrice,
          }
          this.showPriceAlertModal = true
        } else {
          this.confirmSumbit(isEdit)
        }
      },
      confirmPriceAlert() {
        this.confirmSumbit(this.priceAlert.isEdit)
      },
      confirmSumbit(isEdit) {
        this.$emit('input', false)
        const itemPromise = isEdit ? this.axios.item.updateAndOnlineItem : this.axios.item.createItem
        itemPromise(this.form).then(res => {
          this.$showTips('广告发布成功')
          this.$emit(isEdit ? 'edited' : 'published', this.form)
        }).catch(err => {
          const ERROR_CODE = this.constant.ERROR_CODE
          if (err.code === ERROR_CODE.MISSING_PAY_METHODS) {
            this.$showTips('缺少支付方式，请先添加支付方式')
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
      },
      onCoinTypeChange() {
        // 很奇葩，即使是数据层面改变了coin_type，也会触发b-form-select的input事件，进而调用本函数。
        // 所以需要判断下，如果是编辑广告的时候，不能将当前广告设置为市价，需要保持原价格不变
        if (!this.editing) {
          this.form.price = this.balance.currentRate[this.form.coin_type]
        }
        // usdt没有浮动定价
        if (this.form.coin_type === 'USDT') {
          this.form.pricing_type = this.constant.PRICING_TYPE.FIXED
        }
      },
      reopenPublishModal() {
        this.$emit('input', true)
      }
    }
  }
</script>
