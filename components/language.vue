<style lang="scss">
  .component-language {
    /*display: inline-block;*/
  }
</style>

<script>
  export default {
    name: 'question-top',
    props: {
      text: {
        type: String,
        default: '',
      },
      tag: {      // 渲染什么标签
        type: String,
        default: 'span'
      },
    },

    computed: {
      'parts': function() {
        const text = this.text
        return text
          .replace(/\[(.+?)\].*?\[\/\1\]/g, value => {
            return `#@#${value}#@#`
          })
          .split('#@#')
          .map(value => {
            const regx = /\[(.+?)\](.*?)\[\/\1\]/
            const matchs = regx.exec(value)
            return matchs ? [matchs[2], matchs[1]] : [value]
          })
      },
    },

    render(h) {
      const children = this.parts.map(part => {
        const value = part[0]
        const identifier = part[1]

        if (identifier) {
          const scopedRender = this.$scopedSlots[identifier]

          if (scopedRender) return scopedRender({value, text: value})

          return this.$slots[identifier]
        } else {
          return value
        }
      })

      return h(this.tag, {
        class: 'component-language'
      }, children)
    }
  }
</script>
