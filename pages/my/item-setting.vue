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
        <div v-if="amountLimitEditing">
          <CurrencyInput v-model="editingSettings.min_deal_cash_amount" :currency="balance.currentCash"/>
          <span class="fz-12 mx-2">—</span>
          <CurrencyInput v-model="editingSettings.max_deal_cash_amount" :currency="balance.currentCash"/>
        </div>
        <div v-else>
          {{settings.min_deal_cash_amount}} {{balance.currentCash}} — {{settings.max_deal_cash_amount}} {{balance.currentCash}}
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
          <p class="text-right">20-140字</p>
        </div>
        <p v-else>{{settings.auto_reply_content}}</p>
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
  import {mapState} from 'vuex'
  import MySidebar from '~/components/my-sidebar.vue'
  import My2Column from '~/components/my-2column.vue'
  import MyInfoItem from './_c/my-info-item.vue'
  import CurrencyInput from '~/components/currency-input.vue'

  export default {
    name: 'page-item-setting',
    components: {
      MySidebar,
      My2Column,
      MyInfoItem,
      CurrencyInput,
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
      ...mapState(['constant', 'balance', 'user']),
      settings: function () {
        return this.user.settings ? this.user.settings : {}
      }
    },
    mounted() {
      this.$store.dispatch('fetchUserSettings').then(res => {
        this.store2Data()
      })
    },
    methods: {
      onEditAmountLimit() {
        this.amountLimitEditing = true
        this.store2Data()
      },
      onEditAmountLimitConfirm() {
        this.onEditConfirm().then(res => {
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
        this.onEditConfirm().then(res => {
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
        this.onEditConfirm().then(res => {
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
      onEditConfirm() {
        return this.axios.user.setSettings(this.editingSettings).then(res => {
          this.$store.commit('SET_USER_SETTINGS', this.editingSettings)
        })
      }
    }
  }
</script>
