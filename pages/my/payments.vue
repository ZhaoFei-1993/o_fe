<style lang="scss">
  .page-my-payments {

  }
</style>

<template>
  <My2Column>
    <MySidebar slot="left"></MySidebar>
    <CBlock slot="right">
      <h3>
        支付方式
        <b-btn @click="onAddPayment" variant="success">添加支付方式</b-btn>
      </h3>
      <p>被激活的支付方式将在交易时向买方展示，最多激活3种</p>
      <MyInfoItem title="银行卡">
        <p slot="content">中国</p>
        <div slot="action">
          <b-btn size="xxs" variant="plain">修改</b-btn>
          <ToggleButton></ToggleButton>
        </div>
      </MyInfoItem>
    </CBlock>
    <b-modal title="添加支付方式" v-model="modalShowing">
      <b-form>
        <b-form-group label="类型" horizontal>
          <b-form-select v-model="form.paymentType" :options="paymentsOptions"></b-form-select>
        </b-form-group>

        <div v-if="form.paymentType">
          <b-form-group label="姓名">
            <b-form-input v-model="form.username"></b-form-input>
          </b-form-group>

          <div v-if="form.paymentType === 'bank'">
            <b-form-group label="开户银行">
              <b-form-select v-model="bank.bank_id" :options="bankList"></b-form-select>
            </b-form-group>
            <b-form-group label="开户支行">
              <b-form-input v-model="bank.bank_branch_name"></b-form-input>
            </b-form-group>
            <b-form-group label="银行卡号">
              <b-form-input v-model="bank.bank_card_number"></b-form-input>
            </b-form-group>
          </div>

          <div v-if="form.paymentType === 'alipay'">
            <b-form-group label="支付宝账号">
              <b-form-input v-model="alipay.alipay_account"></b-form-input>
            </b-form-group>
            <b-form-group label="收款二维码">
              <b-form-input v-model="alipay.alipay_qrcode"></b-form-input>
              <p>为确保二维码正确，请添加后先自己进行扫描测试</p>
            </b-form-group>
          </div>

          <div v-if="form.paymentType === 'wechat'">
            <b-form-group label="支付宝账号">
              <b-form-input v-model="wechat.wechat_account"></b-form-input>
            </b-form-group>
            <b-form-group label="收款二维码">
              <b-form-input v-model="wechat.wechat_qrcode"></b-form-input>
              <p>为确保二维码正确，请添加后先自己进行扫描测试</p>
            </b-form-group>
          </div>

          <b-form-group label="短信验证码">
            <b-form-input v-model="form.sms_code"></b-form-input>
            <b-btn @click="onSendSmsCode">发送验证码</b-btn>
          </b-form-group>
        </div>
      </b-form>
    </b-modal>
  </My2Column>
</template>

<script>
import MySidebar from './_c/my-sidebar.vue'
import My2Column from './_c/my-2column.vue'
import MyInfoItem from './_c/my-info-item.vue'
import ToggleButton from '~/components/toggle-button.vue'

export default {
  name: 'page-my-payments',
  components: {
    MySidebar,
    My2Column,
    MyInfoItem,
    ToggleButton,
  },
  data() {
    return {
      form: {
        paymentType: '',
        sms_code: '',
        username: '',
      },
      bank: {
        bank_id: '',
        bank_branch_name: '',
        bank_card_number: '',
      },
      alipay: {
        alipay_account: '',
        alipay_qrcode: '',
      },
      wechat: {
        wechat_account: '',
        wechat_qrcode: '',
      },
      modalShowing: false,

      bankList: [{
        text: '中国银行',
        value: '11'
      }, {
        text: '华夏银行',
        value: '22'
      }]
    }
  },
  computed: {
    paymentsOptions: function () {
      return [{
        value: 'bank',
        text: '银行卡'
      }, {
        value: 'alipay',
        text: '支付宝'
      }, {
        value: 'wechat',
        text: '微信'
      }]
    },
  },
  methods: {
    onAddPayment() {
      console.log(1)
      this.modalShowing = true
    },
    onSendSmsCode() {
      console.log('发送验证码')
    }
  }
}
</script>
