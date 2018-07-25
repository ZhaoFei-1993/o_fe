<template>
  <div>
    <im :client="chat.imClient" :conversation-id="convId" :client-id="cid"></im>
  </div>
</template>

<script>
  import im from '~/components/im'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        convId: '5b4d9de45b90c830ff7ff15d',
        cid: '',
      }
    },
    components: {
      im,
    },
    mounted() {
      this.cid = window.localStorage.getItem('me')
    },
    computed: {
      ...mapState(['chat']),
    },
  }
</script>