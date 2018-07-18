<!--button样式的切换tab-->
<style lang="scss">
  .tab-buttons {
    .tab-button {
      margin-right: 10px;
    }
  }
</style>

<template>
  <div class="tab-buttons">
    <b-button v-for="(tab, index) in tabs" class="tab-button" :variant="value === tab.value ? 'yellow' : 'outline-yellow'" size="sm" @click="onClick(index)">
      {{tab.text}}
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'tab-buttons',
  components: {
  },
  props: {
    value: [Number, String],
    tabs: Array,      // Array<{text:String, value:String}>
  },
  methods: {
    onClick(index) {
      this.$emit('input', index)
      // this.$emit('click', index)
    },
  },
}
</script>
