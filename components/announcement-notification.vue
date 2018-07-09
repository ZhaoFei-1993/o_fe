<template>
  <div class="notification-container">
    <!--无论有没有消息，container都保持显示，防止页面抖动-->
    <template v-if="recent">
      <div class="title">
        <b-link :to="'/announcements/'+recent.id" class="c-brand-yellow" target="_blank"><i class="iconfont icon-sound"></i> {{title}}</b-link>
      </div>
      <b-link to="/announcements/" class="c-brand-yellow">
        <span>更多></span>
      </b-link>
    </template>
  </div>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        recent: null,
      }
    },
    computed: {
      ...mapState(['lang']),
      title: function () {
        if (!this.recent) return ''
        switch (this.lang.lang) {
          case 'zh_Hans_CN':
            return this.recent.title_cn
          case 'zh_Hant_HK':
            return this.recent.title_hk
          case 'en_US':
          default:
            return this.recent.title_en
        }
      },
    },
    mounted() {
      this.axios.announcement.getAnnouncements().then(response => {
        const announcements = response.data.data
        if (announcements && announcements.length > 0) {
          this.recent = announcements.sort((a, b) => new Date(b.announce_time) - new Date(a.announce_time))[0]
        }
      })
    },
  }
</script>
<style lang="scss" scoped>
  .notification-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    min-height: 41px;
    line-height: 20px;
    padding: 10px 32px;
    font-size: 14px;
    color: #f5a623;
    box-shadow: 0 0 20px 0 #ececec;
    background-color: #fffcf6;

    .title {
      display: flex;
      align-items: center;
      .iconfont {
        margin-right: 1rem;
      }
    }

  }
</style>
