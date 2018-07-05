<style lang="scss">
  .avatar {
    height: 24px;
    width: 24px;
    border-radius: 100%;
    background: #d8d8d8 url("./avatar-gray.svg") no-repeat center;
    background-size: cover;

    &._colorful {
      background-image: url("./avatar-colorful.svg");
    }
  }
</style>

<template>
  <div class="avatar" :class="{_colorful: colorful}" :style="style"></div>
</template>

<script>
  export default {
    name: 'avatar',
    components: {
    },
    props: {
      size: [Number, String],
      colorful: Boolean
    },
    computed: {
      'style': function () {
        const size = this.size
        if (size) {
          return {
            height: `${size}px`,
            width: `${size}px`
          }
        }
      }
    }
  }
</script>
