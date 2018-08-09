/* @i18n $t */
import {required, minLength, maxLength} from 'vuelidate/lib/validators'

/**
 * 获取payment的表单配置，由于需要i18n，所以需要传入 $t 和 $tt 函数
 * @param $t i18n.js中的函数，用于自动替换，文件顶部的pragma
 * @param $tt i18n.js中的函数
 * @return {{bankValidations: {bank: {validation: {required: *}, message: {required: string}}, branch: {validation: {required: *, minLength: *, maxLength: *}, message: {required: string, minLength: *, maxLength: *}}, account_no: {validation: {required: *, minLength: *, maxLength: *}, message: {required: string, minLength: *, maxLength: *}}}, baseValidation: {method: {validation: {required: *}, message: {required: string}}, account_name: {validation: {required: *, minLength: *, maxLength: *}, message: {required: string, minLength: *, maxLength: *}}, account_no: {validation: {required: *, minLength: *, maxLength: *}, message: {required: string, minLength: *, maxLength: *}}}}}
 */
export default function getConfig($t, $tt) {
  return {
    bankValidations: {
      bank: {
        validation: {
          required,
        },
        message: {
          required: '请选择开户银行'
        }
      },
      branch: {
        validation: {
          minLength: minLength(4),
          maxLength: maxLength(30)
        },
        message: {
          minLength: $tt('最小长度为{0}', 4),
          maxLength: $tt('最大长度为{0}', 30)
        }
      },
      account_no: {
        validation: {
          required,
          minLength: minLength(12),
          maxLength: maxLength(20),
        },
        message: {
          required: '请输入银行卡号',
          minLength: $tt('最小长度为{0}', 12),
          maxLength: $tt('最大长度为{0}', 20)
        }
      }
    },

    baseValidations: {
      method: {
        validation: {
          required,
        },
        message: {
          required: '请选择支付方式类型'
        }
      },
      account_name: {
        validation: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20),
        },
        message: {
          required: '请输入姓名',
          minLength: $tt('最小长度为{0}', 2),
          maxLength: $tt('最大长度为{0}', 20)
        }
      },
      account_no: {
        validation: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(30),
        },
        message: {
          required: '请输入账号',
          minLength: $tt('最小长度为{0}', 4),
          maxLength: $tt('最大长度为{0}', 30)
        }
      }
    }
  }
}
