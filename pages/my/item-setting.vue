<style lang="scss">
  .page-item-setting {

    .currency-input {
      display: inline-block;
      width: 190px;
    }

    .setting-button-group {
      display: flex;
      margin-top: 4px;

      .btn {
        margin-left: 10px;
      }
    }

    .auto-reply-content {
      word-break: break-all;
    }
  }
</style>

<template>
  <CBlock class="page-item-setting" :x="0" :y="0">
    <h3 class="layout-my-title">
      广告设置
      <b-link to="/my/items" class="ml-15 fz-16">管理我的广告</b-link>
    </h3>

    <p class="layout-my-desc">管理与广告相关的快捷操作</p>

    <MyInfoItem title="交易限额">
      <div slot="content">
        <div v-if="amountLimitEditing" class="d-flex">
          <div>
            <CurrencyInput v-model="editingSettings.min_deal_cash_amount" :currency="settings.cash_type" :decimalDigit="2"/>
            <EMsgs :result="$v.editingSettings" :messages="editingSettingsValidation.messages" keyName="min_deal_cash_amount" class="ps-a"/>
          </div>
          <span class="fz-12 mx-2 mt-10">—</span>
          <div>
            <CurrencyInput v-model="editingSettings.max_deal_cash_amount" :currency="settings.cash_type" :decimalDigit="2"/>
            <EMsgs :result="$v.editingSettings" :messages="editingSettingsValidation.messages" keyName="max_deal_cash_amount" class="ps-a"/>
          </div>
        </div>
        <div v-else>
          {{settings.min_deal_cash_amount}} {{settings.cash_type}} — {{settings.max_deal_cash_amount}}
          {{settings.cash_type}}
        </div>
      </div>

      <div slot="action" class="setting-button-group">
        <template v-if="amountLimitEditing">
          <b-btn variant="gradient-yellow" size="xs" @click="onEditAmountLimitConfirm">确定</b-btn>
          <b-btn variant="outline-green" size="xs" @click="onEditAmountLimitCancel">取消</b-btn>
        </template>
        <b-btn v-else variant="outline-green" size="xs" @click="onEditAmountLimit">修改</b-btn>
      </div>
    </MyInfoItem>

    <MyInfoItem title="自动回复">
      <template slot="content">
        <div slot="content" v-if="autoReplyEditing">
          <b-form-textarea v-model="editingSettings.auto_reply_content" rows="3"></b-form-textarea>
          <p class="text-right" :class="{'c-red': editingSettings.auto_reply_content.length > constant.MAX_AUTO_REPLY_LENGTH}">
            {{editingSettings.auto_reply_content.length}} / {{constant.MAX_AUTO_REPLY_LENGTH}}字
          </p>
          <EMsgs :result="$v.editingSettings" :messages="editingSettingsValidation.messages" keyName="auto_reply_content" style="margin-top: -20px;"/>
        </div>
        <p v-else class="auto-reply-content">{{settings.auto_reply_content ? settings.auto_reply_content : '无'}}</p>
      </template>

      <div slot="action" class="setting-button-group">
        <template v-if="autoReplyEditing">
          <b-btn variant="gradient-yellow" size="xs" @click="onEditAutoReplyConfirm">确定</b-btn>
          <b-btn variant="outline-green" size="xs" @click="onEditAutoReplyCancel">取消</b-btn>
        </template>
        <b-btn v-else variant="outline-green" size="xs" @click="onEditAutoReply">修改</b-btn>
      </div>
    </MyInfoItem>

    <MyInfoItem title="交易方限制">
      <div slot="content">
        <!--这里很有意思，一定要在有counterparty_limit之后再渲染，不然刚开始 === undefined，组件追踪不到，造成无法修改-->
        <b-form-checkbox-group v-if="editingSettings.counterparty_limit"
                               v-model="editingSettings.counterparty_limit"
                               :disabled="!counterpartyLimitEditing"
                               :options="constant.COUNTERPARTY_LIMIT_OPTIONS"
                               stacked>
        </b-form-checkbox-group>
      </div>

      <div slot="action" class="setting-button-group">
        <template v-if="counterpartyLimitEditing">
          <b-btn variant="gradient-yellow" size="xs" @click="onEditCounterpartyLimitConfirm">确定</b-btn>
          <b-btn variant="outline-green" size="xs" @click="onEditCounterpartyLimitCancel">取消</b-btn>
        </template>
        <b-btn v-else variant="outline-green" size="xs" @click="onEditCounterpartyLimit">修改</b-btn>
      </div>
    </MyInfoItem>
  </CBlock>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'
  import MyInfoItem from './_c/my-info-item.vue'
  import CurrencyInput from '~/components/currency-input.vue'
  import EMsgs from '~/components/error-message.vue'
  import getSettingConfig from '~/components/publish-item-modal/item-setting-config'
  import Vuelidate from 'vuelidate'

  Vue.use(Vuelidate)

  export default {
    name: 'page-item-setting',
    components: {
      MySidebar,
      My2Column,
      MyInfoItem,
      CurrencyInput,
      EMsgs,
    },
    data() {
      return {
        amountLimitEditing: false,
        autoReplyEditing: false,
        counterpartyLimitEditing: false,
        editingSettings: {},            // settings的缓存，仅在编辑设置的时候使用
      }
    },
    layout: 'my',
    computed: {
      ...mapState(['constant', 'user']),
      settings: function () {
        return this.user.settings ? this.user.settings : {}
      },
      editingSettingsValidation: function () {
        return this.utils.processValidationConfig(getSettingConfig(this.$t, this.$tt))
      }
    },
    validations: function () {
      return {
        editingSettings: this.editingSettingsValidation.validations
      }
    },
    fetch({store, app, req, redirect, route}) {
      app.axios.init(req)

      return Promise.all([
        store.dispatch('fetchUserSettings'),
        store.dispatch('fetchUserMerchant'),
      ]).catch(err => {
        app.axios.needAuth(err, redirect, route.fullPath)
      })
    },
    mounted() {
      this.store2Data()

      if (!(this.user.merchant && this.user.merchant.auth_status === this.constant.MERCHANT_AUTH_STATUS.PASS)) {
        this.$showDialog({
          title: '您还不是认证商家',
          content: '请申请并通过商家认证之后再进行广告设置',
          okTitle: '去认证',
          noCloseOnBackdrop: true,
          hideHeaderClose: true,
          onOk: () => {
            this.$router.push('/my/merchant')
          },
        })
      }
    },
    methods: {
      onEditAmountLimit() {
        this.amountLimitEditing = true
        this.store2Data()
      },
      onEditAmountLimitConfirm() {
        this.$v.editingSettings.min_deal_cash_amount.$touch()
        this.$v.editingSettings.max_deal_cash_amount.$touch()
        if (this.$v.editingSettings.min_deal_cash_amount.$invalid || this.$v.editingSettings.max_deal_cash_amount.$invalid) return

        this.onEditConfirm({
          min_deal_cash_amount: this.editingSettings.min_deal_cash_amount,
          max_deal_cash_amount: this.editingSettings.max_deal_cash_amount
        }).then(res => {
          this.amountLimitEditing = false
        })
      },
      onEditAmountLimitCancel() {
        this.amountLimitEditing = false
      },

      onEditAutoReply() {
        this.autoReplyEditing = true
        this.store2Data()
      },
      onEditAutoReplyConfirm() {
        this.$v.editingSettings.auto_reply_content.$touch()
        if (this.$v.editingSettings.auto_reply_content.$invalid) return

        this.onEditConfirm({
          auto_reply_content: this.editingSettings.auto_reply_content
        }).then(res => {
          this.autoReplyEditing = false
        })
      },
      onEditAutoReplyCancel() {
        this.autoReplyEditing = false
      },

      onEditCounterpartyLimit() {
        this.store2Data()
        this.counterpartyLimitEditing = true
      },
      onEditCounterpartyLimitConfirm() {
        this.onEditConfirm({
          counterparty_limit: this.editingSettings.counterparty_limit
        }).then(res => {
          this.counterpartyLimitEditing = false
        })
      },
      onEditCounterpartyLimitCancel() {
        this.counterpartyLimitEditing = false
      },

      // 将数据同步到本地的editingSettings
      store2Data() {
        this.$set(this, 'editingSettings', JSON.parse(JSON.stringify(this.settings)))
      },

      /**
       * 修改配置
       * @param {Object} data 将要被修改的配置
       */
      onEditConfirm(data) {
        return this.$store.dispatch('setUserSettings', Object.assign({}, this.settings, data)).then(() => {
          return this.store2Data()
        }).catch(err => {
          this.axios.onError(err)
          return Promise.reject(err)
        })
      }
    }
  }
</script>
