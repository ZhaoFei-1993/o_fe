<style lang="scss">
  @import "~assets/scss/variables.scss";

  .error-message {
    color: $red;
    margin-top: 4px;
  }
</style>
<!--和vuelidate 强绑定，根据其校验结果和配置的message来显示表单校验结果-->
<script>
  export default {
    name: 'error-message',
    props: {
      name: String,
      result: Object,     // vuelidate 针对表单字段的校验结果
      msgs: Object        // 字段的错误提示信息
    },
    computed: {
      i18ntext: function () {
        return {
          errorMessage: '请正确填写该字段'
        }
      }
    },
    render() {
      const result = this.result
      const msgs = this.msgs

      if (!result || !result.$error) return

      for (let validationName in result) {
        if (!result[validationName] && msgs[validationName]) {
          return <div class="error-message">{msgs[validationName]}</div>
        }
      }
      return <div class="error-message">{this.i18ntext.errorMessage}</div>
    }
  }
</script>
