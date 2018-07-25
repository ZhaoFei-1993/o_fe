<style lang="scss">
  @import "~assets/scss/variables.scss";

  .error-message {
    color: $red;
    height:21px;
    margin: 4px;
  }
</style>
<!--和vuelidate 强绑定，根据其校验结果和配置的message来显示表单校验结果-->
<script>
  export default {
    name: 'error-message',
    props: {
      result: Object,     // vuelidate 针对表单字段的校验结果
      msgs: Object,        // 字段的错误提示信息 Deprecated 废弃，尽量不要使用。用messages代替
      messages: Object,     // 字段的错误提示信息
      keyName: String,        // 索引的key,用以从result和msgs上索引数据，可为空
    },
    computed: {
      i18ntext: function () {
        return {
          errorMessage: '请正确填写该字段',
        }
      },
    },
    render() {
      const keyName = this.keyName
      const result = keyName ? this.result[keyName] : this.result
      let messages = this.messages || this.msgs
      messages = keyName ? messages[keyName] : messages

      if (!result || !result.$error) return <div class="error-message"></div>

      for (const validationName in result) {
        if (!result[validationName] && messages[validationName]) {
          return <div class="error-message">{messages[validationName]}</div>
        }
      }
      return <div class="error-message">{this.i18ntext.errorMessage}</div>
    },
  }
</script>
