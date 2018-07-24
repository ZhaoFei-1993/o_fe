import {maxLength} from 'vuelidate/lib/validators'
import constant from '~/modules/constant'

export default function getConfig($t, $tt) {
  return {
    auto_reply_content: {
      validation: {
        maxLength: maxLength(constant.MAX_AUTO_REPLY_LENGTH),
      },
      message: {
        maxLength: '最大长度为50'.replace('50', constant.MAX_AUTO_REPLY_LENGTH),
      }
    }
  }
}
