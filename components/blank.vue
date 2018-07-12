<template>
  <div class="component-blank">
    <i class="icon iconfont icon-blank"></i>
    <span class="text">{{localText}}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  mounted() {

  },
  data() {
    return {
    }
  },
  computed: {
    localText() {
      return this.text || '无内容'
    },
  },
}
</script>

<style lang="scss">
.component-blank {
  text-align: center;
  background: #fff;
  height: 115px;
  line-height: 115px;
  color: #898989;

  .icon-blank {
    margin-right: 10px;
    vertical-align: baseline;
  }
}
</style>
