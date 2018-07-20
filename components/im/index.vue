<template>
  <div class="chat">
    <div class="title">
      <span>{{ conversation ? `${conversation.members.join(',')} 聊天中` : '' }}</span>
      <div style="position: absolute;right: 0;top: 0;">
        <b-btn @click="onJoin">{{ hadJoined ? '退出' : '加入' }}聊天</b-btn>
      </div>
    </div>
    <div class="content" ref="chatbox">
      <div v-for="item in msgLog">
        <div v-if="item.from === myClientId">
          <div class="msg-box-right">
            <div class="msg-text">{{ item._lctext }}</div>
            <div class="avatar">{{ item.from }}</div>
          </div>
        </div>
        <div v-else>
          <div class="msg-box-left">
            <div class="avatar">{{ item.from }}</div>
            <div class="msg-text">{{ item._lctext }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-box">
      <b-input-group style="height: 100%;">
        <b-form-input type="text" style="height: 100%;" v-model="message" @keyup.enter.native="onSendMsg"></b-form-input>
        <b-input-group-append>
          <b-btn @click="onSendMsg">发送</b-btn>
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>

<script>
  import { Realtime, TextMessage, Event } from 'leancloud-realtime'

  export default {
    data() {
      return {
        myClientId: '',
        yourClientId: '',
        message: '',
        myClient: null,
        conversation: null,
        limit: 20,
        messageIterator: null,
        msgLog: [],
        hadJoined: false,
      }
    },
    beforeMount() {
      this.myClientId = window.localStorage.getItem('me') || 'leo'
      this.yourClientId = window.localStorage.getItem('you') || 'jeff'
    },
    mounted() {
      const realtime = new Realtime({
        appId: 'OibOYNHFsWoqChdhAlebT7rS-gzGzoHsz',
        appKey: 'IEIfsx2I6LkRajvtP2jcoCIW',
      })
      realtime.on(Event.DISCONNECT, function () {
        console.log('服务器连接已断开')
      })
      realtime.on(Event.OFFLINE, function () {
        console.log('离线（网络连接已断开）')
      })
      realtime.on(Event.ONLINE, function () {
        console.log('已恢复在线')
      })
      realtime.on(Event.SCHEDULE, function (attempt, delay) {
        console.log(delay + 'ms 后进行第' + (attempt + 1) + '次重连')
      })
      realtime.on(Event.RETRY, function (attempt) {
        console.log('正在进行第' + (attempt + 1) + '次重连')
      })
      realtime.on(Event.RECONNECT, function () {
        console.log('与服务端连接恢复')
      })
      realtime.createIMClient(this.myClientId, {
        signatureFactory: this.signatureFactory,
        conversationSignatureFactory: this.conversationSignatureFactory,
      }).then(myClient => {
        this.myClient = myClient
        myClient.on(Event.MESSAGE, this.messageHandler)

        return myClient.createConversation({
          members: [this.yourClientId],
          name: `${this.myClientId} & ${this.yourClientId} 聊天`,
          unique: true,
        })
      }).then(conversation => {
        this.conversation = conversation
        // 有用户被添加至某个对话
        conversation.on(Event.MEMBERS_JOINED, function membersjoinedEventHandler(payload) {
          console.log('MEMBERS_JOINED', payload.members, payload.invitedBy)
        })
        // 有成员被从某个对话中移除
        conversation.on(Event.MEMBERS_LEFT, function membersleftEventHandler(payload) {
          console.log('MEMBERS_LEFT', payload.members, payload.kickedBy)
        })
        // 当前用户被添加至某个对话
        conversation.on(Event.INVITED, function invitedEventHandler(payload) {
          console.log('INVITED', payload.invitedBy)
        })
        // 当前用户被从某个对话中移除
        conversation.on(Event.KICKED, function kickedEventHandler(payload) {
          console.log('KICKED', payload.kickedBy)
        })
        this.messageIterator = conversation.createMessagesIterator({
          limit: this.limit,
        })
        this.initMsgLog()
      })
    },
    methods: {
      signatureFactory(clientId) {
        return this.axios.chat.connect({
          client_id: clientId,
        })
      },
      conversationSignatureFactory(conversationId, clientId, targetIds, action) {
        return this.axios.chat.startConversation({
          conv_id: conversationId,
          client_id: clientId,
          members: targetIds.join(','),
          action,
        })
      },
      messageHandler(msg) {
        this.msgLog.push(msg)
        this.scrollToBottom()
      },
      initMsgLog() {
        this.messageIterator.next().then((res) => {
          if (res.value) {
            this.msgLog = res.value.concat(this.msgLog)
            this.scrollToBottom()
          }
        })
      },
      onJoin() {
        if (!this.hadJoined) {
          const realtime = new Realtime({
            appId: 'OibOYNHFsWoqChdhAlebT7rS-gzGzoHsz',
            appKey: 'IEIfsx2I6LkRajvtP2jcoCIW',
          })
          realtime.createIMClient('May', {
            signatureFactory: this.signatureFactory,
            conversationSignatureFactory: this.conversationSignatureFactory,
          }).then(client => {
            return client.getConversation(this.conversation.id)
          }).then(conversation => {
            return conversation.join()
          }).then(conversation => {
            this.myClientId = 'May'
            this.hadJoined = true
            this.conversation = conversation
            this.messageIterator = conversation.createMessagesIterator({
              limit: this.limit,
            })
            this.initMsgLog()
          }).catch(console.error)
        } else {
          this.conversation.quit().then(conversation => {
            this.hadJoined = false
            console.log('退出成功', conversation.members)
          }).catch(console.error)
        }
      },
      onSendMsg() {
        const msg = this.message.trim()
        if (msg) {
          this.conversation.send(new TextMessage(msg)).then(item => {
            this.msgLog.push(item)
            this.message = ''
            this.scrollToBottom()
          }).catch(console.error)
        }
      },
      scrollToBottom() {
        const tid = setTimeout(() => {
          const target = this.$refs.chatbox
          target.scrollTop = target.scrollHeight
          clearTimeout(tid)
        }, 100)
      },
    },
  }
</script>

<style lang="scss">
  .chat {
    width: 400px;
    height: 800px;
    background-color: #fff;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .title {
      position: relative;
      width: 100%;
      height: 30px;
      background-color: #ccc;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
    .content {
      overflow-y: scroll;
      flex: 10;
      padding: 10px 5px;
    }
    .input-box {
      flex: 1;
      width: 100%;
    }
    .msg-box-left {
      display: flex;
      justify-content: flex-start;
      margin-top: 15px;
      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 100px;
        background-color: #ccc;
        font-size: 18px;
        line-height: 44px;
        text-align: center;
        overflow: hidden;
      }
      .msg-text {
        margin-left: 10px;
        height: fit-content;
        max-width: 200px;
        padding: 5px;
        border: solid 1px #ccc;
        border-radius: 5px;
        word-wrap: break-word;
      }
    }
    .msg-box-right {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 100px;
        background-color: #ccc;
        font-size: 18px;
        line-height: 44px;
        text-align: center;
        overflow: hidden;
      }
      .msg-text {
        margin-right: 10px;
        height: fit-content;
        max-width: 200px;
        padding: 5px;
        border: solid 1px #ccc;
        border-radius: 5px;
        word-wrap: break-word;
      }
    }
  }
</style>
