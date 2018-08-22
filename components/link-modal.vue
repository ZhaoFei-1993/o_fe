<style lang="scss">
  .link-modal {
    text-align: center;
    .actions {
      margin-top: 24px;
      button {
        margin: 0 10px;
        width: 160px;
        height: 42px;
      }
    }
  }
</style>
<template>
  <b-modal class="link-modal"
           :visible="value" @hide="hideModal"
           :title="title || '提示'"
           :hide-footer="true"
           :noCloseOnBackdrop="true">
    <div>
      {{content}}
    </div>
    <div class="actions">
      <b-btn size="sm" variant="outline-green" @click="hideModal">取消</b-btn>
      <b-link v-if="isOutLink" :href="link">
        <b-btn size="sm" variant="gradient-yellow">{{linkText}}</b-btn>
      </b-link>
      <b-link v-else :to="link">
        <b-btn size="sm" variant="gradient-yellow">{{linkText}}</b-btn>
      </b-link>
    </div>
  </b-modal>
</template>
<script>
  export default {
    props: {
      isOutLink: {
        required: true,
        type: Boolean,
      },
      link: {
        required: true,
        type: String,
      },
      content: {
        required: true,
        type: String,
      },
      title: {
        required: false,
        type: String,
      },
      linkText: {
        required: true,
        type: String,
      },
      value: {
        required: true,
        type: Boolean,
      },
    },
    methods: {
      hideModal() {
        this.$emit('input', false)
      },
    }
  }
</script>
