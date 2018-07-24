<style lang="scss">
  @import "~assets/scss/variables.scss";

  .image-preview-item {
    position: relative;
    height: 120px;
    width: 120px;
    background: rgba(0, 0, 0, 0.1) no-repeat center;
    background-size: cover;
    background-origin: content-box;

    .item-delete-image {
      display: none;
      position: absolute;
      top: -12px;
      right: -12px;
      height: 24px;
      width: 24px;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      background-color: #fff;
      box-shadow: 0 2px 4px 0 rgba(25, 35, 48, 0.17);
      color: $brandYellow;
      cursor: pointer;

      .icon-trash {
        font-size: 12px;
      }
    }

    &:hover .item-delete-image {
      display: flex;
    }
  }
</style>

<template>
  <div class="image-preview-item" :style="{backgroundImage: `url(${image.blob || image.url || image})`}">
    <div class="item-delete-image" @click="onRemove">
      <i class="iconfont icon-trash"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'image-preview-item',
  components: {
  },
  props: {
    image: {
      type: [Object, String],        // { url, blob } 或者  url
    },
  },
  methods: {
    onRemove() {
      this.$emit('remove')
    },
  },
}
</script>
