<style lang="scss">
  .publish-item-modal {
    .group-purpose {
      > div {
        display: flex;
      }
    }

    .group-item-price {
      .item-price-container {
        display: flex;
        align-items: center;
      }

      .item-price-float {
        align-items: center;
        display: flex;
      }
    }

    .group-coin-amount {
      .group-coin-amount-inner {
        display: flex;
      }
    }

    .group-price-limit {
      > div {
        display: flex;
        align-items: center;
      }
    }
  }
</style>

<template>
  <b-modal class="publish-item-modal" v-model="value" size="lg" title="发布广告" @input="onShowingChange">
    <b-form>
      <b-form-group label="我想" class="group-purpose">
        <b-form-select v-model="form.side" :options="tradeSideOptions"></b-form-select>
        <b-form-select v-model="form.coin_type" :options="currency.coinOptions"></b-form-select>
      </b-form-group>

      <b-form-group label="交易价格" class="group-item-price">
        <b-form-radio-group v-model="form.pricing_type" :options="pricingTypeOptions"></b-form-radio-group>
        <div class="item-price-container">
          <div>
            <div>当前市场价格 <span>{{currency.currentCoinPrices[form.coin_type]}}</span></div>
            <b-input-group :append="currency.currentCashType">
              <b-form-input v-model="form.price"></b-form-input>
            </b-input-group>
          </div>

          <div v-if="form.pricing_type === constant.PRICING_TYPE.FLOAT" class="item-price-float">
            <div>≈≈≈</div>
            <div>
              <div>浮动比例</div>
              <b-input-group append="%">
                <b-form-input v-model="form.floatRate"></b-form-input>
              </b-input-group>
            </div>
            <div>
              <div>最高单价<span>(可留空)</span></div>
              <b-input-group :append="currency.currentCashType">
                <b-form-input v-model="form.price_limit"></b-form-input>
              </b-input-group>
            </div>
          </div>
        </div>
      </b-form-group>

      <b-form-group label="交易数量" class="group-coin-amount">
        <Language text="最多可售[a][/a][c][/c]" v-if="form.side === 'sell'">
          <span slot="a">{{user.balance[form.coin_type]}}</span>
          <span slot="c">{{form.coin_type}}</span>
        </Language>
        <div class="group-coin-amount-inner">
          <b-input-group :append="form.coin_type">
            <b-form-input v-model="form.coin_amount"></b-form-input>
          </b-input-group>
          <div><span>总金额</span>≈<span>{{form.coin_amount * form.price}}</span></div>
        </div>
      </b-form-group>

      <div>
        *当日取消订单超过3次，会被冻结买入功能。
        <b-link>更多交易须知</b-link>
      </div>

      <div>
        <b-btn @click="onClickMoreSetting">更多设置↓</b-btn>
      </div>

      <!--更多设置-->
      <div v-if="moreSettingShowing">
        <b-form-group label="交易限额" class="group-price-limit">
          <div>
            <p>最低金额 400 元</p>
            <b-input-group :append="currency.currentCash">
              <b-form-input v-model="form.min_deal_cash_amount" placeholder="最低单笔金额"></b-form-input>
            </b-input-group>
          </div>
          <div>至</div>
          <div>
            <p>最高金额 1000000 元</p>
            <b-input-group :append="currency.currentCash">
              <b-form-input v-model="form.max_deal_cash_amount" placeholder="最高单笔金额"></b-form-input>
            </b-input-group>
          </div>
        </b-form-group>
        <b-form-group label="自动回复">
          <b-form-textarea v-model="form.auto_reply_content"></b-form-textarea>
        </b-form-group>
        <b-form-group label="交易方限制">
          <b-form-checkbox-group v-model="form.counterpartyLimit"
                                 :options="constant.COUNTERPARTY_LIMIT_OPTIONS">
          </b-form-checkbox-group>
        </b-form-group>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'publish-ad-modal',
  components: {
  },
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {
        side: 'buy',
        float_rate: 1,
        floatRate: 100,
        price: 100,
        price_limit: 100,           // 价格限制，根据买卖方向不同，表示最大限制/最小限制
        coin_amount: 100,
        pricing_type: 'float',
        min_deal_cash_amount: 0,
        max_deal_cash_amount: 100,
        coin_type: '',
        auto_reply_content: '',
        counterpartyLimit: [],
        counterparty_limit: ''
      },

      moreSettingShowing: false,
      pricingTypeOptions: [{
        value: 'float',
        text: '浮动价格',
      }, {
        value: 'fixed',
        text: '固定价格'
      }]
    }
  },
  computed: {
    ...mapState(['currency', 'constant', 'user']),
    // pricingTypeOptions: function () {
    //   return [{
    //     value: 'float',
    //     text: '浮动价格',
    //   }, {
    //     value: 'fixed',
    //     text: '固定价格'
    //   }]
    // },
    tradeSideOptions: function () {
      return [{
        value: 'buy',
        text: '购买'
      }, {
        value: 'sell',
        text: '出售'
      }]
    },
  },
  mounted() {
    this.$store.dispatch('fetchUserBalance')
  },
  methods: {
    onShowingChange(bool) {
      this.$emit('change', bool)
    },
    onClickMoreSetting() {
      this.moreSettingShowing = !this.moreSettingShowing
    }
  }
}
</script>
