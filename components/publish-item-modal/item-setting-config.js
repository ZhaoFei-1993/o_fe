import {maxLength, maxValue, minValue, required, helpers} from 'vuelidate/lib/validators'
import constant from '~/modules/constant'

function smallerThan(compareField) {
  return helpers.withParams({ type: 'smallerThan', field: compareField }, function(value, parentVm) {
    return Number(value) < helpers.ref(compareField, this, parentVm)
  })
}

function biggerThan(compareField) {
  return helpers.withParams({ type: 'biggerThan', field: compareField }, function(value, parentVm) {
    return Number(value) > helpers.ref(compareField, this, parentVm)
  })
}

export default function getConfig($t, $tt) {
  return {
    auto_reply_content: {
      validation: {
        maxLength: maxLength(constant.MAX_AUTO_REPLY_LENGTH),
      },
      message: {
        maxLength: '最大长度为50'.replace('50', constant.MAX_AUTO_REPLY_LENGTH),
      }
    },
    min_deal_cash_amount: {
      validation: {
        maxValue: maxValue(constant.DEAL_CASH_AMOUNT.MAX),
        minValue: minValue(constant.DEAL_CASH_AMOUNT.MIN),
        smallerThan: smallerThan('max_deal_cash_amount'),
        required: required,
      },
      message: {
        maxValue: $tt('最大值为{0}', constant.DEAL_CASH_AMOUNT.MAX),
        minValue: $tt('最小值为{0}', constant.DEAL_CASH_AMOUNT.MIN),
        smallerThan: '最小值需小于最大值',
        required: required,
      }
    },
    max_deal_cash_amount: {
      validation: {
        maxValue: maxValue(constant.DEAL_CASH_AMOUNT.MAX),
        minValue: minValue(constant.DEAL_CASH_AMOUNT.MIN),
        smallerThan: biggerThan('min_deal_cash_amount'),
        required: required,
      },
      message: {
        maxValue: $tt('最大值为{0}', constant.DEAL_CASH_AMOUNT.MAX),
        minValue: $tt('最小值为{0}', constant.DEAL_CASH_AMOUNT.MIN),
        smallerThan: '最大值需大于最小值',
        required: required,
      }
    }
  }
}
