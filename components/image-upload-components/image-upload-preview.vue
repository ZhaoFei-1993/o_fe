<!--图片上传、预览的组件-->
<style lang="scss">
  .image-upload-preview {

  }
</style>

<template>
  <div class="image-upload-preview">
    <ImagePreviewItem v-if="value" :image="value" @remove="onRemoveImage"/>
    <ImageUploadButton v-else text="添加二维码" @change="onSelectImage"/>
  </div>
</template>

<script>
import ImageUploadButton from './image-upload-button.vue'
import ImagePreviewItem from './image-preview-item.vue'

export default {
  name: 'image-upload-preview',
  components: {
    ImageUploadButton,
    ImagePreviewItem,
  },
  props: {
    value: [String, Object],
  },
  methods: {
    onSelectImage(image) {
      this.$emit('input', image)
    },
    onRemoveImage() {
      this.$emit('input', '')
    }
  }
}
</script>
