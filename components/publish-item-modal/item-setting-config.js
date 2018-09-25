/* @i18n $t */
import {maxLength, maxValue, minValue, required, helpers} from 'vuelidate/lib/validators'
import {MAX_AUTO_REPLY_LENGTH, DEAL_CASH_AMOUNT, MAX_REMARK_LENGTH} from '~/modules/constant'

function smallerThan(compareField) {
  return helpers.withParams({type: 'smallerThan', field: compareField}, function (value, parentVm) {
    return Number(value) < helpers.ref(compareField, this, parentVm)
  })
}

function biggerThan(compareField) {
  return helpers.withParams({type: 'biggerThan', field: compareField}, function (value, parentVm) {
    return Number(value) > helpers.ref(compareField, this, parentVm)
  })
}

/**
 * 获取多语言版的配置
 * @param $t lang.js中的方法，用于i18n-auto插件自动替换
 * @param $tt {Function} lang.js中定义的模板替换方法
 */
export default function getConfig($t, $tt) {
  return {
    remark: {
      validation: {
        maxLength: maxLength(MAX_REMARK_LENGTH),
      },
      message: {
        maxLength: '最大长度为30'.replace('30', MAX_REMARK_LENGTH),
      },
    },
    auto_reply_content: {
      validation: {
        maxLength: maxLength(MAX_AUTO_REPLY_LENGTH),
      },
      message: {
        maxLength: '最大长度为50'.replace('50', MAX_AUTO_REPLY_LENGTH),
      }
    },
    min_deal_cash_amount: {
      validation: {
        maxValue: maxValue(DEAL_CASH_AMOUNT.MAX),
        minValue: minValue(DEAL_CASH_AMOUNT.MIN),
        smallerThan: smallerThan('max_deal_cash_amount'),
        required: required,
      },
      message: {
        maxValue: $tt('最大值为{0}', DEAL_CASH_AMOUNT.MAX),
        minValue: $tt('最小值为{0}', DEAL_CASH_AMOUNT.MIN),
        smallerThan: '最小值需小于最大值',
        required: required,
      }
    },
    max_deal_cash_amount: {
      validation: {
        maxValue: maxValue(DEAL_CASH_AMOUNT.MAX),
        minValue: minValue(DEAL_CASH_AMOUNT.MIN),
        smallerThan: biggerThan('min_deal_cash_amount'),
        required: required,
      },
      message: {
        maxValue: $tt('最大值为{0}', DEAL_CASH_AMOUNT.MAX),
        minValue: $tt('最小值为{0}', DEAL_CASH_AMOUNT.MIN),
        smallerThan: '最大值需大于最小值',
        required: required,
      }
    }
  }
}
