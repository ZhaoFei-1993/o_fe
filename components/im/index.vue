<template>
  <div class="chat">
    <div class="content" ref="chatbox">
      <div v-for="item in msgLog">
        <div v-if="item.from === myClientId">
          <div class="msg-time">
            {{ item.time | getTimeText }}
          </div>
          <div class="msg-box-right">
            <div class="msg-detail-wrapper">
              <div class="msg-username username-right">{{ item.from }}</div>
              <div class="msg-text">{{ item._lctext }}</div>
            </div>
            <UserAvatar :username="item.from" color="#c5f0f0" :online="false" :size="40"></UserAvatar>
          </div>
        </div>
        <div v-else>
          <div class="msg-time">
            {{ item.time | getTimeText }}
          </div>
          <div class="msg-box-left">
            <UserAvatar :username="item.from" color="#c5f0f0" :online="false" :size="40"></UserAvatar>
            <div class="msg-detail-wrapper">
              <div class="msg-username username-left">{{ item.from }}</div>
              <div class="msg-text">{{ item._lctext }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-box">
      <b-input-group style="height: 100%;border-top: solid 1px #dddddd;">
        <b-form-input placeholder="输入信息，回车发送" type="text" style="height: 100%;border: 0;" v-model="message" @keyup.enter.native="onSendMsg"></b-form-input>
        <b-input-group-append>
          <b-btn @click="onSendMsg" style="background-color: #fff;border: 0;"></b-btn>
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>

<script>
  import UserAvatar from '~/components/user-avatar.vue'
  import { Realtime, TextMessage, Event } from 'leancloud-realtime'

  export default {
    data() {
      return {
        myClientId: 'leo',
        yourClientId: 'jeff',
        message: '',
        myClient: null,
        conversation: null,
        limit: 20,
        messageIterator: null,
        msgLog: [{
          _lctext: 'fadfasfasf飞机啊方法和规范哈算法舒服哈市法拉伐法是否好看',
          from: 'leo',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'hfksgsafa',
          from: 'jeff',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'fadfasfasf',
          from: 'leo',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'hfksgsafa',
          from: 'jeff',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'fadfasfasf',
          from: 'leo',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'hfksgsafa',
          from: 'jeff',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'fadfasfasf',
          from: 'leo',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'hfksgsafa',
          from: 'jeff',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'fadfasfasf',
          from: 'leo',
          time: parseInt(Date.now() / 1000),
        }, {
          _lctext: 'hfksgsafa',
          from: 'jeff',
          time: parseInt(Date.now() / 1000),
        }],
        hadJoined: false,
      }
    },
    components: {
      UserAvatar,
    },
    beforeMount() {
      this.myClientId = window.localStorage.getItem('me') || 'leo'
      this.yourClientId = window.localStorage.getItem('you') || 'jeff'
    },
    mounted() {
      return;
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
    height: 480px;
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
      padding: 10px 30px;
    }
    .input-box {
      flex: 1;
      width: 100%;
    }
    .msg-username {
      font-size: 12px;
      color: #9b9b9b;
    }
    .msg-time {
      text-align: center;
      color: #9b9b9b;
      font-size: 12px;
    }
    .msg-box-left {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;
      .msg-detail-wrapper {
        padding-left: 10px;
        .username-left {
          text-align: left;
        }
        .msg-text {
          position: relative;
          margin-top: 7px;
          float: left;
          width: fit-content;
          height: fit-content;
          max-width: 250px;
          padding: 5px;
          border-radius: 4px;
          word-wrap: break-word;
          background-color: #f9f9f9;
          &::after {
            content: "";
            position: absolute;
            display: block;
            border-style: solid;
            border-color: #f9f9f9 transparent transparent;
            border-right-color: #f9f9f9;
            border-width: 8px;
            border-left-color: transparent;
            border-left-width: 0;
            border-top-color: transparent;
            margin: -8px 0 0;
            top: 15px;
            left: -8px;
            right: auto;
            bottom: auto;
          }
        }
      }
    }
    .msg-box-right {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      .msg-detail-wrapper {
        padding-right: 10px;
        .username-right {
          text-align: right;
        }
        .msg-text {
          position: relative;
          margin-top: 7px;
          float: right;
          padding-right: 10px;
          width: fit-content;
          height: fit-content;
          max-width: 250px;
          padding: 5px;
          border-radius: 4px;
          word-wrap: break-word;
          background-color: #f9f9f9;
          &::after {
            content: "";
            position: absolute;
            display: block;
            border-style: solid;
            border-color: #f9f9f9 transparent transparent;
            border-left-color: #f9f9f9;
            border-width: 8px;
            border-right-color: transparent;
            border-right-width: 0;
            border-top-color: transparent;
            margin: -8px 0 0;
            top: 15px;
            right: -8px;
            left: auto;
            bottom: auto;
          }
        }
      }
    }
  }
</style>
