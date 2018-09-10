<style lang="scss">
  .publish-item-button {
    display: inline-block;
  }
</style>

<template>
  <div class="publish-item-button">
    <div @click="onShowModal">
      <slot/>
    </div>
    <PublishModal v-model="modalShowing" @published="onPublished"/>
    <LinkModal v-model="showConstraintModal"
               :content="itemLimitReason||'您今日已取消交易3次，无法发布和上架广告'"
               title="发布广告限制"
               linkText="查看规则"
               link="//support.coinex.com/hc/articles/360007643734"
               :isOutLink="true">
    </LinkModal>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import PublishModal from './index'
  import LinkModal from '~/components/link-modal'

  export default {
    name: 'publish-item-button',
    components: {
      PublishModal,
      LinkModal,
    },
    data() {
      return {
        modalShowing: false,
        showConstraintModal: false,
        itemLimitReason: null,
      }
    },
    computed: {
      ...mapState(['user', 'constant']),
      ...mapGetters(['paymentEnabled']),
    },
    mounted() {
      this.$store.dispatch('fetchUserMerchant').catch(() => {
      })
      this.$store.dispatch('fetchUserPayments').catch(() => {
      })
    },
    methods: {
      async onShowModal() {
        if (!this.user.account) {
          window.location.href = `${this.constant.loginPage}?redirect=${encodeURIComponent(this.constant.webDomain + this.$route.fullPath)}`
          return
        }

        if (!(this.user.merchant && this.user.merchant.auth_status === this.constant.MERCHANT_AUTH_STATUS.PASS)) {
          this.$showDialog({
            title: '商家认证',
            content: '您需要成为认证商家后，才可以发布广告',
            okTitle: '去认证',
            onOk: () => {
              this.$router.push('/my/merchant')
            }
          })

          return
        }
        const constraintResponse = await this.axios.user.dynamicConstraint()
        const constraint = constraintResponse.data
        if (!constraint.can_publish_item) {
          this.showConstraintModal = true
          this.itemLimitReason = constraint.item_limit_reason
          return
        }

        if (!this.paymentEnabled) {
          this.$showDialog({
            title: '开启支付方式',
            content: '您需要开启支付方式后，才可以发布广告',
            okTitle: '去开启',
            onOk: () => {
              this.$router.push('/my/payments')
            }
          })

          return
        }

        this.modalShowing = true
      },
      onPublished(item) {
        this.$emit('published', item)
        this.modalShowing = false

        this.$router.push({
          path: '/',
          query: {
            side: item.side === this.constant.SIDE.BUY ? this.constant.SIDE.SELL : this.constant.SIDE.BUY,    // 用户的side和商家的side刚好是反的
            coin: item.coin_type,
          }
        })
      }
    }
  }
</script>
