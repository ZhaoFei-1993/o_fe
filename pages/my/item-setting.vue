<style lang="scss">
  .page-item-setting {

  }
</style>

<template>
  <CBlock class="page-item-setting">
    <h3>
      广告设置
      <b-link>管理我的广告</b-link>
    </h3>

    <MyInfoItem title="交易限额">
      <div slot="content">
        <div v-if="amountLimitEditing">
          <b-input-group :append="currency.currentCash">
            <b-input v-model="amount_limit_min"></b-input>
          </b-input-group>
          <b-input-group :append="currency.currentCash">
            <b-input v-model="amount_limit_max"></b-input>
          </b-input-group>
        </div>
        <div v-else>
          {{amount_limit_min}} {{currency.currentCash}} —— {{amount_limit_max}} {{currency.currentCash}}
        </div>
      </div>

      <div slot="action">
        <b-btn variant="plain" @click="onEditAmountLimit">修改</b-btn>
        <template v-if="amountLimitEditing">
          <b-btn variant="success" @click="onEditAmountLimitConfirm">确定</b-btn>
          <b-btn variant="secondary" @click="onEditAmountLimitCancel">取消</b-btn>
        </template>
      </div>
    </MyInfoItem>

    <MyInfoItem title="自动回复">
      <b-form-textarea slot="content" v-model="auto_reply_content" :disabled="!autoReplyEditing"></b-form-textarea>

      <div slot="action">
        <b-btn variant="plain" @click="onEditAutoReply">修改</b-btn>
        <template v-if="autoReplyEditing">
          <b-btn variant="success" @click="onEditAutoReplyConfirm">确定</b-btn>
          <b-btn variant="secondary" @click="onEditAutoReplyCancel">取消</b-btn>
        </template>
      </div>
    </MyInfoItem>

    <MyInfoItem title="交易方限制">
      <b-form-checkbox-group v-model="counterpartyLimit"
                             slot="content"
                             :disabled="!counterpartyLimitEditing"
                             :options="constant.COUNTERPARTY_LIMIT_OPTIONS">
      </b-form-checkbox-group>

      <div slot="action">
        <b-btn variant="plain" @click="onEditCounterpartyLimit">修改</b-btn>
        <template v-if="counterpartyLimitEditing">
          <b-btn variant="success" @click="onEditCounterpartyLimitConfirm">确定</b-btn>
          <b-btn variant="secondary" @click="onEditCounterpartyLimitCancel">取消</b-btn>
        </template>
      </div>
    </MyInfoItem>
  </CBlock>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  import MySidebar from '../../components/my-sidebar.vue'
  import My2Column from '../../components/my-2column.vue'
  import MyInfoItem from './_c/my-info-item.vue'

  export default {
    name: 'page-item-setting',
    components: {
      MySidebar,
      My2Column,
      MyInfoItem,
    },
    data() {
      return {
        amount_limit_min: 0,
        amount_limit_max: 10,
        amountLimitEditing: false,
        auto_reply_content: '我会的辅导辅导辅导费的',
        autoReplyEditing: false,
        counterparty_limit: 0,
        counterpartyLimit: [],
        counterpartyLimitEditing: true,
        backupCache: {}
      }
    },
    layout: 'my',
    computed: {
      ...mapState(['constant', 'currency'])
    },
    methods: {
      onEditAmountLimit() {
        this.amountLimitEditing = true

        this.backup('amount_limit_min')
        this.backup('amount_limit_max')
      },
      onEditAmountLimitConfirm() {
        this.amountLimitEditing = false
      },
      onEditAmountLimitCancel() {
        this.amountLimitEditing = false

        this.restore('amount_limit_min')
        this.restore('amount_limit_max')
      },
      onEditAutoReply() {
        this.autoReplyEditing = true

        this.backup('auto_reply_content')
      },
      onEditAutoReplyConfirm() {
        this.autoReplyEditing = false
      },
      onEditAutoReplyCancel() {
        this.autoReplyEditing = false

        this.restore('auto_reply_content')
      },
      onEditCounterpartyLimit() {
        this.counterpartyLimitEditing = true

        this.backup('counterpartyLimit')
      },
      onEditCounterpartyLimitConfirm() {
        this.counterpartyLimitEditing = false
      },
      onEditCounterpartyLimitCancel() {
        this.counterpartyLimitEditing = false

        this.restore('counterpartyLimit')
      },
      backup(key) {
        this.backupCache[key] = this[key]
      },
      restore(key) {
        this[key] = this.backupCache[key]
      }
    }
  }
</script>
