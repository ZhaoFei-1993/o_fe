<style lang="scss">
  @import "~assets/scss/variables.scss";

  .image-upload-button {
    position: relative;
    width: 120px;
    height: 120px;
    font-size: 16px;
    line-height: 120px;
    overflow: hidden;
    text-align: center;
    background-color: #f9f9f9;
    color: $brandYellow;

    .icon-plus {
      display: inline-block;
      margin-right: 1px;
      vertical-align: middle;
    }

    input[type=file] {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
</style>

<template>
  <label class="image-upload-button">
    <i class="iconfont icon-plus"></i>
    {{text}}
    <b-form-file type="file" @change="onAddImage" multiple plain
                 accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp">
    </b-form-file>
  </label>
</template>

<script>
export default {
  name: 'image-upload-button',
  components: {
  },
  props: {
    'text': {
      type: String,
    },
  },
  methods: {
    onAddImage(event) {
      for (const file of event.target.files) {
        if (!this.utils.isImage(file.name)) {
          this.$showTips('仅限图片格式', 'error')
          return false
        }
        if (file.size > 10000000) {
          this.$showTips('单个图片大小不可超过10M', 'error')
          return false
        }

        const URL = window.URL || window.webkitURL
        let blob = ''

        if (URL && URL.createObjectURL) {
          blob = URL.createObjectURL(file)
        }
        const image = {
          name: file.name, // 名字
          file: file,
          blob: blob,
          size: file.size,      // 大小
          time: Date.now(),
        }
        this.$emit('change', image)
      }
    },
  },
}
</script>
