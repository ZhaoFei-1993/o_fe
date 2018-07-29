<template>
  <b-pagination class="via-pagination" :total-rows="totalRows" :value="currentPage" :per-page="perPage"
                @change="onPagerChange" prev-text="上一页" next-text="下一页"
                :hide-goto-end-buttons="true" :limit="4">
  </b-pagination>
</template>
<script>
  export default {
    props: {
      totalRows: {
        type: Number,
        default: 100,
      },
      currentPage: {
        type: Number,
        default: 1,
      },
      perPage: {
        type: Number,
        default: 10,
      },
    },
    methods: {
      onPagerChange(page) {
        this.$emit('change', page)
        this.$emit('input', page)
      }
    }
  }
</script>
<style lang="scss">
  .via-pagination {

    li.page-item {
      a.page-link {
        &:focus {
          outline: none;
          box-shadow: none;
        }
      }
    }

  }
</style>
